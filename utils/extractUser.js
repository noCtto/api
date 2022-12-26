const { ObjectId } = require('mongodb');

module.exports = function extractUser(ctx) {
  let usrId = null;
  if (ctx.meta.oauth) {
    if (ctx.meta.oauth.user) {
      usrId = ctx.meta.oauth.user.id;
    } else {
      usrId = ctx.meta.oauth.id;
    }
  }
  return ObjectId(usrId);
};
