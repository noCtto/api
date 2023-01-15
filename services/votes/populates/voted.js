/* eslint-disable no-param-reassign */
module.exports = function voted(ids, items, handler, ctx) {
  console.log('populating voted', ctx.$meta);
  const user = this.extractUser(ctx);
  console.log('user voted', user);
  return items.map((item) => {
    item.voted = item.voters[String(user)] !== undefined;
    if (item.voted) item.d = item.voters[String(user)];
    return item;
  });
};
