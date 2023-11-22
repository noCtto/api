import { ObjectId } from 'mongodb';

export type Entity = {
  _id: ObjectId;
  type: string;
  target: ObjectId,
  createdAt: Date;
  balance: number;
}

export const Validator = {
  type: {
    type: 'string',
    optional: true,
    enum: ['csid'],
  },
  uid: {
    type: 'objectID',
    ObjectID: ObjectId,
    optional: true,
    convert: true
  },
  balance: {
    type: 'number',
    default: 1000
  },
  createdAt: {
    type: 'date',
    optional: true,
    default: () => new Date(),
  },
};

export const Fields = [
  '_id',
  'uid',
  'createdAt',
  'balance'
];
