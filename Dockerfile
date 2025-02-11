# Dockerfile
FROM node:lts-alpine

WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

COPY . .

# Build the application
RUN pnpm build

CMD ["pnpm", "start:prod"]