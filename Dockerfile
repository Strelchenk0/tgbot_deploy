# FROM node:latest

# WORKDIR /app

# COPY . .

# RUN npm install

# EXPOSE 80

# CMD ["node", "bot.mjs"]

FROM node

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package.json /app

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Command to run your application
CMD ["node", "bot.mjs"]


