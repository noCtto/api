import { ObjectId } from 'mongodb';
import { funcs, extractUser, health } from '../src/utils';

describe("Test 'utils' functions", () => {
  describe("Test 'health' action", () => {
    it('it should return a string', async () => {
      expect(health()).toBe('I am alive!');
    });
  });

  describe("Test 'sha256Test' action", () => {
    it('it should return a valid hash', async () => {
      const sha256Test = funcs.sha256('test');
      expect(sha256Test).toBe(
        '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
      );
    });
  });

  describe("Test 'isObjectId' action", () => {
    it('it should return a valid ObjectId', async () => {
      const isObjectId = funcs.isObjectId('5f86d081884c7d659a2feaa0');
      console.log('isObjectID =!!!!! =>>>>', isObjectId);
      expect(isObjectId).toBe(true);
    });
  });

  describe("Test 'toDeepObjectId' action", () => {
    it('it should return a valid ObjectId', async () => {
      const toDeepObjectId = funcs.toDeepObjectId({
        _id: '5f86d081884c7d659a2feaa0',
        extra: {
          _id: '5f86d081884c7d659a2feaa0',
          extra: {
            _id: '5f86d081884c7d659a2feaa0',
            arr: [
              {
                _id: '5f86d081884c7d659a2feaa0',
              },
            ],
          },
        },
      });
      expect(toDeepObjectId).toEqual({
        _id: new ObjectId('5f86d081884c7d659a2feaa0'),
        extra: {
          _id: new ObjectId('5f86d081884c7d659a2feaa0'),
          extra: {
            _id: new ObjectId('5f86d081884c7d659a2feaa0'),
            arr: [
              {
                _id: new ObjectId('5f86d081884c7d659a2feaa0'),
              },
            ],
          },
        },
      });
    });
  });

  describe("Test 'randomId' action", () => {
    it('it should return a valid randomId', async () => {
      const randomId = funcs.randomId(5, [1, 2, 3, 4, 5]);
      // expect to be one of the array
      expect([1, 2, 3, 4, 5]).toContain(randomId);
    });
  });

  describe("Test 'checkIfValidMD5Hash' action", () => {
    it('it should return a valid MD5 hash', async () => {
      const checkIfValidMD5Hash = funcs.checkIfValidMD5Hash(
        '5f86d081884c7d659a2feaa0'
      );
      expect(checkIfValidMD5Hash).toBe(false);
    });
  });

  describe('Test extractUser', () => {
    it('should return a valid user', async () => {
      const user = extractUser({
        _id: '5f86d081884c7d659a2feaa0',
        name: 'test',
        email: '',
        phone: '',
      });
      expect(user).toEqual(null);
    });

    it('should return a valid user', async () => {
      const user = extractUser({
        params: {
          uid: '5f86d081884c7d659a2feaa0',
          name: 'test',
        },
      });
      expect(user).toEqual(new ObjectId('5f86d081884c7d659a2feaa0'));
    });
  });
});
