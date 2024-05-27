/* eslint-disable @typescript-eslint/no-unused-vars */
import { ServiceBroker } from 'moleculer';
import Service from '../../src/services/posts/posts.service';
import random  from '../../src/utils/action.random';

const name = 'users';
describe(`${name}' random action`, () => {
  let broker = new ServiceBroker({ logger: false });
  const service = broker.createService({
    name: name,
    ...Service,
    actions: {
      random
    }
  });
  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  it(`should return random ${name}`, async () => {
    const res = await service.actions.random({page: 1, limit: 10});
    expect(res).toBeTruthy();
  });

});
