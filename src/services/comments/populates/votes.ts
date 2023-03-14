
export default async function votes(ids, items, handler, ctx) {
  return this.Promise.all(
    items.map((item) =>
      ctx
        .call('votes.get', {
          id: item.vid.toString(),
          populate: ['voted', 'votes', 'count', 'total'],
          fields: ['_id', 'votes', 'voted', 'count', 'total', 'd'],
        })
        .then((votes) => {
          item.votes = votes;
          return item;
        })
        .catch((err) => {
          console.log('ERROR! => Populating votes: ', err);
          item.votes = null;
          return item;
        })
    )
  );
};
