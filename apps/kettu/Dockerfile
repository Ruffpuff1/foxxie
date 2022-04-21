FROM node:18

WORKDIR /

COPY package*.json .

RUN yarn install

COPY src/ src/
COPY tsconfig.base.json tsconfig.base.json

RUN yarn build

ENV NODE_ENV="production"

COPY .env .env

LABEL org.opencontainers.image.source = "https://github.com/Ruffpuff1/foxxie/apps/kettu"

CMD [ "yarn", "start" ]
