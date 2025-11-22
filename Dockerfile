# Use official Node.js runtime
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only package files first for caching
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy all backend code
COPY backend/ .

# Expose the port your app listens on (should match your code)
EXPOSE 5000

# Run the backend
CMD ["npm", "start"]
