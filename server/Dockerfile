FROM node:23.6.0-alpine AS builder

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn build

CMD ["node", "dist/index.js"]
