FROM node:22

WORKDIR /

COPY package.json .
COPY yarn.lock .
COPY tsconfig.base.json tsconfig.base.json
COPY ../../.git/ ../../.git/

RUN yarn install

COPY scripts/ scripts/
COPY src/ src/
COPY prisma/ prisma/

RUN yarn run prisma generate \ && yarn run build

ENV NODE_ENV="production"

COPY .env .env

CMD [ "yarn", "start" ]