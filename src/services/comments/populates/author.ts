import type { Context } from "moleculer";
import { CommentThis } from '../comments.service';


export default async function author(this:CommentThis, _ids:any, items:any, _handler:any, ctx:Context & { params: any }) {
  return Promise.all(
    items.map((item:any) =>
      ctx
        .call('accounts.get', {
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
