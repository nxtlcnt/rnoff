FROM node:slim AS builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . ./
RUN npm run build
