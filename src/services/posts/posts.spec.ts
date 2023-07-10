import { ServiceBroker } from 'moleculer';
import Service from '@posts/posts.service';

describe("Post' Tests", () => {
  let broker = new ServiceBroker({ logger: false });
  let service = broker.createService({
    name: 'posts',
    ...Service,
  });

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe("Test 'health' action", () => {
    it('should return health message', async () => {
      const res = await service.actions.health();
      expect(res).toBe('I am alive!');
    });
  });

  describe("Test 'list' action", () => {
    it('should return all posts', async () => {
      const res = await service.actions.list();
      console.log('Test List Result =>>>>', res);
      // expexts to be a object with keys
      expect(res).toHaveProperty('rows');
    });
  });

  describe("Test 'get' action", () => {
    it('should return a post', async () => {
      const res = await broker
        .call('posts.get', { id: '64802233dcc96447fdb5a81a' })
        .catch((err) => {
          console.log('ERROR =>>>', err);
        });
      console.log('Test Result =>>>>', res);

      // expexts to be a object with keys
      expect(res).toHaveProperty('_id');
    });
  });
});
