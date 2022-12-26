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
  },
  fields: ['_id', 'post', 'voters', 'count', 'voted', 'd', 'createdAt', 'total'],
};
