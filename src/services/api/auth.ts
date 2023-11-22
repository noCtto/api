import type { IncomingRequest, GatewayResponse } from 'moleculer-web';

export default async function withAuth(
  req: IncomingRequest & { body: any, $action: any, $ctx: any },
  res: GatewayResponse,
  action: string,
  force: boolean = true
  ) {
    console.log('Authorizing')
    res.setHeader('Content-Type', 'application/json');
    const { headers : { authorization }} = req;

    if (authorization) {
      
      if (!authorization.includes('Bearer')) {
        return res.end(JSON.stringify({ error: { code: 422, msg: "Bad authorization" }}))
      }

      try {
        const token = await req.$ctx.call('users.resolveToken', {  token: authorization.split(' ')[1]  })
        if (!token && force) throw token;
        req.$ctx.meta = { user: token }
      } catch (err) {
        return res.end(JSON.stringify(err));
      }
    }
    
    if (!authorization && force) {
      return res.end(JSON.stringify({ error: { code: 422, msg: "No authorization provided" }}))
    }
  return req.$ctx.call(action, { ...req.body, ...req.$params })
    .then((response:any) => res.end(JSON.stringify(response)))
    .catch((err:any)=>{
      res.statusCode = err.code
      return res.end(JSON.stringify(err));
    })
}