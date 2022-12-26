const { ObjectId } = require('mongodb');
const dayjs = require('dayjs');

module.exports = {
  entity: {
    tid: {
      type: 'objectID',
      ObjectID: ObjectId,
      optional: true,
    },
    cid: {
      type: 'objectID',
      ObjectID: ObjectId,
      default: null,
      optional: true,
    },
    text: {
      type: 'string',
      required: true,
    },
    createdAt: {
      type: 'date',
      default: dayjs().toDate(),
      required: true,
    },
    author: {
      type: 'objectID',
      ObjectID: ObjectId,
      default: null,
      optional: true,
    },
    votes: {
      type: 'objectID',
      ObjectID: ObjectId,
      default: null,
      optional: true,
    },
  },
  fields: ['_id', 'tid', 'text', 'cid', 'replies', 'createdAt', 'author', 'votes'],
};
