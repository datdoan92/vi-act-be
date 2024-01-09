# Stage 1: Builder
FROM node:20.10.0-alpine3.18 AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

# Stage 2: Runner
FROM node:20.10.0-alpine3.18

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json /usr/src/app/yarn.lock ./

RUN yarn install

EXPOSE 3000

CMD ["yarn", "start:prod"]
