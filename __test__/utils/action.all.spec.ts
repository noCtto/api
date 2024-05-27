/* eslint-disable @typescript-eslint/no-unused-vars */
import { ServiceBroker } from 'moleculer';
import Service from '../../src/services/posts/posts.service';
import all  from '../../src/utils/action.all';
const name = 'users';
describe(`${name}' all action`, () => {
  let broker = new ServiceBroker({ logger: false });
  const service = broker.createService({
    name: name,
    ...Service,
    actions: { all }
  });

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());
  it(`should return all ${name}`, async () => {
    const res = await service.actions.all({page: 1, limit: 10});
    expect(res).toBeTruthy();
  });

});
