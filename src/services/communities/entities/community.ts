import { ObjectId } from 'mongodb';
export interface Entity {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  logo?: string;
  banner?: string;
  palette?: {
    primary?: {
      light?: string;
      main?: string;
      dark?: string;
      contrastText?: string;
    };
    secondary?: {
      light?: string;
      main?: string;
      dark?: string;
      contrastText?: string;
    };
  };
  configurations?: {
    [key: string]: any;
  };
  active?: boolean;
  createdAt?: Date;
  creator?: string;
  subscribers?: string[];
  posts?: object[];
  uid?: Object;
}

export const Validator = {
  name: 'string',
  description: { type: 'string', optional: true },
  icon: { type: 'string', optional: true },
  logo: { type: 'string', optional: true },
  banner: { type: 'string', optional: true },
  palette: {
    type: 'object',
    optional: true,
    props: {
      primary: {
        type: 'object',
        optional: true,
        props: {
          light: { type: 'string', optional: true },
          main: { type: 'string', optional: true },
          dark: { type: 'string', optional: true },
          contrastText: { type: 'string', optional: true },
        },
      },
      secondary: {
        type: 'object',
        optional: true,
        props: {
          light: { type: 'string', optional: true },
          main: { type: 'string', optional: true },
          dark: { type: 'string', optional: true },
          contrastText: { type: 'string', optional: true },
        },
      },
    },
  },
  active: { type: 'boolean', default: true },
  creator: { type: 'object', optional: true },
  posts: { type: 'array', optional: true },
  uid: {
    type: 'objectID',
    ObjectID: ObjectId,
    optional: true,
    convert: true,
   },
};

export const Fields = [
  '_id',
  'name',
  'description',
  'icon',
  'logo',
  'banner',
  'palette',
  'configurations',
  'active',
  'subscribers',
  'createdAt',
  'creator',
  'updatedAt',
  'active',
  'posts',
];
