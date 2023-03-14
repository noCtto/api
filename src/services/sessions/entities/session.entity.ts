
export interface SessionEntity {
  _id: string;
  user: any;
  token: string;
  start: Date;
  expires: Date;
  createdAt: Date;
  expired: boolean;
}

export const Validator ={
  user: { type: 'object', optional: false },
  start: 'date',
  token: 'string',
  expires: 'date',
  createdAt: 'date',
  expired: { type: 'boolean', default: false },
};

export const Fields = ['_id', 'user', 'token', 'start', 'expires', 'createdAt', 'expired'];