/* eslint-disable no-param-reassign */
module.exports = function voted(ids, items, handler, ctx) {
  const user = this.extractUser(ctx);
  return items.map((item) => {
    item.voted = item.voters[String(user)] !== undefined;
    if (item.voted) item.d = item.voters[String(user)];
    return item;
  });
};
