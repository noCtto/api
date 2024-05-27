import { ServiceBroker } from 'moleculer';
import Service from '../../src/services/posts/posts.service';
import { Fake as fake } from '../../src/services/zfaker/entities/post'

const name = 'posts';
const _fake_uid_ = '5f9b2a3b9d3e4b1b3c9d9b1a';
const _fake_cid_ = '655c07b0c398d1c54e81dde0';
let _fake_result_: any = null;

describe(`${name}' Tests - Suite`, () => {
  let broker = new ServiceBroker({ logger: false });
  const service = broker.createService({ name, ...Service });

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
  it(`should return trending ${name}`, async () => {
    const res = await service.actions.trending({page: 1, limit: 10});
    expect(res).toBeTruthy();
  });
  it(`should create ${name}`, async () => {
    const create = await service.actions.create({...fake, uid: _fake_uid_, cid: _fake_cid_ });
    _fake_result_ = create;
    expect(create).toBeTruthy();
  });

  it(`should read ${name}`, async () => {
    const res = await service.actions.get({ id: _fake_result_._id });
    expect(res).toBeTruthy();
  });
  
  it(`should not be able to update ${name}`, async () => {
    try {
      await service.actions.update({
        ..._fake_result_,
        id: _fake_result_._id,
        description: `${_fake_result_.description} - EDITED`,
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it(`should update ${name}`, async () => {
    const res = await service.actions.update({
      ..._fake_result_,
      id: _fake_result_._id,
      description: `${_fake_result_.description} - EDITED`,
      uid: _fake_result_.uid,
    });
    expect(res).toBeTruthy();
  });

  it('should populate comments', async () => {
    const res = await service.actions.get({ id: _fake_result_._id, populate: ['comments'], page:1, pageSize: 10 });      
    expect(res.comments.rows).toBeTruthy();
  });
  
  it('should populate votes', async () => {
    const res = await service.actions.get({ id: _fake_result_._id, populate: ['votes'], page:1, pageSize: 10 });      
    expect(res.votes).toBeTruthy();
  });
  
  it('should populate author', async () => {
    const res = await service.actions.get({ id: _fake_result_._id, populate: ['author'] });      
    expect(res.author).toBeTruthy();
  });
  

  it('sould not be able to delete', async () => {
    try {
      await service.actions.remove({id: _fake_result_._id});
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it(`should delete ${name}`, async () => {
    const res = await service.actions.remove({ id: _fake_result_._id, uid: _fake_result_.uid});
    expect(res).toBeTruthy();
  });

});
