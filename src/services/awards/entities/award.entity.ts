import { ObjectId } from 'mongodb';

export type Entity = {
  _id: ObjectId;
  type: string;
  target: ObjectId,
  uid: ObjectId,
  createdAt: Date;
}

export const Validator = {
  type: {
    type: 'objectID',
    ObjectID: ObjectId,
    required: true,
    convert: true
  },
  uid: {
    type: 'objectID',
    ObjectID: ObjectId,
    required: true,
    convert: true
  },
  target: {
    type: 'objectID',
    ObjectID: ObjectId,
    required: true,
    convert: true
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
  'target',
  'type',
  'createdAt',
];
