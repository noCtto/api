import { ServiceBroker } from 'moleculer';
import MicroService from '../src/services/votes/votes.service';

const ServiceName = 'votes'; 

describe("Test 'health' actions", () => {
  let broker = new ServiceBroker({ logger: false });

  const schema = MicroService;
  let service = broker.createService({
    name: 'votes',
    ...schema,
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
    target: '6541a80e657e1fe93ef9a15c',
    type: 'cid',
  };
  console.log('Fake', fake);
  describe(`Test ${ServiceName} - 'CRUD'`, () => {
    it(`should create ${ServiceName}`, async () => {
      fake = await service.actions.create(fake);
      // console.log(`should create response`, fake );
      expect(fake).toBeTruthy();
    });

    it(`should read ${ServiceName}`, async () => {
      console.log('should get fake by ID', fake._id )
      const res = await service.actions.get({id: fake._id})
      console.log('should read response', res);
      expect(res).toBeTruthy();
    });
    
    it(`should update ${ServiceName}`, async () => {
      const res = await service.actions.update({
        ...fake,
        id: fake._id,
        type:`pid`,
        voters: {
          [String('5f9b2a3b9d3e4b1b3c9d9b1a')]:  true
        }
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
