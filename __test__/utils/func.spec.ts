import {
  sha256,
  isObjectId,
  toDeepObjectId,
  randomId,
  checkIfValidMD5Hash,
} from '../../src/utils/func'

describe('func', () => {

  it('should return sha256', () => {
    const res = sha256('123');
    expect(res).toBeTruthy();
  })

  it('should return isObjectId', () => {
    const res = isObjectId('123');
    expect(res).toBeFalsy();
  });

  it('should return toDeepObjectId', () => {
    const res = toDeepObjectId('123');
    expect(res).toBeTruthy();
  });

  it('should return randomId', () => {
    const res = randomId(1, {1: '1'});
    expect(res).toBeTruthy();
  });

  it('should return checkIfValidMD5Hash', () => {
    const res = checkIfValidMD5Hash('123');
    expect(res).toBeFalsy();
  });



})

