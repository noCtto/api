import { ObjectId } from 'mongodb';

export type Params = {
  tid: string,
  cid?: string,
  uid: string,
  text: string,
  createdAt: Date
}


export default {
  tid: {
    type: 'objectID',
    ObjectID: ObjectId,
    convert: true,
    required: true
  },
  uid: {
    type: 'objectID',
    ObjectID: ObjectId,
    convert: true,
    required: true
  },
  cid: {
    type: 'objectID',
    ObjectID: ObjectId,
    convert: true,
    optional: true
  },
  text: {
    type: 'string',
    optional: false,
  },
  createdAt: {
    type: 'date',
    optional: true,
    default: () => new Date(),
  },
}