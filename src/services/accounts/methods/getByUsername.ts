export default function getByUsername(username, ctx) {
  return this._find(ctx, { username: { $regex: username } }).then(([user]) => user);
};
