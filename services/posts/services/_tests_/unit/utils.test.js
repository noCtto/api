const { ObjectId } = require('mongodb');
const dayjs = require('dayjs');

const {
  isObjectId,
  toDeepObjectId,
  toDeepDate,
  sha256,
  getUniqId,
  addressToStr,
  date,
  parseOperator,
  getValue,
  convertToCSV,
  convertJsonToCSV,
} = require('../../../../../utils/func');

const OBJECT_ID = '6070d17b1f9a6a0c154a1b0b';

const HASH_REGEX = /^[a-f0-9]{64}$/gi;

expect.extend({
  toContainObject(received, argument) {
    const pass = this.equals(received, expect.arrayContaining([expect.objectContaining(argument)]));
    if (pass) {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            received
          )} not to contain object ${this.utils.printExpected(argument)}`,
        pass: true,
      };
    }
    return {
      message: () =>
        `expected ${this.utils.printReceived(
          received
        )} to contain object ${this.utils.printExpected(argument)}`,
      pass: false,
    };
  },
});

describe("Test 'Utils", () => {
  it('isObjectId', () => {
    const is = isObjectId(OBJECT_ID);
    expect(is).toBe(true);
  });

  it('toDeepObjectId', () => {
    const val1 = toDeepObjectId([{ id: OBJECT_ID }]);
    const val2 = toDeepObjectId([{ data: [{ id: OBJECT_ID }] }]);
    expect(val1).toContainObject({ id: ObjectId(OBJECT_ID) });
    expect(val2).toContainObject({ data: [{ id: ObjectId(OBJECT_ID) }] });
  });

  it('toDeepDate', () => {
    const data = '1999-02-01';
    const val1 = toDeepDate([{ date: data }]);
    const val2 = toDeepDate([{ key: { date: data } }]);
    const val3 = toDeepDate([{ key: { data: [{ date: data }] } }]);
    const val4 = toDeepDate([{ key: [{ data: [{ date: data }] }] }]);

    expect(val1).toContainObject({ date: dayjs(data).toDate() });
    expect(val2).toContainObject({ key: { date: dayjs(data).toDate() } });
    expect(val3).toContainObject({ key: { data: [{ date: dayjs(data).toDate() }] } });
  });

  it('sha256', () => {
    const sha = sha256('test');
    expect(sha).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
  });

  it('getUniqId', () => {
    const hash = getUniqId();
    const result = HASH_REGEX.test(hash);
    expect(result).toBe(true); // true
  });

  it('date', () => {
    const result = date();
    expect(result).toBeTruthy();
  });

  it('parseOperator', () => {
    const data = date().toString();
    const result1 = parseOperator('is', data);
    const result2 = parseOperator('equals', data);
    const result3 = parseOperator('contains', data);
    const result4 = parseOperator('startsWith', data);
    const result5 = parseOperator('endsWith', data);
    const result6 = parseOperator('not', data);
    const result7 = parseOperator('after', data);
    const result8 = parseOperator('onOrAfter', data);
    const result9 = parseOperator('before', data);
    const result10 = parseOperator('onOrBefore', data);
    expect(result1).toBeTruthy();
    expect(result2).toBeTruthy();
    expect(result2).toBeTruthy();
    expect(result3).toBeTruthy();
    expect(result4).toBeTruthy();
    expect(result5).toBeTruthy();
    expect(result6).toBeTruthy();
    expect(result7).toBeTruthy();
    expect(result8).toBeTruthy();
    expect(result9).toBeTruthy();
    expect(result10).toBeTruthy();
  });

  it('getValue', () => {
    const data = {
      data: [
        {
          key: 2,
        },
        {
          key: 1,
        },
      ],
    };
    const result = getValue(data, 'data.key');
    expect(result).toBeTruthy();
  });

  it('convertToCSV', () => {
    const data = [{ row: 1 }, { row: 2 }, { row: 3 }];
    const result = convertToCSV(data);
    expect(result).toBeTruthy();
  });
});
