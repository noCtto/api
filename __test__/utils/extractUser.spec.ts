/* eslint-disable @typescript-eslint/no-unused-vars */
import { ServiceBroker } from 'moleculer';
import Service from '../../src/services/posts/posts.service';
import extractUser  from '../../src/utils/extractUser';

const name = 'users';
describe(`${name}' all action`, () => {
  let broker = new ServiceBroker({ logger: false });
  const service = broker.createService({
    name: name,
    ...Service,
    actions: {},
    methods: { extractUser }
  });

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());
  it(`extractUser`, async () => {
    const res = await service.extractUser({meta: {user: {user: {userId: '123'}}}});
    console.log('res', res);
    expect(res).toBeTruthy();

  });

});
