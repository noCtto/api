const { ObjectId } = require('mongodb');

module.exports = async function find(ctx) {
  if (ctx.params.query.user) {
    ctx.params.query.user = ObjectId(ctx.params.query.user);
  }
};
