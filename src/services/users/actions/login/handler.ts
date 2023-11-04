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
    return Promise.reject(new MoleculerClientError('Email/Username or password is invalid!', 422));

  const users = await this._find(ctx, {
    query: { $or: [{ email }, { username }] },
    fields: ['_id', 'username', 'email', 'imageUrl', 'password'],
  });

  if (!users || users.length === 0) {
    return Promise.reject(new MoleculerClientError('Email/Username or password is invalid!', 422))
  }

  if (users[0].password != sha256(password)) {
    return Promise.reject(new MoleculerClientError('Email/Username or password is invalid!', 422))
  }
  
  await this.adapter.updateById(users[0]._id, {
    $set: {
      lastLogin: new Date(),
    },
  });
  
  const token = this.generateJWT(ctx, users[0], 1000);

  return this.transformDocuments(
    ctx,
    { populate: ['gravatar'], fields: ['_id', 'username', 'imageUrl'] },
    users[0]
  ).then((user: any) => {
    return {
      token,
      user,
    };
  });
}
