import fetch from 'node-fetch';
import TelegramBot from 'node-telegram-bot-api';
import { CronJob } from 'cron';

const telegramToken = '7271006242:AAGxqf5j0lqLMjp8Jn_z0NXGDlr9FlyXrds';

const bot = new TelegramBot(telegramToken, { polling: true });
let subscribers = [];
let pricesByDay = {};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    if (!subscribers.includes(chatId)) {
        subscribers.push(chatId);
        bot.sendMessage(chatId, "You have subscribed to Bitcoin price updates.");
    } else {
        bot.sendMessage(chatId, "You are already subscribed.");
    }
});

// Функція для отримання ціни біткоїна з Binance
async function getBitcoinPrice() {
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        const data = await response.json();
        return parseFloat(data.price);
    } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
    }
}

// Функція для форматування ціни
function formatPrice(price) {
    const roundedPrice = Math.round(price);
    return roundedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Функція для відправки ціни в Telegram
async function sendBitcoinPrice() {
    const price = await getBitcoinPrice();
    if (price) {
        const formattedPrice = formatPrice(price);
        const message = `Current Bitcoin price: $${formattedPrice}`;
        
        const dateKey = new Date().toISOString().slice(0, 10);
        if (!pricesByDay[dateKey]) {
            pricesByDay[dateKey] = [];
        }
        pricesByDay[dateKey].push(price);
        
        for (const chatId of subscribers) {
            bot.sendMessage(chatId, message);
        }
    }
}

// Функція для обробки команди /prices
bot.onText(/\/prices/, (msg) => {
    const chatId = msg.chat.id;
    const args = msg.text.split(' ');

    if (args.length < 2) {
        bot.sendMessage(chatId, "Please specify a period: day, week, or month.");
        return;
    }

    const period = args[1].toLowerCase();
    const now = new Date();
    let dateFrom;

    switch (period) {
        case 'day':
            dateFrom = new Date(now.setDate(now.getDate() - 1));
            break;
        case 'week':
            dateFrom = new Date(now.setDate(now.getDate() - 7));
            break;
        case 'month':
            dateFrom = new Date(now.setMonth(now.getMonth() - 1));
            break;
        default:
            bot.sendMessage(chatId, "Invalid period. Use day, week, or month.");
            return;
    }

    const prices = [];
    for (const [date, dailyPrices] of Object.entries(pricesByDay)) {
        if (new Date(date) >= dateFrom) {
            prices.push(...dailyPrices);
        }
    }

    if (prices.length > 0) {
        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);
        bot.sendMessage(chatId, `In the last ${period}, the highest price was $${formatPrice(maxPrice)} and the lowest price was $${formatPrice(minPrice)}.`);
    } else {
        bot.sendMessage(chatId, `No price data available for the last ${period}.`);
    }
});

// Використання cron для відправки повідомлення кожні 30 хвилин
const sendJob = new CronJob('*/30 * * * *', sendBitcoinPrice, null, true, 'America/Los_Angeles');
sendJob.start();

console.log('///    bot is working  ///');
