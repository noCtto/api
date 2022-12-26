const { ObjectId } = require('mongodb');

module.exports = {
  rest: 'POST /vote',
  params: {
    id: { type: 'objectID', ObjectID: ObjectId, optional: false },
    d: 'boolean',
  },
  handler(ctx) {
    return this.Promise.resolve(this.vote(ctx));
  },
};
