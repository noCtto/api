export default function threads(ids, items, handler, ctxt) {
  return Promise.all(
    items.map((item) =>
      ctxt
        .call('threads.get', {
          id: item.tid.toString(),
          populate: ['comments'],
        })
        .then((data) => {
          const o = item;
          o.thread = data;
          return o;
        })
    )
  );
};
