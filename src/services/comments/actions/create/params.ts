export type Params = {
  target: string;
  type: string;
  text: string;
  createdAt: Date;
}

export default {
  target: {
    type: 'string',
    required: true
  },
  type: {
    type: 'string',
    optional: true,
    enum: ['pid', 'cid'],
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