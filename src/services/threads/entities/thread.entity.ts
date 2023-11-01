import { ObjectId } from 'mongodb';

export interface Entity {
  _id: ObjectId;
  pid: ObjectId;
  comments: ObjectId[];
  createdAt: Date
}

export const Validator = {
  pid: {
    type: 'objectID',
    ObjectID: ObjectId,
  },
  comments: {
    type: 'array',
    optional: true,
    default: [],
  },
  createdAt: {
    type: 'date',
    default: new Date(),
    optional: true
  },
};

export const Fields = ['_id', 'pid', 'comments'];
