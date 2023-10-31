import { faker } from '@faker-js/faker';

export function fakeCommunity() {
  return {
    name: faker.name.jobArea(),
    description: faker.internet.domainWord(),
    uid: '5f9b2a3b9d3e4b1b3c9d9b1a',
  }
}