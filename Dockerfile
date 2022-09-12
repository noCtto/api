FROM node:alpine

COPY . .
RUN yarn install

EXPOSE 4000

CMD [ "yarn", "start" ]