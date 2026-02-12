FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Render's default port
EXPOSE 10000

CMD ["node", "server.js"]