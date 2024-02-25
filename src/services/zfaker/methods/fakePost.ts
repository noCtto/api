import { faker } from '@faker-js/faker';

export default function fakePost(this: any, uid: string, cid: string) {
  this.logger.info('Faking Post', uid, cid)
  return {
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
    image: `https:/sss/source.unsplash.com/featured/300x200?random=${faker.internet.domainWord()}-${faker.internet.domainWord()}`,
    cid: cid,
    uid: uid
  };
}
