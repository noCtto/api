import { ServiceBroker } from 'moleculer';
import CommunityService from '../src/services/communities/communities.service';
import PostsService from '../src/services/posts/posts.service';
import UsersService from '../src/services/users/users.service';

import { Fake as fake } from '../src/services/zfaker/entities/community'

const ServiceName = 'communities'

describe(`Test ${ServiceName} Suite`, () => {

  let broker = new ServiceBroker({ logger: false });
  const service = broker.createService({
    name: 'communities',
    ...CommunityService,
  });
  
  let _postsService = broker.createService({
    name: 'posts',
    ...PostsService,
  });
  let _usersService = broker.createService({
    name: 'accounts',
    ...UsersService,
  });
  
  console.log('Accounts Service', _usersService != null);
  console.log('Posts Service', _postsService != null );

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe(`Test ${ServiceName} - 'health' action`, () => {
    it('should be called', async () => {
      expect(service).toBeTruthy();
    });

    it('should return health message', async () => {
      const res = await service.actions.health();
      // console.log(`should return health message resopnse`, res );
      expect(res).toBe('I am alive!');
    });
    it(`should return all ${ServiceName}`, async () => {
      const res = await service.actions.all();
      // console.log('should return all response', res);
      expect(res).toBeTruthy();
    });
  });

  describe(`Test ${ServiceName} - 'CRUD'`, () => {
    let fakeEntity: any = { ...fake, uid: '5f9b2a3b9d3e4b1b3c9d9b1a' }
    it(`should create ${ServiceName}`, async () => {
      fakeEntity = await service.actions.create(fakeEntity);
      // console.log(`should create response`, fakeEntity );
      expect(fakeEntity).toBeTruthy();
    });

    it(`should read ${ServiceName}`, async () => {
      const res = await service.actions.get({ id: fakeEntity._id })
      // console.log('should return all response', res);
      expect(res).toBeTruthy();
    });
    
    it(`should update ${ServiceName}`, async () => {
      const res = await service.actions.update({
        id: fakeEntity._id,
        ...fakeEntity,
        description: `${fakeEntity.description} - EDITED`
      });
      // console.log('should update response', res);
      expect(res).toBeTruthy();
    });

    it(`should delete ${ServiceName}`, async () => {
      const res = await service.actions.remove({
        id: fakeEntity._id
      });
      // console.log('should delete response', res);
      expect(res).toBeTruthy();
    });

  });

  /**
   * Private
   */
  describe(`Test ${ServiceName} - actions`, () => {
    let fakeEntity: any = { ...fake, uid: '5f9b2a3b9d3e4b1b3c9d9b1a' }
    
    it(`should create ${ServiceName}`, async () => {
      fakeEntity = await service.actions.create(fakeEntity);
      console.log(`should create response`, fakeEntity );
      expect(fakeEntity).toBeTruthy();
    });
  
    it('sould return community by ID', async () => {
      const res = await service.actions.get({ id: fakeEntity._id });
      // console.log('Get community by ID: ', res);
      expect(res).toBeTruthy();
    });

    it('should return community by Name', async () => {
      const res = await service.actions.byName({ name: fakeEntity.name});
      // console.log('Get community by Name: ', res);
      expect(res).toBeTruthy();
    });
    
    it('should return null', async () => {
      const res = await service.actions.byName({ name: 'Community - 404 '});
      // console.log('Get community by Name must be null: ', res);
      expect(res).toBe(null);
    });

    it('should return random community', async () => {
      const res = await service.actions.random({ num: 1 });
      expect(res).toBeTruthy();
    });

  });
});
