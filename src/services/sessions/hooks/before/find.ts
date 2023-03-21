
import { ObjectId } from 'mongodb';
import type { Context } from "moleculer";
import { SessionThis } from '../../sessions.service';

export default async function find(this:SessionThis, ctx: Context & { params: any }) {
  if (ctx.params.query.user) {
    ctx.params.query.user = new ObjectId(ctx.params.query.user);
  }
};
