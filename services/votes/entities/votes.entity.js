module.exports = {
  entity: {
    voters: {
      type: 'object',
      optional: true,
    },
    count: {
      type: 'number',
      optional: true,
    },
    total: {
      type: 'number',
      optional: true,
    },
    voted: {
      type: 'number',
      optional: true,
    },
    tid: {
      type: 'string',
      optional: true,
    },
    pid: {
      type: 'string',
      optional: true,
    },
    cid: {
      type: 'string',
      optional: true,
    },
    createdAt: {
      type: 'date',
      optional: true,
      default: () => new Date(),
    },
  },
  fields: [
    '_id',
    'pid',
    'cid',
    'tid',
    'vid',
    'voters',
    'count',
    'voted',
    'd',
    'createdAt',
    'total',
  ],
};
