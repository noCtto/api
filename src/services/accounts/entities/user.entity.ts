export interface UserEntity {
  _id: string;
  username: string;
  email: string;
  password: string;
  imageUrl?: string;
  createdAt: Date;
  lastLogin?: Date;
  active: boolean;
  followers?: { [key: string]: boolean };
  posts?: string[];
  admin?: boolean;
}

export const Validator = {
  username: 'string|min:5',
  email: 'email',
  password: 'string|min:8',
  imageUrl: { type: 'string', optional: true },
  createdAt: 'date',
  lastLogin: { type: 'date', optional: true },
  active: { type: 'boolean', default: true },
  followers: {
    type: 'object',
    optional: true,
    default: {},
  },
};

export const Fields = [
  '_id',
  'username',
  'email',
  'password',
  'imageUrl',
  'createdAt',
  'lastLogin',
  'active',
  'followers',
  'posts',
];
