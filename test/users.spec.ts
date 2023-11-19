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

  this.logger.info(`${ServiceName} - service`, service !== null )
  this.logger.info(`Sessions - service`, _sessionsService !== null )
  
  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe(`Test ${ServiceName} - 'health'`, () => {
    it('should be called', async () => {
      expect(service).toBeTruthy();
    });
    it('should return health message', async () => {
      const res = await service.actions.health();
      // this.logger.info(`should return health message resopnse`, res );
      expect(res).toBe('I am alive!');
    });
    it(`should return all ${ServiceName}`, async () => {
      const res = await service.actions.all();
      // this.logger.info('should return all response', res);
      expect(res).toBeTruthy();
    });
  });

  let fake: any = Fake;
  describe(`Test ${ServiceName} - 'CRUD'`, () => {
    it(`should create ${ServiceName}`, async () => {
      fake = await service.actions.create(fake);
      // this.logger.info(`should create response`, fake );
      expect(fake).toBeTruthy();
    });

    it(`should read ${ServiceName}`, async () => {
      this.logger.info('should get fake by ID', fake._id )
      const res = await service.actions.get({id: fake._id})
      // this.logger.info('should read response', res);
      expect(res).toBeTruthy();
    });
    
    it(`should update ${ServiceName}`, async () => {
      const res = await service.actions.update({
        id: fake._id,
        password: '987654321'
      });
      // this.logger.info('should update response', res);
      expect(res).toBeTruthy();
    });

    it(`should delete ${ServiceName}`, async () => {
      const res = await service.actions.remove({ id: fake._id });
      // this.logger.info('should delete response', res);
      expect(res).toBeTruthy();
    });

  });

  describe(`${ServiceName} Actions`, () => {
    
    let registered = { "token": "" };
    let fakeUser = Fake
    it(`${ServiceName} - Test Registering new User`, async () => {
      registered = await service.actions.register( fakeUser );
      // this.logger.info(`Registering ${fakeUser.username}`, registered)
      fakeUser = {
        ...fakeUser,
        ...registered,
      }
      expect(registered).toHaveProperty("_id");
    });
    
    it(`${ServiceName} - Test Login new User`, async () => {
      const res = await service.actions.login( fakeUser );
      // this.logger.info('Login Test Result', res );
      expect(res).toHaveProperty("token");
    });
    it(`${ServiceName} - Test Logout User`, async () => {
      const res = await service.actions.logout( fakeUser );
      // this.logger.info('Logout Service Response', res );
      expect(res).toBeTruthy();
    });
    
    it('ResetPassword', async () => {
      const res = await service.actions.resetPassword(fakeUser);
      // this.logger.info('ResetPassword', res );
      expect(res).toBeTruthy();
    });
  })

  
});
