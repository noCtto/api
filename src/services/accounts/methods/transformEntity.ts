import { AccountThis } from '../accounts.service';

export default async function transformEntity(
  this: AccountThis,
  user: any,
  withToken: boolean,
  token: string,
  extra: any,
  ctx: any,
) {
  if (user) {
    delete user.password;
    delete user.createdAt;
    delete user.active;
    if (withToken) user.token = token || (await this.validateSession(user, extra, ctx));
  }

  return user;
};
