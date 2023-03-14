import MoleculerJs from 'moleculer';
import type { Context } from 'moleculer';
import { sha256 } from '../../../utils/func';
import type { AccountThis } from '../accounts.service';

const { MoleculerClientError } = MoleculerJs.Errors;

interface Params {
  username: string;
  password: string;
  environment: string;
  fingerprint?: string;
  csrfToken?: string;
  email?: string;
}

export default {
  rest: 'POST /login',
  cache: false,
  authorization: false,
  params: {
    username: { type: 'string' },
    password: { type: 'string', min: 4 },
    environment: { type: 'string', optional: true },
    email: { type: 'string', optional: true },
    fingerprint: {
      type: 'string',
      default: 'localhost',
      optional: true,
    },
    csrfToken: {
      type: 'string',
      optional: true,
    },
  },
  async handler(this: AccountThis, ctx: Context<Params>): Promise<any> {
    
    const { email, password, username } = ctx.params;
    
    if (!password || (!username && !email))
      return new MoleculerClientError('Invalid credentials', 400);
    
    const user = await this._find(ctx, {
      query: { $or: [{ email }, { username }] },
      fields: ['_id', 'username', 'email', 'imageUrl', 'password'],
    });

    if (user.length === 0) {
      return new MoleculerClientError('Email or password is invalid!', 422, 'account', [user])
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
      ).then((user:any) => {
        const token = this.generateToken(user);
        return {
          token,
          user,
        };
      });
    }
    return new MoleculerClientError('Email or password is invalid!', 422, 'account', [user])
  }, 
};
