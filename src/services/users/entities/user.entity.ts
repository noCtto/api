export interface Entity {
  _id: string;
  username: string;
  email: string;
  password: string;
  imageUrl?: string;
  createdAt: Date;
  lastLogin?: Date;
  active: boolean;
  subscribers?: { [key: string]: boolean };
  posts?: string[];
  admin?: boolean;
  communities?: object;
  comments?: object;
  wallet?:object;
  moderating?:object;
}

export const Validator = {
  username: 'string|min:5',
  email: 'email',
  password: 'string|min:8',
  imageUrl: { type: 'string', optional: true },
  createdAt: 'date',
  lastLogin: { type: 'date', optional: true },
  active: { type: 'boolean', default: true },
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
  'subscribers',
  'posts',
  'communities',
  'comments',
  'wallet',
  'moderating'
];
