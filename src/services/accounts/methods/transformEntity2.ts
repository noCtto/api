import type { MicroService } from '@lib/microservice';

export default function transformEntity2(
  this: MicroService,
  _ctx: any,
  user: any,
  token: any
) {
  if (user) {
    delete user.password;
    delete user.createdAt;
    delete user.active;
    user.token = token;
  }
  return user;
}
