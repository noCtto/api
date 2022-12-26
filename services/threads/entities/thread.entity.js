const { ObjectId } = require('mongodb');

module.exports = {
  entity: {
    post: {
      type: 'objectID',
      ObjectID: ObjectId,
    },
    comments: {
      type: 'array',
      optional: true,
      default: [],
    },
  },
  fields: ['_id', 'post', 'comments'],
};
