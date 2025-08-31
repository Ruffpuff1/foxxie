FROM node:22@sha256:6fe286835c595e53cdafc4889e9eff903dd3008a3050c1675809148d8e0df805

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
