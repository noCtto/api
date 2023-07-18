import crypto from 'crypto';
import { ObjectId } from 'mongodb';

import { faker } from '@faker-js/faker';

export const sha256 = (str: string) =>
  crypto.createHash('sha256').update(str, 'binary').digest('hex');

export function isObjectId(str: string): boolean {
  return str.length === 24 && (str.match(/^[0-9a-fA-F]{24}$/) ? true : false);
}

export const toDeepObjectId = (json: any): any => {
  if (typeof json === 'string')
    return isObjectId(json) ? new ObjectId(json) : json;

  if (Array.isArray(json)) {
    return json.map((r: any) => toDeepObjectId(r));
  }

  if (typeof json === 'object' && json !== null) {
    const newJson: any = {};
    for (const key in json) {
      newJson[key] = toDeepObjectId(json[key]);
    }
    return newJson;
  }
  return json;
};

// Generates a random number between 0 and m, and checks if the number is in the array u. 
// If it is, it recursively calls itself, passing in the same parameters. 
// If it is not, it returns the number.
export const randomId: any = (m: number, u: any) => {
  const r = faker.datatype.number({ min: 0, max: m });
  return u[r] !== undefined ? u[r] : randomId(m, u);
};

export const checkIfValidMD5Hash = (str: any) => {
  const regexExp = /^[a-f0-9]{40}$/gi;
  return regexExp.test(str);
};

export default {
  isObjectId,
  toDeepObjectId,
  sha256,
  randomId,
  checkIfValidMD5Hash,
};
