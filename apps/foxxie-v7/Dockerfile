FROM node:22@sha256:35a5dd72bcac4bce43266408b58a02be6ff0b6098ffa6f5435aeea980a8951d7

WORKDIR /

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json tsconfig.json
COPY ../../.git/ ../../.git/

RUN yarn install

COPY scripts/ scripts/
COPY src/ src/

RUN yarn build

ENV NODE_ENV="production"

COPY .env .env

CMD [ "yarn", "start" ]
