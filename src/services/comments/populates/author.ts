
export default async function author(ids, items, handler, ctx) {
  return this.Promise.all(
    items.map((item) =>
      ctx
        .call('users.get', {
          id: item.uid.toString(),
          populate: ['gravatar'],
          fields: ['username', 'email', 'imageUrl', 'createdAt'],
        })
        .then((user) => {
          item.author = user;
          return item;
        })
        .catch((err) => {
          console.log('ERROR! => Populating author: ', err);
        })
    )
  );
};
