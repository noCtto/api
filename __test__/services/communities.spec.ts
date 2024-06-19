import { ServiceBroker } from 'moleculer';
import Service from '../../src/services/communities/communities.service';
import { Fake as fake } from '../../src/services/zfaker/entities/community'

const name = 'communities';
const _fake_uid_ = '5f9b2a3b9d3e4b1b3c9d9b1a';
let _fake_result_: any = null;

describe(`${name}' Tests - Suite`, () => {
  let broker = new ServiceBroker({ logger: false });
  const service = broker.createService({
    name: name,
    ...Service,
    logger: console.log,
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
  
  it(`should create ${name}`, async () => {
    _fake_result_ = await service.actions.create({
      ...fake,
      uid: _fake_uid_
    });
    expect(_fake_result_).toBeTruthy();
  });

  it(`should read ${name} by ID`, async () => {
    const res = await service.actions.get({ id: _fake_result_._id });
    expect(res).toBeTruthy();
  });

  it(`should read ${name} by Name`, async () => {
    const res = await service.actions.search({ name: _fake_result_.name });
    expect(res).toBeTruthy();
  });

  it(`should not be able to update ${name}`, async () => {
    try {
      await service.actions.update({
        id: _fake_result_._id,
        name: 'Community - EDITED',
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it(`should update ${name}`, async () => {
    const res = await service.actions.update({
      id: _fake_result_._id,
      name: 'Community - EDITED',
      uid: _fake_uid_,
    });
    expect(res).toBeTruthy();
  });

  it(`should remove ${name}`, async () => {
    const res = await service.actions.remove({ id: _fake_result_._id });
    _fake_result_ = null;
    expect(res).toBeTruthy();
  });


  let _ids_: string[] = [];
  it(`should get random ${name}`, async () => {
    _ids_ = await service.actions.random({ num: 5 });
    console.log("COMMUNITY RANDOM", _ids_, _ids_.length );
    expect(_ids_.length).toBe(5);
  });

  it(`should populate posts for ${name}`, async () => {
    const res = await service.actions.get({ id: _ids_[0], populate: ['posts'] });
    console.log("COMMUNITY POPULATED",res);
    expect(res.posts).toBeTruthy();
  });
  
  it(`should populate subscribers for ${name}`, async () => {
    const res = await service.actions.get({ id: _ids_[0], populate: ['subscribers'] });
    console.log("COMMUNITY POPULATED",res);
    expect(res.subscribers).toBeTruthy();
  });
  
  it(`should populate moderators for ${name}`, async () => {
    const res = await service.actions.get({ id: _ids_[0], populate: ['subscribers'] });
    console.log("COMMUNITY POPULATED",res);
    expect(res.moderators).toBeTruthy();
  });

});
