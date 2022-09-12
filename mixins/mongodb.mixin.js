/* eslint-disable global-require */
const DbService = require('moleculer-db');
const MongoDbAdapter = require('moleculer-db-adapter-mongo');
require('dotenv').config();

module.exports = (collection, database) => {
  const { MONGO_URI } = process.env;

  return {
    name: collection,
    mixins: [DbService],
    adapter: new MongoDbAdapter(`${MONGO_URI}/${database}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    collection,
    settings: {
      maxPageSize: 500,
    },
  };
};
