import { faker } from '@faker-js/faker';

export const Fake = {
  name: faker.commerce.product(),
  description: faker.lorem.sentence(),
}
export default Fake