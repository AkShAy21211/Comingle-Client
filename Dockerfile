# Use the official Node.js image as a base
FROM node:alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build your React TypeScript app
RUN npm run build

# Expose port 3000 (or the port your app runs on)
EXPOSE 3000

# Set environment variables (if needed)
# ENV NODE_ENV=production

# Command to run the app
CMD ["npm", "start"]
