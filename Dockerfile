# FROM node

# # Set working directory inside the container
# WORKDIR /app

# # Copy package.json and package-lock.json (if exists)
# COPY src/package.json /app

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code
# COPY . .

# # Command to run your application
# CMD ["node", "bot.mjs"]




# Use an official Node.js runtime as a parent image
FROM node

# Set the working directory to /app
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json from the src directory
COPY ./src/package*.json ./

# Install any needed packages
RUN npm install

# Copy the rest of the application code from the src directory
COPY ./src ./

# Make port 3000 available to the outside world
EXPOSE 3000

# Define environment variable (optional, add if necessary)
# ENV NODE_ENV=production

# Run the bot.mjs script
CMD ["node", "bot.mjs"]
