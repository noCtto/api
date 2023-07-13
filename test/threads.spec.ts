import { ServiceBroker } from 'moleculer';
import Service from '../src/services/threads/threads.service';

describe("Test 'health' actions", () => {
  let broker = new ServiceBroker({ logger: false });
  let service = broker.createService({
    name: 'threads',
    ...Service,
  });
  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe("Test 'health' action", () => {
    it('should return health message', async () => {
      const res = await service.actions.health();
      console.log('Test Res =>>>>', res);
      // Check the result
      expect(res).toBe('I am alive!');
    });
  });

  describe('Test get random thread', () => {
    it('should return random thread', async () => {
      const res = await service.actions.random({ num: 1});
      expect(res).toBeTruthy();
    });
  });

  describe('extract user from thread', () => {
    it('should return user from thread', async () => {
      const res = await service.extractUser({ meta: { user: {  user: {userId: '5f9b2a3b9d3e4b1b3c9d9b1a' } } } });
      expect(res).toBeTruthy();
    });
    it('should return user from thread', async () => {
      const res = await service.extractUser({ params: { uid: '5f9b2a3b9d3e4b1b3c9d9b1a' } });
      expect(res).toBeTruthy();
    });
    it('should return user from thread', async () => {
      const res = await service.extractUser({ meta: { oauth: { user: { id: '5f9b2a3b9d3e4b1b3c9d9b1a' } } }});
      expect(res).toBeTruthy();
    });
  });
});
