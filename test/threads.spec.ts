import { ServiceBroker } from 'moleculer';
import Service from '../src/services/threads/threads.service';

const ServiceName = 'threads'
describe(`${ServiceName} Test Suite`, () => {
  let broker = new ServiceBroker({ logger: false });
  let service = broker.createService({
    name: 'threads',
    ...Service,
  });
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

  let fake: any = {
    pid: '65418f56fccf98b319b05cc9',

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
        password: '987654321'
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


  describe('Test get random thread', () => {
    it('should return random thread', async () => {
      const res = await service.actions.random({ num: 1 });
      expect(res).toBeTruthy();
    });
  });

});
