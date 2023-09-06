FROM node:20@sha256:d9cdfd064b359b0d521cc5f775d8ac1b31da4a32d2dcdd19efa67e29148dff64

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
