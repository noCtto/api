import os from 'os';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';

import { faker } from '@faker-js/faker';


export const sha256 = (str:any) => crypto.createHash('sha256').update(str, 'binary').digest('hex');

export const getUniqId = () => {
  const interfaces = os.networkInterfaces();
  let mac = os.hostname();

  if (interfaces.en0 && Array.isArray(interfaces.en0) && interfaces.en0.length > 0) {
    mac = interfaces.en0.filter((i) => i.family === 'IPv4')[0].mac;
  }

  return sha256(mac);
};

export const isObjectId = (str:any) => /^[0-9a-fA-F]{24}$/.test(str);


export const toDeepObjectId = (json:any) => {
  if (typeof json === 'string') return isObjectId(json) ? new ObjectId(json) : json;

  const newJson = json;
  for (const key in newJson) {
    if (typeof newJson[key] === 'string' && isObjectId(newJson[key]))
      newJson[key] = new ObjectId(newJson[key]);
    else if (typeof newJson[key] === 'object') {
      newJson[key] = toDeepObjectId(newJson[key]);
    } else if (Array.isArray(newJson[key])) {
      newJson[key] = newJson[key].map((r:any) => toDeepObjectId(r));
    }
  }

  return newJson;
};

export const randomId:any = (m: number, u: any) => {
  const r = faker.datatype.number({ min: 0, max: m });
  try {
    return u[r] !== undefined ? u[r] : randomId(m, u);
  } catch (err) {
    return randomId(m, u);
  }
};

export const resp = (res:any, body:any, statusCode = 200, headers:any) => {
  headers = {
    ...headers,
    'Content-Type': 'application/json charset=utf-8',
  };

  for (const h in headers) res.setHeader(h, headers[h]);
  res.writeHead(statusCode);
  res.end(JSON.stringify(body));
};

export default {
  isObjectId,
  toDeepObjectId,
  sha256,
  getUniqId,
  randomId,
  checkIfValidMD5Hash: (str:any) => {
    const regexExp = /^[a-f0-9]{40}$/gi;
    return regexExp.test(str);
  },
};
