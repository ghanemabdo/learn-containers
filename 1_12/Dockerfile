FROM ubuntu:22.04

WORKDIR /src/usr/app

# Install Node.js (base image has no curl; build runs as root, so no sudo)
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash
RUN apt-get install -y nodejs

# Install deps
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
RUN npm install -g serve

# Copy sources
COPY ./public ./public
COPY ./src ./src

# Build the project
RUN npm run build

# Expose port 5001
EXPOSE 5001

CMD ["serve", "-s", "-l", "5001", "build"]
