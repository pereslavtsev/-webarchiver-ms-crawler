FROM node:14.18.1 AS builder

LABEL org.opencontainers.image.source = "https://github.com/pereslavtsev/webarchiver-ms-cwawler"

RUN npm i -g pnpm && pnpm install glob rimraf

ARG GITHUB_TOKEN
ENV GITHUB_TOKEN=$GITHUB_TOKEN

WORKDIR /usr/src/app

COPY .npmrc .
COPY Makefile .
COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM node:14.18.1-alpine3.14

RUN apk update \
    && apk --no-cache --update add bash build-base

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Migrations
COPY tsconfig.json .
COPY package.json .
COPY Makefile .
COPY src src

CMD ["node", "dist/main"]
