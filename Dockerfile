# Use official Node.js runtime
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy backend package files first (for caching)
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy all backend source code
COPY backend/ .

# Expose the port (Railway sets process.env.PORT automatically)
EXPOSE 4000

# Start the backend from src/server.js
CMD ["node", "src/server.js"]
