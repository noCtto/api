import { faker } from '@faker-js/faker';

export const Fake = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: '12345678',
}
