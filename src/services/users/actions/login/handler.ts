import {Errors} from 'moleculer';
import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';
import type { Params } from './params';
import { sha256 } from '@utils/func';

const { MoleculerClientError } = Errors;

export default async function handler(
  this: MicroService,
  ctx: Context<Params>
): Promise<any> {
  const { email, password, username } = ctx.params;

  if (!password || (!username && !email))
    return new MoleculerClientError('Invalid credentials', 400);

  const user = await this._find(ctx, {
    query: { $or: [{ email }, { username }] },
    fields: ['_id', 'username', 'email', 'imageUrl', 'password'],
  });

  if (user.length === 0) {
    return new MoleculerClientError(
      'Email or password is invalid!',
      422,
      'account',
      [user]
    );
  }
  const user2 = user[0];
  if (user2.password === sha256(password)) {
    const update = {
      $set: {
        lastLogin: new Date(),
      },
    };
    await this.adapter.updateById(user2._id, update);
    return this.transformDocuments(
      ctx,
      { populate: ['gravatar'], fields: ['_id', 'username', 'imageUrl'] },
      user
    ).then((user: any) => {
      const token = this.generateJWT(ctx, user, 10);
      console.log('Token', token);
      return {
        token,
        user,
      };
    });
  }
  return new MoleculerClientError(
    'Email or password is invalid!',
    422,
    'account',
    [user]
  );
}
