import fetch from 'node-fetch';
import TelegramBot from 'node-telegram-bot-api';
import { CronJob } from 'cron';

const telegramToken = '7271006242:AAGxqf5j0lqLMjp8Jn_z0NXGDlr9FlyXrds';
const chatId = '717796421'; 

const bot = new TelegramBot(telegramToken, { polling: true });
let messageIds = [];

// Функція для отримання ціни біткоїна з Binance
async function getBitcoinPrice() {
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        const data = await response.json();
        return data.price;
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
        const message = await bot.sendMessage(chatId, `Current Bitcoin price: $${formattedPrice}`);
        messageIds.push(message.message_id);
    }
}

// // Функція для видалення повідомлень
// async function deleteMessages() {
//     for (const messageId of messageIds) {
//         try {
//             await bot.deleteMessage(chatId, messageId);
//         } catch (error) {
//             console.error('Error deleting message:', error);
//         }
//     }
//     // Очищення списку ID повідомлень після видалення
//     messageIds = [];
// }

// Використання cron для відправки повідомлення кожну годину
const sendJob = new CronJob('*/30 * * * *', sendBitcoinPrice, null, true, 'America/Los_Angeles');
sendJob.start();``

// // Використання cron для видалення повідомлень кожні 24 години
// const deleteJob = new CronJob('0 0 * * *', deleteMessages, null, true, 'America/Los_Angeles');
// deleteJob.start();

console.log('///    bot is working  ///');



     