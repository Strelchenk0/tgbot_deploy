import fetch from 'node-fetch';
import TelegramBot from 'node-telegram-bot-api';
import { CronJob } from 'cron';

const telegramToken = '7271006242:AAGxqf5j0lqLMjp8Jn_z0NXGDlr9FlyXrds';

const bot = new TelegramBot(telegramToken, { polling: true });
let subscribers = [];

// Налаштування команд бота
bot.setMyCommands([
    { command: '/start', description: 'Start receiving Bitcoin price updates' },
    { command: '/prices', description: 'Get the highest Bitcoin prices' }
]);

// Функція для отримання поточної ціни біткоїна з Binance
async function getBitcoinPrice() {
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        const data = await response.json();
        return data.price;
    } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
        throw new Error('Could not fetch the current Bitcoin price.');
    }
}

// Функція для відправки поточної ціни біткоїна всім підписникам
async function sendBitcoinPrice() {
    const price = await getBitcoinPrice();
    if (price) {
        const formattedPrice = formatPrice(price);
        for (const chatId of subscribers) {
            bot.sendMessage(chatId, `Current Bitcoin price: $${formattedPrice}`);
        }
    }
}

// Функція для отримання історичних цін біткоїна з CoinGecko
async function getHistoricalBitcoinPrices(period) {
    let days;

    switch (period) {
        case 'day':
            days = 1;
            break;
        case 'week':
            days = 7;
            break;
        case 'month':
            days = 30;
            break;
        case 'year':
            days = 365;
            break;
        default:
            throw new Error("Invalid period. Use 'day', 'week', 'month', or 'year'.");
    }

    const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!data.prices || data.prices.length === 0) {
            throw new Error("No price data available");
        }
        const highPrices = data.prices.map(price => price[1]); // Extracting prices
        const highestPrice = Math.max(...highPrices);
        return highestPrice;
    } catch (error) {
        console.error('Error fetching historical Bitcoin prices:', error);
        throw new Error("Failed to fetch historical prices");
    }
}

// Функція для форматування ціни
function formatPrice(price) {
    const roundedPrice = parseFloat(price).toFixed(0); // Formatting to two decimal places
    return roundedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Функція для обробки команди /start
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    if (!subscribers.includes(chatId)) {
        subscribers.push(chatId);
        try {
            const price = await getBitcoinPrice();
            const formattedPrice = formatPrice(price);
            bot.sendMessage(chatId, `From now on, the bot will monitor and send the current Bitcoin price every hour 🚀\n\nCurrent Bitcoin price: $${formattedPrice}`);
        } catch (error) {
            bot.sendMessage(chatId, "There was an error fetching the current Bitcoin price.");
        }
    } else {
        bot.sendMessage(chatId, "You are already receiving the current Bitcoin price every hour 🚀");
    }
});

// Функція для обробки команди /prices
bot.onText(/\/prices/, (msg) => {
    const chatId = msg.chat.id;
    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Day', callback_data: 'day' },
                    { text: 'Week', callback_data: 'week' },
                    { text: 'Month', callback_data: 'month' },
                    { text: 'Year', callback_data: 'year' }
                ]
            ]
        }
    };
    bot.sendMessage(chatId, "Please select a period:", options);
});

// Функція для обробки вибору періоду
bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const period = callbackQuery.data;

    try {
        const highestPrice = await getHistoricalBitcoinPrices(period);
        const formattedPrice = formatPrice(highestPrice);
        bot.sendMessage(chatId, `In the last ${period}, the highest Bitcoin price was $${formattedPrice}.`);
    } catch (error) {
        bot.sendMessage(chatId, `Error fetching data: ${error.message}`);
    }
});

// Використання cron для відправки повідомлення кожну годину
const sendJob = new CronJob('0 * * * *', sendBitcoinPrice, null, true, 'America/Los_Angeles');
sendJob.start();

console.log('///    bot is working   ///');
