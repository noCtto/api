export default function author(ids, items, handler, ctxt) {
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
