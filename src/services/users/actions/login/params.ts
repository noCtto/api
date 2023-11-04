export interface Params {
  username?: string;
  password: string;
  environment: string;
  fingerprint?: string;
  csrfToken?: string;
  email?: string;
}

export default {
  username: { type: 'string', optional: true },
  password: { type: 'string', min: 4 },
  environment: { type: 'string', optional: true },
  email: { type: 'string', optional: true },
  fingerprint: {
    type: 'string',
    default: 'localhost',
    optional: true,
  },
  csrfToken: {
    type: 'string',
    optional: true,
  },
};
