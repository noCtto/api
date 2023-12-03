import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';
import type { Wallet } from '../entities'
import { ObjectId } from 'mongodb';

type Params = {
  // type?: string,
  // target: string,
}

const params = {
  // target: {
  //   type: 'string',
  //   required: true,
  // },
}

export default {
  params,
  async handler(
    this: MicroService,
    ctx: Context<Params>
  ): Promise<any> {
    this.logger.debug('wallets.actions.create', ctx.params );
    const user:ObjectId = this.extractUser(ctx);
    
    const awards: Wallet = await this._create(ctx, { uid: String(user) }).catch((err:any) => {
      this.logger.error('awards.actions.create.error: ', err)
    });
    return awards;
  },
};
