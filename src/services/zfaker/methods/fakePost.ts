import { faker } from '@faker-js/faker';

export default function fakePost(this: any, author: string, cid: string) {
  
  return {
    author: author,
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
    image: `https://source.unsplash.com/featured/300x200?random=${faker.internet.domainWord()}-${faker.internet.domainWord()}`,
    cid: cid,
  };
}
