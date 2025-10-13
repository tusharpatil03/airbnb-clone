# Use the exact Node.js version you need
FROM node:20.11.0-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy only package files first for better caching
COPY package*.json ./

# Install dependencies
# `npm ci` ensures reproducible installs using package-lock.json if present
RUN npm ci --omit=dev

# Copy the rest of the app
COPY . .

# Expose the port your app uses (change if needed)
EXPOSE 3000

# Default command to start your app
CMD ["npm", "start"]