const { ObjectId } = require('mongodb');

module.exports = {
  entity: {
    pid: {
      type: 'objectID',
      ObjectID: ObjectId,
    },
    comments: {
      type: 'array',
      optional: true,
      default: [],
    },
  },
  fields: ['_id', 'pid', 'comments'],
};
