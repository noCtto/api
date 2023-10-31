import MoleculerJs from 'moleculer';
import type { MicroService } from '@lib/microservice';
const { MoleculerClientError } = MoleculerJs.Errors;
import type { Context } from 'moleculer'

export default function getByUsername(
  this: MicroService,
  ctx: Context,
  username: any
) {
  console.log('Getting by Username', ctx.params, username)
  return this._find(ctx, { username }).then(
    (users: any) => {
      if (users.length === 0)
        return this.reject(new MoleculerClientError('User not found!', 400));
      return users[0];
    }
  );
}
