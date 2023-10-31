export interface Params {
  username: string;
  password: string;
  environment: string;
  fingerprint?: string;
}

export default {
  username: { type: 'string' },
  password: { type: 'string', min: 35 },
  environment: { type: 'string' },
  fingerprint: {
    type: 'string',
    default: 'localhost',
    optional: true,
  },
};
