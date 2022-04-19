FROM node:17

WORKDIR /

COPY package*.json .

RUN yarn install

COPY assets/ assets/
COPY scripts/ scripts/
COPY src/ src/
COPY tsconfig.json tsconfig.json
COPY prisma/ prisma/

RUN yarn prisma:gen
RUN yarn build

ENV NODE_ENV="production"

COPY .env .env

CMD [ "yarn", "start" ]
