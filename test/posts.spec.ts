import { ServiceBroker } from 'moleculer';
import Service from '../src/services/posts/posts.service';
import UsersService from '../src/services/users/users.service';
import CommunitiesService from '../src/services/communities/communities.service';
import VotesService from '../src/services/votes/votes.service';
import ThreadsService from '../src/services/threads/threads.service';
import CommentsService from '../src/services/comments/comments.service';
import { Fake as fake } from '../src/services/zfaker/entities/post'

const ServiceName = 'posts';

describe(`${ServiceName}' Tests - Suite`, () => {
  let broker = new ServiceBroker({ logger: false });
  let service = broker.createService({
    name: 'posts',
    ...Service,
  });
  let _usersService = broker.createService({
    name: 'users',
    ...UsersService,
  });
  let _comunitiesService = broker.createService({
    name: 'communities',
    ...CommunitiesService,
  });
  let _votesService = broker.createService({
    name: 'votes',
    ...VotesService,
  });
  
  let _threadsService = broker.createService({
    name: 'threads',
    ...ThreadsService,
  });
  
  let _commentsService = broker.createService({
    name: 'comments',
    ...CommentsService,
  });

  console.log('_usersService', _usersService != null)
  console.log('_comunitiesService', _comunitiesService != null)
  console.log('_votesService', _votesService != null)
  console.log('_threadsService', _threadsService != null)
  console.log('_commentsService', _commentsService != null)

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe(`Test ${ServiceName} - 'health'`, () => {
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
  

  let fakePost: any = {
    ...fake, 
    uid: '5f9b2a3b9d3e4b1b3c9d9b1a',
    cid: '6541a80e657e1fe93ef9a15c',
    type: 'cid',
  };
  describe(`Test ${ServiceName} - 'CRUD'`, () => {
    it(`should create ${ServiceName}`, async () => {
      fakePost = await service.actions.create(fakePost);
      // console.log(`should create response`, fakePost );
      expect(fakePost).toBeTruthy();
    });

    it(`should read ${ServiceName}`, async () => {
      const res = await service.actions.get({id: fakePost._id})
      // console.log('should return all response', res);
      expect(res).toBeTruthy();
    });
    
    it(`should update ${ServiceName}`, async () => {
      const res = await service.actions.update({
        ...fakePost,
        id: fakePost._id,
        description: `${fakePost.description} - EDITED`
      });
      // console.log('should return all response', res);
      expect(res).toBeTruthy();
    });

    // it(`should delete ${ServiceName}`, async () => {
    //   const res = await service.actions.remove({id: fakePost._id});
    //   // console.log('should return all response', res);
    //   expect(res).toBeTruthy();
    // });

  });

});
