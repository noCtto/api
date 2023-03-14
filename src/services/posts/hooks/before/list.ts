export default function list(ctx) {
  ctx.params.sort = { _id: -1, comments: -1 };
};
