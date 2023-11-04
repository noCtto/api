import { faker } from '@faker-js/faker';

export const Fake = {
  voters: {
    [faker.random.alphaNumeric(12)]: true,
  },
}

export default Fake
