const { ObjectId } = require('mongodb');

module.exports = function extractCompany(ctx) {
  if (ctx.meta.oauth) {
    if (ctx.meta.oauth.company) ctx.params.company = ObjectId(ctx.meta.oauth.company);
    // set company by token
    else if (ctx.meta.oauth.client) ctx.params.company = ObjectId(ctx.meta.oauth.client.clientId);
  }
  return ctx.params.company;
};
