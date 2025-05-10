FROM node:slim AS builder

WORKDIR /app

COPY package.json ./
RUN npm install

# Copy all files
COPY . .

# Make all binaries in node_modules/.bin executable
RUN chmod +x node_modules/.bin/*

# Now run the build
RUN npm run build