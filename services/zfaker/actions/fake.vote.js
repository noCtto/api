const faker = require('faker');
const { ValidationError } = require('moleculer').Errors;
const { ObjectId } = require('mongodb');

module.exports = {
  rest: 'POST /fake',
  params: {
    id: {
      type: 'string',
      optional: true,
    },
    user: {
      type: 'string',
      required: true,
    },
    d: {
      type: 'boolean',
      optional: true,
    },
  },
  handler(ctx) {
    const { id, user } = ctx.params;
    return this.Promise.resolve(
      this._get(ctx, { id }).then((res) => {
        if (!res) return this.Promise.reject(new ValidationError('no vote'));
        const { voters } = res;
        return this._update(ctx, {
          id,
          voters: {
            ...voters,
            [`${ObjectId(user)}`]: Number(ctx.params.d || faker.datatype.boolean()),
          },
        });
      })
    );
  },
};
