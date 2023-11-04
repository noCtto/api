import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';

export type Entity = {
  _id: string;
  type: string;
  target: string;
  uid: string;
  text: string;
  createdAt: Date;
  author?: any;
  replies?: any;
  votes?: any;
}

export const Validator = {
  type: {
    type: 'string',
    required: true,
  },
  target: {
    type: 'objectID',
    ObjectID: ObjectId,
    convert:true,
    required: true
  },
  uid: {
    type: 'objectID',
    ObjectID: ObjectId,
    required: true
  },
  cid: {
    type: 'objectID',
    ObjectID: ObjectId,
    optional: true
  },
  text: {
    type: 'string',
    required: true,
  },
  createdAt: {
    type: 'date',
    default: dayjs().toDate(),
    optional: true
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
  'target',
  'type',
  'uid',
  'text',
  'replies',
  'createdAt',
  'author',
  'votes',
  'vid',
];
