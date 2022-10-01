/* eslint-disable no-restricted-syntax */
const os = require('os');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');
const dayjs = require('dayjs');
const faker = require('faker');

const sha256 = (str) => crypto.createHash('sha256').update(str, 'binary').digest('hex');

const getUniqId = () => {
  const interfaces = os.networkInterfaces();
  let mac = os.hostname();

  if (interfaces.en0 && Array.isArray(interfaces.en0) && interfaces.en0.length > 0) {
    mac = interfaces.en0.filter((i) => i.family === 'IPv4')[0].mac;
  }

  return sha256(mac);
};
const isObjectId = (str) => /^[0-9a-fA-F]{24}$/.test(str);

function validURL(str) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return !!pattern.test(str);
}

const toDeepObjectId = (json) => {
  if (typeof json === 'string') return isObjectId(json) ? ObjectId(json) : json;

  const newJson = json;
  for (const key in newJson) {
    if (typeof newJson[key] === 'string' && isObjectId(newJson[key]))
      newJson[key] = ObjectId(newJson[key]);
    else if (typeof newJson[key] === 'object') {
      newJson[key] = toDeepObjectId(newJson[key]);
    } else if (Array.isArray(newJson[key])) {
      newJson[key] = newJson[key].map((r) => toDeepObjectId(r));
    }
  }

  return newJson;
};

const toDeepDate = (json) => {
  if (typeof json === 'string') {
    return dayjs(json).isValid() && isNaN(json) ? dayjs(json).toDate() : json;
  }

  const newJson = json;
  for (const key in newJson) {
    if (typeof newJson[key] === 'string') newJson[key] = toDeepDate(newJson[key]);
    else if (typeof newJson[key] === 'object') {
      newJson[key] = toDeepDate(newJson[key]);
    } else if (Array.isArray(newJson[key])) {
      newJson[key] = newJson[key].map((r) => toDeepDate(r));
    }
  }

  return newJson;
};
const randomId = (m, u) => {
  const r = faker.datatype.number({ min: 0, max: m });
  try {
    return u[r] !== undefined ? u[r] : randomId(m, u);
  } catch (err) {
    return randomId(m, u);
  }
};

module.exports = {
  isObjectId,
  validURL,
  toDeepDate,
  toDeepObjectId,
  sha256,
  getUniqId,
  randomId,
  resp: (res, body, statusCode = 200, headers = {}) => {
    headers = {
      ...headers,
      'Content-Type': 'application/json charset=utf-8',
    };

    for (const h in headers) res.setHeader(h, headers[h]);
    res.writeHead(statusCode);
    res.end(JSON.stringify(body));
  },
  checkIfValidMD5Hash: (str) => {
    const regexExp = /^[a-f0-9]{40}$/gi;
    return regexExp.test(str);
  },
};
