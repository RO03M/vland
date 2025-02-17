FROM node:23.6.0-alpine AS builder

WORKDIR /app

COPY package.json .

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

RUN yarn preview
