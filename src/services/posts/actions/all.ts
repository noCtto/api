
export default function all(ctx) {
  return this._list(ctx, {
    populate: ['comments', 'board', 'author', 'votes'],
    fields: ['_id', 'votes', 'author', 'createdAt', 'comments', 'board', 'body', 'image'],
    sort: '-createdAt',
    page: 1,
    pageSize: 10,
  });
};
