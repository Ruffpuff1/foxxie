FROM node:17

WORKDIR /

COPY package*.json .

RUN yarn install

COPY src/ src/
COPY tsconfig.base.json tsconfig.base.json

RUN yarn build

ENV NODE_ENV="production"

COPY .env .env

LABEL org.opencontainers.image.source = &quot;https://github.com/FoxxieBot/packages&quot;

CMD [ "yarn", "start" ]
