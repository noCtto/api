import MoleculerJs from 'moleculer';
import type { MicroService } from '@lib/microservice';
const { MoleculerClientError } = MoleculerJs.Errors;

export default function getByUsername(this:MicroService, ctx: any, username:any) {
  return this._find(ctx, { username: { $regex: username } }).then((users:any) => {
    if (users.length === 0) return this.reject(new MoleculerClientError('User not found!', 400));
    return users[0];
  });
};
