
import { ObjectId } from 'mongodb';

export default async function find(ctx) {
  if (ctx.params.query.user) {
    ctx.params.query.user = new ObjectId(ctx.params.query.user);
  }
};
