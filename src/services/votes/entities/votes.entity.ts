import { ObjectId } from 'mongodb';

export type Entity = {
  _id: ObjectId;
  type: string;
  target: ObjectId,
  count?: number;
  voted?: number;
  d?: boolean;
  total?: number;
  createdAt: Date;
  voters?: [Object];
  tities?: [Object];
}

export const Validator = {
  count: {
    type: 'number',
    optional: true,
  },
  type: {
    type: 'string',
    optional: true,
    enum: ['pid', 'cid'],
  },
  target: {
    type: 'objectID',
    ObjectID: ObjectId,
    optional: true,
    convert: true
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

export const Fields = [
  '_id',
  'target',
  'type',
  'voters',
  'count',
  'voted',
  'd',
  'createdAt',
  'total',
  'result'
];
