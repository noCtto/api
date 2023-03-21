import MoleculerJs from 'moleculer';
import { AccountThis } from '../accounts.service';
const { MoleculerClientError } = MoleculerJs.Errors;

export default function getByUsername(this:AccountThis, username:any, ctx: any) {
  return this._find(ctx, { username: { $regex: username } }).then((users:any) => {
    if (users.length === 0) return this.reject(new MoleculerClientError('User not found!', 400));
    return users[0];
  });
};
