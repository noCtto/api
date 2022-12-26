module.exports = {
  entity: {
    user: { type: 'object', optional: false },
    start: 'date',
    token: 'string',
    expires: 'date',
    createdAt: 'date',
    expired: { type: 'boolean', default: false },
  },
  fields: ['_id', 'user', 'token', 'start', 'expires', 'createdAt', 'expired'],
};
