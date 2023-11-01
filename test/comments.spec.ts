import { ServiceBroker } from 'moleculer';
import CommentsService from '../src/services/comments/comments.service';
import VotesService from '../src/services/votes/votes.service';
import { Fake } from '../src/services/zfaker/entities/comment';

const ServiceName = 'comments'

describe(`Test ${ServiceName} suite`, () => {
  let broker = new ServiceBroker({ logger: false });

  let service = broker.createService({
    name: 'comments',
    ...CommentsService,
  });
  let _votesService = broker.createService({
    name: 'votes',
    ...VotesService,
  });

  console.log('_votesService', _votesService != null)

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

  let fake: any = {
    ...Fake,
    tid: '65418f56fccf98b319b05cc9',
    uid: '65418f56fccf98b319b05cc9',
  };

  describe(`Test ${ServiceName} - 'CRUD'`, () => {
    it(`should create ${ServiceName}`, async () => {
      fake = await service.actions.create(fake);
      // console.log(`should create response`, fake );
      expect(fake).toBeTruthy();
    });

    it(`should read ${ServiceName}`, async () => {
      // console.log('should get fake by ID', fake._id )
      const res = await service.actions.get({id: fake._id})
      // console.log('should read response', res);
      expect(res).toBeTruthy();
    });
    
    it(`should update ${ServiceName}`, async () => {
      const res = await service.actions.update({
        id: fake._id,
        cid: '65418f56fccf98b319b05cc9'
      });
      // console.log('should update response', res);
      expect(res).toBeTruthy();
    });

    it(`should delete ${ServiceName}`, async () => {
      const res = await service.actions.remove({ id: fake._id });
      // console.log('should delete response', res);
      expect(res).toBeTruthy();
    });

  });

});
