import { ServiceBroker } from 'moleculer';
import MicroService from '../src/services/votes/votes.service';

describe("Test 'health' actions", () => {
  let broker = new ServiceBroker({ logger: false });

  const schema = MicroService;
  let service = broker.createService({
    name: 'votes',
    ...schema,
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
});
