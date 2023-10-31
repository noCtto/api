import { faker } from '@faker-js/faker';

export function fakeUser() {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: '12345678',
  }
}
