import { ServiceBroker } from 'moleculer';
import MicroService from '../src/services/boards/boards.service';

describe("Test 'health' actions", () => {
  let broker = new ServiceBroker({ logger: false });

  const schema = MicroService;
  let service = broker.createService({
    name: 'boards',
    ...schema,
  });

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe("Test 'health' action", () => {
    it('should return health message', async () => {
      const res = await service.actions.health();
      expect(res).toBe('I am alive!');
    });
  });

  describe('Test all', () => {
    it('should return all boards', async () => {
      const res = await service.actions.all();
      expect(res).toBeTruthy();
    });
  });

  describe('Test byName', () => {
    it('should return board by name', async () => {
      const res = await service.actions.byName({ board: 'test' });
      console.log('THIS RES',res);
      expect(res).toBe(null);
    });
    
    it('should return board by name', async () => {
      const res = await service.actions.byName({ board: 'harsh-attribute-tense-package' });
      console.log('THIS RES =>>>',res);
      expect(res).toBeTruthy();
    });

  });



});
