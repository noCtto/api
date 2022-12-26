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
    author: {
      type: 'objectID',
      ObjectID: ObjectId,
      optional: false,
    },
    board: {
      type: 'objectID',
      ObjectID: ObjectId,
      optional: true,
    },
    votes: {
      type: 'objectID',
      ObjectID: ObjectId,
      optional: true,
    },
    comments: {
      type: 'object',
      optional: true,
    },
    thread: {
      type: 'object',
      optional: true,
      default: null,
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
  ],
};
