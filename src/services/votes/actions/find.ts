
import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';
// import MoleculerJs from 'moleculer';
// import dayjs from 'dayjs';
// import { ObjectId } from 'mongodb';

// const { ValidationError } = MoleculerJs.Errors;

export default {
  rest: 'POST /find',
  params: {
    query: { 
      type: 'object',
      required:true
    },
  },
  async handler(this: MicroService, ctx: Context & { params: any }) {
    this.logger.info('votes.actions.find', ctx.params )
    return this._find(ctx, { ...ctx.params })
  },
};
