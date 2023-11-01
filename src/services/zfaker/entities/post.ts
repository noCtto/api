import { faker } from '@faker-js/faker';

export const Fake = {
  title: faker.lorem.sentence(),
  body: faker.lorem.paragraph(),
  image: `https://source.unsplash.com/featured/300x200?random=${faker.internet.domainWord()}-${faker.internet.domainWord()}`,
}