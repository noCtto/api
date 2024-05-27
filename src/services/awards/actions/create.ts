import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';
import { ObjectId } from 'mongodb';

type Params = {
  type?: string,
  target: string,
}

const params = {
  target: {
    type: 'string',
    required: true,
    convert: true,
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

    const uid:ObjectId = this.extractUser(ctx);

    if (!this.afford(ctx, { uid: uid, award: type })) {
      return "Not enough balance!";
    }

    return this.buy(ctx, { uid, award: type }).then((_recipt:any) => {
      return this._cretate(ctx, {
        target,
        uid,
        type
      }).then(async (resp:any) => {
        return resp;
      }).catch((err:any) => {
        this.logger.error('awards.actions.create.error: ', err)
      })
    });
  },
};
