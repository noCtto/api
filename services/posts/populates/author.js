module.exports = function author(ids, items, handler, ctxt) {
  console.log('Populating author', ids);
  return Promise.all(
    items.map((item) =>
      ctxt
        .call('users.get', {
          id: item.uid.toString(),
          populate: ['gravatar'],
        })
        .then((data) => {
          const o = item;
          o.author = data;
          return o;
        })
    )
  );
};
