# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json ./

# Install dependencies (clean install)
RUN npm ci

# Copy application source code
COPY . .

# Build the production bundle
RUN npm run build

# Serve stage
FROM nginx:1.25-alpine

# Copy built application to Nginx public folder
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
