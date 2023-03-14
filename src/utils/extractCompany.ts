import { ObjectId } from 'mongodb';

export default function extractCompany(ctx:any) {
  if (ctx.meta.oauth) {
    if (ctx.meta.oauth.company) ctx.params.company = new ObjectId(ctx.meta.oauth.company);
    // set company by token
    else if (ctx.meta.oauth.client) ctx.params.company = new ObjectId(ctx.meta.oauth.client.clientId);
  }
  return ctx.params.company;
}
