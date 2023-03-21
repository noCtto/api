import type { Context } from "moleculer";
import { CommentThis } from '../../comments.service';

export default function get(this:CommentThis, ctx:Context & { params: any }) {
  ctx.params.populate = ['author'];
};
