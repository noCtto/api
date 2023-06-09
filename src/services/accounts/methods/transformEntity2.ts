import type { AccountThis } from '../accounts.service';

export default function transformEntity2(this:AccountThis, _ctx:any,  user:any, token:any) {
  if (user) {
    delete user.password;
    delete user.createdAt;
    delete user.active;
    user.token = token;
  }
  return user;
};
