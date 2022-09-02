/* eslint-disable global-require */
const DbService = require('moleculer-db');
const MongoDbAdapter = require('moleculer-db-adapter-mongo');
require('dotenv').config();

module.exports = (collection, database = 'nocheto') => {
  const { CONN_USER, CONN_PASSWORD, CONN_HOST, CONN_PORT } = process.env;

  return {
    name: collection,
    mixins: [DbService],
    adapter: new MongoDbAdapter(
      `mongodb://${
        CONN_USER && CONN_PASSWORD ? `${CONN_USER}:${CONN_PASSWORD}@` : ''
      }${CONN_HOST}:${CONN_PORT || '27017'}/${database}?ssl=false&authSource=admin`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    ),
    collection,
    settings: {
      maxPageSize: 500,
    },
  };
};
