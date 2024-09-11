# Використовуємо базовий образ Node.js
FROM node:14

# Встановлюємо робочу директорію
WORKDIR /usr/src/app

# Копіюємо package.json і package-lock.json для встановлення залежностей
COPY package*.json ./

# Встановлюємо залежності
RUN npm install --production

# Копіюємо весь код у робочу директорію
COPY . .

# Вказуємо команду для запуску бота
CMD ["node", "bot.mjs"]
