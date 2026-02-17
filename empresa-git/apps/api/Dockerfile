FROM node:18-alpine

WORKDIR /app

# Install dependencies
RUN npm install

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Create storage directory
RUN mkdir -p /app/storage

# Expose port
EXPOSE 8080

# Start server
CMD ["npm", "start"]
