# Use the official Node.js image as a base
FROM node:19.5.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build your React TypeScript app
RUN npm run  build

# Expose port 3000 (or the port your app runs on)
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
