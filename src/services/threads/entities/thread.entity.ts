import { ObjectId } from 'mongodb';

export interface ThreadEntity {
  _id: ObjectId;
  pid: ObjectId;
  comments: ObjectId[];
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
};

export const Fields = ['_id', 'pid', 'comments'];
