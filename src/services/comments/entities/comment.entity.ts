const { ObjectId } = require('mongodb');
const dayjs = require('dayjs');

interface CommentEntity {
  _id: string;
  tid: string;
  cid: string;
  pid: string;
  uid: string;
  vid: string;
  text: string;
  createdAt: Date;
  author: any;
  replies: any;
  votes: any;
}

export const Validator = {
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
    vid: {
      type: 'objectID',
      ObjectID: ObjectId,
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
      type: 'object',
      optional: true,
    },
    replies: {
      type: 'object',
      optional: true,
    },
    votes: {
      type: 'object',
      optional: true,
    },
  };

  export const Fields = [
    '_id',
    'tid',
    'cid',
    'pid',
    'uid',
    'text',
    'replies',
    'createdAt',
    'author',
    'votes',
    'vid',
  ];
