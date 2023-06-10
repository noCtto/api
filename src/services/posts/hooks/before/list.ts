
import type { Context } from "moleculer";
import { PostThis } from '../../posts.service';

export default function list(this:PostThis, _ctx:Context & { params: any }) {
  // ctx.params.sort = { _id: -1, comments: -1 };
};
