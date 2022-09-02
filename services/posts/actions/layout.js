module.exports = {
  rest: 'GET /layout',
  handler() {
    return {
      _id: 'ObjectID',
      title: 'string',
      text: 'string',
      image: 'url',
      createdAt: 'datetime',
      author: 'ObjectId',
      board: 'ObjectId',
      thread: 'ObjectId',
      votes: 'ObjectId',
    };
  },
};
