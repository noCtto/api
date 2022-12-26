const grvtr = require('gravatar');

module.exports = function gravatar(ids, items) {
  return this.Promise.all(
    items.map((item) => {
      item.imageUrl = grvtr.url(item.email, { s: '100', r: 'x', d: 'retro' }, true);
      return item;
    })
  );
};
