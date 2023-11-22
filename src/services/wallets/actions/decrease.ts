import type { Context } from 'moleculer';
import type { MicroService } from '@/lib/microservice';

export default {
  async handler(
    this: MicroService,
    ctx: Context & { params: any }
  ) {
    console.log('wallets.actions.decrease', ctx.params )
    const { user, id, amount } = ctx.params;
    return this._get( ctx ,{ id }).then((wallet:any) => {

      if (String(wallet.uid)  == String(user)) {
        console.log('decrease', wallet.balance, amount)
        if (wallet.balance > amount) {
          console.log('Wallet balance is smaller than amount')
          wallet.balance -= amount
          return this._update(ctx, { id, balance: wallet.balance })
        }
      }
    })
  },
};
