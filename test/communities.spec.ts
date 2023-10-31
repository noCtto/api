import { ServiceBroker } from 'moleculer';
import MicroService from '../src/services/communities/communities.service';

describe("Test 'communities' actions", () => {
  
  let testCommunity: any = null;
  let broker = new ServiceBroker({ logger: false });
  const communitiesService = broker.createService({
    name: 'communities',
    ...MicroService,
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

  /**
   * Public
   */
  describe('Test get all communities', () => {
    it('should return all communities', async () => {
      const res = await communitiesService.actions.all();
      expect(res).toBeTruthy();
    });
  });
  /**
   * Private
   */
  describe('Test create community', () => {
    it('should return community', async () => {
      testCommunity = await communitiesService.actions.create({
        name: 'test-0x0',
        description: 'test-0x0 - description',
        uid: '5f9b2a3b9d3e4b1b3c9d9b1a',
      });
      console.log('New test community created: ', testCommunity);
      expect(testCommunity).toBeTruthy();
    });
    
    it('sould return community by ID', async () => {
      const res = await communitiesService.actions.get({ id: testCommunity._id });
      console.log('Get community by ID: ', res);
      expect(res).toBeTruthy();
    });

    it('should return community by Name', async () => {
      const res = await communitiesService.actions.byName({ name: testCommunity.name, populates: 'posts,subscribers' });
      console.log('Get community by Name: ', res);
      expect(res).toBeTruthy();
    });
    
    it('should return community by Name using ID', async () => {
      const res = await communitiesService.actions.byName({ name: testCommunity._id, populates: 'posts,subscribers' });
      console.log('Get community by Name: ', res);
      expect(res).toBeTruthy();
    });
    
    it('should return null', async () => {
      const res = await communitiesService.actions.byName({ name: 'Community - 404 ', populates: 'posts,subscribers' });
      console.log('Get community by Name must be null: ', res);
      expect(res).toBe(null);
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
