export type Params = {
  uid1?: string;
  uid2: string;
};

export default {
  uid1: {
    type: 'string',
    optional: true,
  },
  uid2: {
    type: 'string',
    required: true,
  },
};
