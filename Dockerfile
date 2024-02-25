FROM node:18-slim AS build

WORKDIR /app

COPY package.json ./

RUN yarn install --production

COPY ./dist /app/

EXPOSE 3000

CMD ["npm", "start"]