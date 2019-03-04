FROM node:latest

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm i --production
RUN mv node_modules/ node_modules_production/
RUN npm i

COPY . .
RUN npm run build

RUN rm -rf node_modules/
RUN mv node_modules_production/ node_modules/

ENV NODE_ENV production
CMD npm run up
