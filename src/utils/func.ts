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
  const newJson: any = json;
  for (const key in newJson) {
    if (typeof newJson[key] === 'string' && isObjectId(newJson[key]))
      newJson[key] = new ObjectId(newJson[key]);
    else if (typeof newJson[key] === 'object') {
      newJson[key] = toDeepObjectId(newJson[key]);
    } else if (Array.isArray(newJson[key])) {
      newJson[key] = newJson[key].map((r: any) => toDeepObjectId(r));
    }
  }
  return newJson;
};

export const randomId: any = (m: number, u: any) => {
  const r = faker.datatype.number({ min: 0, max: m });
  try {
    return u[r] !== undefined ? u[r] : randomId(m, u);
  } catch (err) {
    return randomId(m, u);
  }
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
