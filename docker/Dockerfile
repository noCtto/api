FROM node:18-slim AS build

WORKDIR /app

COPY package.json ./

RUN yarn install --production

COPY ./dist /app/dist

EXPOSE 42069

CMD ["npm", "start"]