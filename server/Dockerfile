# Use the official Puppeteer image
FROM ghcr.io/puppeteer/puppeteer:latest

# Switch to root to fix permission issues during install
USER root

# Set the working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Fix permissions for the working directory
RUN chown -R pptruser:pptruser /usr/src/app

# Switch back to the puppeteer user
USER pptruser

# Install dependencies
RUN npm install

# Copy the rest of your code
COPY --chown=pptruser:pptruser . .

# Expose port
EXPOSE 10000

# Start the server
CMD ["node", "server.js"]