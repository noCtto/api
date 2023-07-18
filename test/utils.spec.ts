import { ObjectId } from 'mongodb';
import { funcs, extractUser, health, random } from '../src/utils';

import { ServiceBroker } from 'moleculer';

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
      expect(isObjectId).toBe(true);
    });
  });

  describe("Test 'toDeepObjectId' action", () => {
    it('it should return a valid ObjectId', async () => {
      const toDeepObjectId = funcs.toDeepObjectId('5f86d081884c7d659a2feaa0');
      expect(toDeepObjectId).toEqual(new ObjectId('5f86d081884c7d659a2feaa0'));
    });

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

    it('it should return a valid ObjectId', async () => {
      // else if (Array.isArray(newJson[key])) {
      //   newJson[key] = newJson[key].map((r: any) => toDeepObjectId(r));
      // }

      const toDeepObjectId = funcs.toDeepObjectId([
        {
          _id: '5f86d081884c7d659a2feaa0',
          extra: {
            _id: '5f86d081884c7d659a2feaa0',
            extra: {
              _id: '5f86d081884c7d659a2feaa0',
              arr: [
                [
                  {
                    _id: '5f86d081884c7d659a2feaa0',
                  },
                ],
              ],
            },
          },
        },
      ]);
      expect(toDeepObjectId).toEqual([
        {
          _id: new ObjectId('5f86d081884c7d659a2feaa0'),
          extra: {
            _id: new ObjectId('5f86d081884c7d659a2feaa0'),
            extra: {
              _id: new ObjectId('5f86d081884c7d659a2feaa0'),
              arr: [
                [
                  {
                    _id: new ObjectId('5f86d081884c7d659a2feaa0'),
                  },
                ],
              ],
            },
          },
        },
      ]);
    });

    it('it should return a valid ObjectId', async () => {
      // check strings
      const toDeepObjectId = funcs.toDeepObjectId('5f86d081884c7d659a2feaa0');
      expect(toDeepObjectId).toEqual(new ObjectId('5f86d081884c7d659a2feaa0'));
    });
    it('it should return a "string" as value', async () => {
      // check strings
      const toDeepObjectId = funcs.toDeepObjectId('string');
      expect(toDeepObjectId).toEqual('string');
    });
    it('it should return a null value', async () => {
      // check strings
      const toDeepObjectId = funcs.toDeepObjectId(null);
      expect(toDeepObjectId).toEqual(null);
    });
    it('it should return a null value', async () => {
      // check strings
      const toDeepObjectId = funcs.toDeepObjectId(23);
      expect(toDeepObjectId).toEqual(23);
    });
    it('it should return a null value', async () => {
      // check strings
      // random 24 length string
      const toDeepObjectId = funcs.toDeepObjectId('5f86?0818%4c7d659a2feaa0');
      expect(toDeepObjectId).toEqual('5f86?0818%4c7d659a2feaa0');
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
    it('should return a invalid user', async () => {
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
    it('should return a valid user', async () => {
      const user = extractUser({
        meta: {
          user: {
            user: {
              userId: '5f86d081884c7d659a2feaa0',
            },
          },
        },
      });
      expect(user).toEqual(new ObjectId('5f86d081884c7d659a2feaa0'));
    });
    it('should return a valid user', async () => {
      const user = extractUser({
        meta: {
          oauth: {
            user: {
              id: '5f86d081884c7d659a2feaa0',
            },
          },
        },
      });
      expect(user).toEqual(new ObjectId('5f86d081884c7d659a2feaa0'));
    });
  });

  describe('Test get random element', () => {
    let broker = new ServiceBroker({ logger: false });
    let testService = broker.createService({
      name: 'test',
      actions: {
        random: random,
      },
    });
    const mockFind = jest.fn(() =>
      Promise.resolve([{ _id: 123 }, { _id: 456 }])
    );
    beforeAll(() => broker.start());
    afterAll(() => broker.stop());

    it('should return random find', async () => {
      testService._find = mockFind;
      const res = await testService.actions.random({ num: 1 });
      expect(res).toBeTruthy();
    });
    it('should return random find', async () => {
      testService._find = mockFind;
      const res = await testService.actions.random({});
      expect(res).toBeTruthy();
    });

  });
});
