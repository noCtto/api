import MoleculerJs from 'moleculer';
const { MoleculerClientError } = MoleculerJs.Errors;

import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

import dayjs from 'dayjs';
import { sha256 } from '@utils/func';

interface Params {
  username: string;
  email: string;
  password: string;
}

export default {
  params: {
    username: 'string|min:4',
    email: 'email',
    password: 'string|min:8',
  },
  async handler(this: MicroService, ctx: Context<Params>): Promise<any> {
    const { username, email, password } = ctx.params;
    return this._find(ctx, { query: { email } }).then(
      ([registeredEmail]: any) => {
        if (registeredEmail)
          return Promise.reject(
            new MoleculerClientError('Email already registered', 400)
          );

        return this._find(ctx, { query: { username } }).then(
          ([userNameTaken]: any) => {
            if (userNameTaken)
              return Promise.reject(
                new MoleculerClientError('Username already taken.', 400)
              );
            return this._create(ctx, {
              username,
              email,
              password: sha256(password),
              createdAt: dayjs().toDate(),
            }).then((user: any) => {
              if (!user)
                return this.reject(
                  new MoleculerClientError('User Creation Error')
                );
              return Promise.resolve(
                this.transformEntity(ctx, user, true, 'token')
              );
            });
          }
        );
      }
    );
  },
};
