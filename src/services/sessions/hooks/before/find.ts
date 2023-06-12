
import { ObjectId } from 'mongodb';
import type { Context } from "moleculer";
import type { MicroService } from '@lib/microservice';

export default async function find(this:MicroService, ctx: Context & { params: any }) {
  if (ctx.params.query.user) {
    ctx.params.query.user = new ObjectId(ctx.params.query.user);
  }
};
