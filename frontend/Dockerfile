FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build the Next.js application
RUN npm run build

# Next.js listens on the port defined by the PORT environment variable by default
CMD ["npm", "start"]
