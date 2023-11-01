import { faker } from '@faker-js/faker';
import type { Community } from '@communities/entities'

export const Fake: Community = {
  name: faker.commerce.product(),
  description: faker.lorem.sentence(),
}