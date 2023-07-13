import { ServiceBroker } from 'moleculer';
import BoardsService from '../src/services/boards/boards.service';

describe("Test 'Boards' actions", () => {
  let broker = new ServiceBroker({ logger: false });

  const boardsService = broker.createService({
    name: 'boards',
    ...BoardsService,
  });

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe("Test 'health' action", () => {
    it('should return health message', async () => {
      const res = await boardsService.actions.health();
      expect(res).toBe('I am alive!');
    });
  });

  describe('Test get all boards', () => {
    it('should return all boards', async () => {
      const res = await boardsService.actions.all();
      expect(res).toBeTruthy();
    });
  });

  describe('Test byName', () => {
    it('should return board by name', async () => {
      const res = await boardsService.actions.byName({ name: 'test' });
      expect(res).toBe(null);
    });
    
    it('should return board by name', async () => {
      const res = await boardsService.actions.byName({ name: 'harsh-attribute-tense-package' });
      expect(res).toBeTruthy();
    });

  });

  describe('Test get random board', () => {
    it('should return random board', async () => {
      const res = await boardsService.actions.random({ num: 1});
      expect(res).toBeTruthy();
    });
  });

  describe('extract user from board', () => {
    it('should return user from board', async () => {
      const res = await boardsService.extractUser({ meta: { user: {  user: {userId: '5f9b2a3b9d3e4b1b3c9d9b1a' } } } });
      expect(res).toBeTruthy();
    });
    it('should return user from board', async () => {
      const res = await boardsService.extractUser({ params: { uid: '5f9b2a3b9d3e4b1b3c9d9b1a' } });
      expect(res).toBeTruthy();
    });
    it('should return user from board', async () => {
      const res = await boardsService.extractUser({ meta: { oauth: { user: { id: '5f9b2a3b9d3e4b1b3c9d9b1a' } } }});
      expect(res).toBeTruthy();
    });
  });

});
