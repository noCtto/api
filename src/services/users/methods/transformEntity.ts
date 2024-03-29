import type { MicroService } from '../../../lib/microservice';

export default async function transformEntity(
  this: MicroService,
  ctx: any,
  user: any,
  withToken: boolean,
  token: string,
  extra: any
) {
  if (user) {
    delete user.password;
    delete user.createdAt;
    delete user.active;
    if (withToken)
      user.token = token || (await this.validateSession(user, extra, ctx));
  }

  return user;
}
