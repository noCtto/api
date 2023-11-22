import { ObjectId } from 'mongodb';

export type Entity = {
  _id: ObjectId;
  createdAt: Date;
  name: string;
  icon: string;
  price: number;
}

export const Validator = {
  name: 'string',
  icon: "string",
  price: 'number',
  createdAt: {
    type: 'date',
    optional: true,
    default: () => new Date(),
  },
};

export const Fields = [
  '_id',
  'createdAt',
  'name',
  'icon',
  'price'
];
