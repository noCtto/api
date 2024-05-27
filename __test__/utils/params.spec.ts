/* eslint-disable @typescript-eslint/no-unused-vars */
import params from '../../src/utils/params';


describe(`test utils populate`, () => {


  it('should return null', async () => {
    const res = params(null);
    expect(res).toBe(null);
  })

  it('should return ctx', async () => {
    const res = params({});
    expect(res).toEqual({});
  })

  it('should return ctx with populate', async () => {
    const res = params({params: {id: '3', populate:['user']}}, {populate:['votes']});
    expect(res).toEqual( { params: { id: '3', populate: [ 'votes', 'user' ] } });
  })
  
});
