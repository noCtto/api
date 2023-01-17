const { ObjectId } = require('mongodb');

module.exports = {
  entity: {
    body: {
      type: 'string',
      optional: false,
    },
    title: {
      type: 'string',
      optional: true,
    },
    image: {
      type: 'string',
      min: 5,
      trim: true,
      required: true,
      optional: true,
    },
    tid: {
      type: 'objectID',
      ObjectID: ObjectId,
      optional: true,
    },
    vid: {
      type: 'objectID',
      ObjectID: ObjectId,
      optional: true,
    },
    bid: {
      type: 'objectID',
      ObjectID: ObjectId,
      optional: true,
    },
    uid: {
      type: 'objectID',
      ObjectID: ObjectId,
      optional: true,
    },
    author: {
      type: 'object',
      optional: true,
    },
    votes: {
      type: 'object',
      optional: true,
    },
    board: {
      type: 'object',
      optional: true,
    },
    thread: {
      type: 'object',
      optional: true,
    },
    comments: {
      type: 'object',
      optional: true,
    },
    tags: {
      type: 'array',
      optional: true,
    },
    label: {
      type: 'array',
      optional: true,
    },
  },
  fields: [
    '_id',
    'title',
    'body',
    'image',
    'createdAt',
    'author',
    'board',
    'tags',
    'comments',
    'thread',
    'votes',
    'tags',
    'label',
    'tid',
    'vid',
    'bid',
    'uid',
  ],
};
