export default function votes(ids, items, handler, ctxt) {
  return Promise.all(
    items.map((item) =>
      ctxt
        .call('votes.get', {
          id: item?.vid?.toString(),
          populate: ['count', 'voted'],
          fields: ['_id', 'pid', 'tid', 'count', 'voted'],
        })
        .then((data) => {
          const o = item;
          o.votes = data;
          return o;
        })
    )
  );
};
