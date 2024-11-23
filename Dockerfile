FROM node:20@sha256:69cf8e7dcc78e63db74ca6ed570e571e41029accdac21b219b6ac57e9aca63cf

WORKDIR /

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json tsconfig.json
COPY ../../.git/ ../../.git/

RUN yarn install

COPY scripts/ scripts/
COPY src/ src/
COPY prisma/ prisma/

RUN yarn run prisma generate \ && yarn run build

ENV NODE_ENV="production"

COPY .env .env

CMD [ "yarn", "start" ]
