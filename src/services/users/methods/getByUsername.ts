import MoleculerJs from 'moleculer';
import type { MicroService } from '@lib/microservice';
const { MoleculerClientError } = MoleculerJs.Errors;
import type { Context } from 'moleculer'
import type {User} from '@users/entities'

interface Params {
  username?: string,
  email?: string,
  _id?: string
}

export default function getByUsername(
  this: MicroService,
  ctx: Context<Params>,
) {
  this.logger.debug('users.methods.getByUsername', ctx.params )
  const { username } = ctx.params;
  if (!username) return null

  return this._find(ctx, { query: { username } }).then(
    (users: [User]) => {
      if (!users)
        return this.reject(new MoleculerClientError('User not found!', 400));
      this.logger.debug('users.methods.getByUsername.response', users[0])
      return users[0];
    }
  );
}
