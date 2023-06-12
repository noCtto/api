import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';

// interface CommentEntity {
//   _id: string;
//   tid: string;
//   cid: string;
//   pid: string;
//   uid: string;
//   vid: string;
//   text: string;
//   createdAt: Date;
//   author: any;
//   replies: any;
//   votes: any;
// }

export const Validator = {
    type: {
      type: 'string',
      enum: ['pid', 'cid'],
      required: true,
    },
    target: {
      type: 'objectID',
      ObjectID: ObjectId,
      required: true,
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
