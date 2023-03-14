
import { ObjectId } from 'mongodb';

export interface VoteEntity {
  _id: ObjectId;
  pid: ObjectId;
  cid: ObjectId;
  tid: ObjectId;
  vid: ObjectId;
  voters: {
    [key: string]: number;
  };
  count: number;
  voted: number;
  d: boolean;
  total: number;
  createdAt: Date;
}

export const Validator = {
  voters: {
    type: 'object',
    optional: true,
  },
  tid: {
    type: 'objectID',
    ObjectID: ObjectId,
    optional: true,
  },
  pid: {
    type: 'objectID',
    ObjectID: ObjectId,
    optional: true,
  },
  cid: {
    type: 'objectID',
    ObjectID: ObjectId,
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
  createdAt: {
    type: 'date',
    optional: true,
    default: () => new Date(),
  },
};

export const Fields =[
  '_id',
  'pid',
  'cid',
  'tid',
  'vid',
  'voters',
  'count',
  'voted',
  'd',
  'createdAt',
  'total',
];
