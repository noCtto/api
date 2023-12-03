import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';
import type { Award } from '../entities'
import { ObjectId } from 'mongodb';

type Params = {
  type?: string,
  target: string,
}

const params = {
  target: {
    type: 'string',
    required: true,
  },
}

export default {
  params,
  async handler(
    this: MicroService,
    ctx: Context<Params>
  ): Promise<any> {
    console.log('awards.actions.create', ctx.params );
    
    const { target, type } = ctx.params;

    const user:ObjectId = this.extractUser(ctx);

    const award:any = await ctx.call('awards-catalog.get', { id: type } )

    const { id:wid , balance }:any = await ctx.call('wallets.balance', { user })

    if (balance < award.price) return "Not enough balance!"

    const awards: Award = await this._create(ctx, {
      target,
      uid: String(user),
      type
    }).then(async (resp:any)=> {
      await ctx.call('wallets.decrease', { user, id: wid , amount: award.price })
      return resp;
    }).catch((err:any) => {
      this.logger.error('awards.actions.create.error: ', err)
    });
    return awards;
  },
};
