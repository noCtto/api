module.exports = {
  entity: {
    username: 'string|min:5',
    email: 'email',
    password: 'string|min:8',
    imageUrl: { type: 'string', optional: true },
    createdAt: 'date',
    lastLogin: { type: 'date', optional: true },
    active: { type: 'boolean', default: true },
  },
  fields: [
    '_id',
    'username',
    'email',
    'password',
    'imageUrl',
    'createdAt',
    'lastLogin',
    'active',
    'posts',
    'admin',
  ],
};
