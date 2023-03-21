
import type { Context } from "moleculer";
import { VoteThis } from '../votes.service';

export default async function count(this:VoteThis, ids:any, items:any) {
  return items.map((item:any) => {
    const keys = Object.keys(item.voters);
    const { length } = keys;
    item.count = keys.map((key) => item.voters[key]).reduce((a, b) => a + b, 0);
    item.total = length;
    return item;
  });
};
