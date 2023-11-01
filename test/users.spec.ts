import { ServiceBroker } from 'moleculer';
import AccountsService from '../src/services/users/users.service';
import SessionsService from '../src/services/sessions/sessions.service';

import { Fake } from '../src/services/zfaker/entities/user' 

const ServiceName = 'users'

describe(`${ServiceName} Tests actions`, () => {
  
  let broker = new ServiceBroker({ logger: false });
  
  const service = broker.createService({
    name: ServiceName,
    ...AccountsService,
  });
  
  let _sessionsService = broker.createService({
    name: 'sessions',
    ...SessionsService
  });

  console.log(`${ServiceName} - service`, service !== null )
  console.log(`Sessions - service`, _sessionsService !== null )
  
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

  let fake: any = Fake;
  describe(`Test ${ServiceName} - 'CRUD'`, () => {
    it(`should create ${ServiceName}`, async () => {
      fake = await service.actions.create(fake);
      // console.log(`should create response`, fake );
      expect(fake).toBeTruthy();
    });

    it(`should read ${ServiceName}`, async () => {
      console.log('should get fake by ID', fake._id )
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

  describe(`${ServiceName} Actions`, () => {
    
    let registered = { "token": "" };
    let fakeUser = Fake
    it(`${ServiceName} - Test Registering new User`, async () => {
      registered = await service.actions.register( fakeUser );
      // console.log(`Registering ${fakeUser.username}`, registered)
      fakeUser = {
        ...fakeUser,
        ...registered,
      }
      expect(registered).toHaveProperty("_id");
    });
    
    it(`${ServiceName} - Test Login new User`, async () => {
      const res = await service.actions.login( fakeUser );
      // console.log('Login Test Result', res );
      expect(res).toHaveProperty("token");
    });
    it(`${ServiceName} - Test Logout User`, async () => {
      const res = await service.actions.logout( fakeUser );
      // console.log('Logout Service Response', res );
      expect(res).toBeTruthy();
    });
    
    it('ResetPassword', async () => {
      const res = await service.actions.resetPassword(fakeUser);
      // console.log('ResetPassword', res );
      expect(res).toBeTruthy();
    });
  })

  
});
