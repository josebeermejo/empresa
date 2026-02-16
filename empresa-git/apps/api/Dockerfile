FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy package files
COPY package.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build TypeScript
RUN pnpm run build

# Create storage directory
RUN mkdir -p /app/storage

# Expose port
EXPOSE 8080

# Start server
CMD ["pnpm", "start"]
