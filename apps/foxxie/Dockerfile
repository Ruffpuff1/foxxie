FROM node:20

WORKDIR /

COPY package.json .
COPY tsconfig.base.json tsconfig.base.json

RUN yarn install

COPY scripts/ scripts/
COPY src/ src/
COPY prisma/ prisma/
COPY assets/ assets/

RUN yarn run prisma generate \ && yarn run build

ENV NODE_ENV="production"

COPY .env .env

CMD [ "yarn", "start" ]