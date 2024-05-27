import { ServiceBroker } from 'moleculer';
import Service from '../../src/services/posts/posts.service';

const name = 'communities';

describe(`${name}' Tests - Suite`, () => {
  let broker = new ServiceBroker({ logger: false });
  const service = broker.createService({
    name: name,
    ...Service,
  });

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  it('should truthy', async () => {
    expect(service).toBeTruthy();
  });
  it('should return health message', async () => {
    const res = await service.actions.health();
    expect(res).toBe('I am alive!');
  });
  it(`should return all ${name}`, async () => {
    const res = await service.actions.all({page: 1, limit: 10});
    expect(res).toBeTruthy();
  });
  

});
