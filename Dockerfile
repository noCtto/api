FROM node:18-slim AS build

WORKDIR /app

COPY package.json ./

RUN yarn install --production

COPY ./dist /app/

EXPOSE ${PORT}




# CMD ["./node_modules/moleculer/bin/moleculer-runner.js", "--env", "--config", "moleculer.config.js", "/app/servicesservice.js"]