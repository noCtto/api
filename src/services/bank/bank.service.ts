
import MicroService from '@lib/microservice';
import type { MicroService as MicroServiceSchema } from '@lib/microservice';

// new change made
const AwardsService = MicroService(
  'bank',
  {
    database: 'nocheto',
    collection: 'bank',
    fields: ['_id'],
    validator: {},
    actions: {
      create: {
        params: {
          uid: { type: 'string', optional: true, convert: true },
          amount: { type: 'number', optional: true },
          pid: { type: 'string', optional: true },
          cid: { type: 'string', optional: true },
          bid: { type: 'string', optional: true },
          tid: { type: 'string', optional: true },
          vid: { type: 'string', optional: true },
      },
        async handler(this:MicroServiceSchema, ctx: any) {
          console.log('Creating bank note', ctx.params);
          
          const { _id } = await this._create(ctx, {
            createdAt: new Date(),
          });

          return { _id };
        }
      },
    },
    methods: {},
    hooks: {},
    events: {
      'post.created': {
        group: "other",
        async handler(ctx: any) {
          console.log('Bank Event Handler Post created', ctx.params);
          const { uid } = ctx.params;
          return ctx.broker.call('bank.create', { uid });
        }
      },
      'post.voted': {
        group: "other",
        handler(ctx: any) {
          const { uid } = ctx.params;
          return ctx.broker.call('bank.create', { uid });
        }
      },      
    },
    populates: {},
  }
);
export default AwardsService;