import { ObjectId } from 'mongodb';

export default {
  rest: 'POST /vote',
  params: {
    id: { type: 'objectID', ObjectID: ObjectId, optional: false },
    d: 'boolean',
  },
  handler(ctx) {
    return this.Promise.resolve(this.vote(ctx));
  },
};
