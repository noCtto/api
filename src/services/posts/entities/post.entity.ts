import { ObjectId } from 'mongodb';

export type Entity = {
  _id: string;
  body: string;
  title: string;
  image?: string;
  uid: string;
  cid: string;
  votes?: any;
  community?: any;
  thread?: any;
  comments?: any;
  tags?: any;
  labels?: any;
  createdAt: Date;
  updatedAt?: Date;
}

export const Validator = {
  body: {
    type: 'string',
    optional: false,
  },
  title: {
    type: 'string',
    optional: false,
  },
  image: {
    type: 'string',
    min: 5,
    trim: true,
    required: true,
    optional: true,
  },
  cid: {
    type: 'objectID',
    ObjectID: ObjectId,
    optional: true,
  },
  uid: {
    type: 'objectID',
    ObjectID: ObjectId,
    optional: true,
  },
  author: {
    type: 'object',
    optional: true,
  },
  votes: {
    type: 'object',
    optional: true,
  },
  community: {
    type: 'object',
    optional: true,
  },
  thread: {
    type: 'object',
    optional: true,
  },
  comments: {
    type: 'object',
    optional: true,
  },
  tags: {
    type: 'array',
    optional: true,
  },
  label: {
    type: 'array',
    optional: true,
  },
  createdAt: {
    type: 'date',
    optional: true,
    default: () => new Date(),
  }
};

export const Fields = [
  '_id',
  'title',
  'body',
  'image',
  'createdAt',
  'author',
  'community',
  'tags',
  'comments',
  'thread',
  'votes',
  'tags',
  'label',
  'cid',
  'uid',
];
