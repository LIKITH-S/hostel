# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy only the backend package files first (for caching)
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend code
COPY backend/ .

# Expose the port your server uses (change if not 5000)
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
