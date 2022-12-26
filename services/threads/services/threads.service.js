/* eslint-disable no-param-reassign */
const { ObjectId } = require('mongodb');
const MongoDbMixin = require('../../../mixins/mongodb.mixin');

const populates = require('../populates');
const Entity = require('../entities/thread.entity');
const { extractCompany, extractUser } = require('../../../utils');

const { entity: entityValidator, fields } = Entity;

module.exports = {
  name: 'threads',
  mixins: [MongoDbMixin('threads', 'nocheto')],
  settings: {
    validator: true,
    fields,
    entityValidator,
    populates,
    defaultPopulates: ['total'],
  },
  actions: {
    fake: {
      rest: 'GET /fake/:tid',
      params: {
        tid: 'string',
      },
      async handler(ctx) {
        const thread = await ctx.call('threads.find', { tid: ctx.params.tid });
        if (!thread) {
          return 'thread not found';
        }
        return thread;
      },
    },
  },
  methods: {
    extractCompany,
    extractUser,
  },
  hooks: {
    before: {},
    after: {
      update() {},
      upvote() {},
      downvote() {},
    },
  },
};
