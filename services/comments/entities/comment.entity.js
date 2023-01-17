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
    pid: {
      type: 'objectID',
      ObjectID: ObjectId,
      default: null,
      optional: true,
    },
    uid: {
      type: 'objectID',
      ObjectID: ObjectId,
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
    replies: {
      type: 'object',
      default: {},
      optional: true,
    },
    votes: {
      type: 'objectID',
      ObjectID: ObjectId,
      default: null,
      optional: true,
    },
  },
  fields: ['_id', 'tid', 'cid', 'pid', 'uid', 'text', 'replies', 'createdAt', 'author', 'votes'],
};
