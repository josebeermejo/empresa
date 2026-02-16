FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install -g pnpm@9
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build
RUN pnpm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config for SPA
RUN echo 'server { \
  listen 5173; \
  location / { \
    root /usr/share/nginx/html; \
    index index.html; \
    try_files $uri $uri/ /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
