import { ServiceBroker } from 'moleculer';
import communitiesService from '../src/services/communities/communities.service';


describe("Test 'communities' actions", () => {
  let broker = new ServiceBroker({ logger: false });

  const communitiesService = broker.createService({
    name: 'communities',
    ...communitiesService,
  });
  const list = jest.fn(() => Promise.resolve([{ _id: 123 }, { _id: 456 }]));
  let _accountsService = broker.createService({ name: 'accounts', actions: { list } });
  let _postsService = broker.createService({ name: 'posts', actions: { list } });
  console.log(_accountsService.length, _postsService.length);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe('onStart', () => {
    it('should be called', async () => {
      expect(communitiesService).toBeTruthy();
    });
  });

  describe("Test 'health' action", () => {
    it('should return health message', async () => {
      const res = await communitiesService.actions.health();
      expect(res).toBe('I am alive!');
    });
  });

  describe('Test get all communities', () => {
    it('should return all communities', async () => {
      const res = await communitiesService.actions.all();
      expect(res).toBeTruthy();
    });
  });

  describe('Test byName', () => {
    it('should return community by name', async () => {
      const res = await communitiesService.actions.byName({ name: 'test', populate: 'posts,subscribers' });
      expect(res).toBe(null);
    });

    it('should return community by name', async () => {
      const res = await communitiesService.actions.byName({ name: 'all', populate: 'posts,subscribers' });
      expect(res).toBeTruthy();
    });

    it('should return community by name', async () => {
      const res = await communitiesService.actions.byName({
        name: 'harsh-attribute-tense-package',
        populate: 'posts,subscribers',
      });
      console.log('THIS FOUND community', res);

      expect(res).toBeTruthy();
    });
    it('should return community by name', async () => {
      const res = await communitiesService.actions.byName({
        name: '648778c2ca0f6c6dde20b724',
        populate: 'posts,subscribers',
      });
      console.log('THIS FOUND community by NAME using ID', res);

      expect(res).toBeTruthy();
    });
  });

  describe('Test get random community', () => {
    it('should return random community', async () => {
      const res = await communitiesService.actions.random({ num: 1 });
      expect(res).toBeTruthy();
    });
  });

  describe('extract user from community', () => {
    it('should return user from community', async () => {
      const res = await communitiesService.extractUser({
        meta: { user: { user: { userId: '5f9b2a3b9d3e4b1b3c9d9b1a' } } },
      });
      expect(res).toBeTruthy();
    });
    it('should return user from community', async () => {
      const res = await communitiesService.extractUser({
        params: { uid: '5f9b2a3b9d3e4b1b3c9d9b1a' },
      });
      expect(res).toBeTruthy();
    });
    it('should return user from community', async () => {
      const res = await communitiesService.extractUser({
        meta: { oauth: { user: { id: '5f9b2a3b9d3e4b1b3c9d9b1a' } } },
      });
      expect(res).toBeTruthy();
    });
  });

  




});
