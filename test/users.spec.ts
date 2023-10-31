import { ServiceBroker } from 'moleculer';
import AccountsService from '../src/services/users/users.service';
import SessionsService from '../src/services/sessions/sessions.service';

import { fakeUser } from '../src/services/zfaker/entities/user' 

const ServiceName = 'users'

describe(`${ServiceName}Tests actions`, () => {
  
  let broker = new ServiceBroker({ logger: false });
  
  const service = broker.createService({
    name: ServiceName,
    ...AccountsService,
  });

  let _sessionsService = broker.createService({
    name: 'sessions',
    ...SessionsService
  });



  console.log(`${ServiceName} - service`, _sessionsService !== null )
  
  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe(`${ServiceName} Test 'health' action`, () => {
    it('should return health message', async () => {
      const res = await service.actions.health();
      expect(res).toBe('I am alive!');
    });
  });


  /**
   * Public
   */
  describe('Account Actions', () => {
    
    const user = fakeUser()
    let registered = { "token": "" };

    it('Registering new User', async () => {
      registered = await service.actions.register( user );
      expect(registered).toHaveProperty("_id");
    });
    
    it('Login new User', async () => {
      const res = await service.actions.login( user );
      console.log('This Login Result', res );
      expect(res).toHaveProperty("token");
    });
    it('Logout User', async () => {
      const res = await service.actions.logout({ username: user.username });
      console.log('Logout', res );
      expect(res).toBeTruthy();
    });
    
    // it('ResetPassword', async () => {
    //   const res = await service.actions.resetPassword({ email: user.email });
    //   console.log('ResetPassword', res );
    //   expect(res).toBeTruthy();
    // });
  })
  
  /**
   * Private
  */


  
});
