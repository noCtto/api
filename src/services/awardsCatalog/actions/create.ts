import type { Context } from 'moleculer';
import type { MicroService } from '@/lib/microservice';

type Params = {
  type?: string,
  target: string,
}

const params = {
  target: {
    type: 'string',
    required: true,
  },
}

export default {
  params,
  async handler(
    this: MicroService,
    ctx: Context<Params>
  ): Promise<any> {
    console.log('awards-catalog.actions.create', ctx.params );
  },
};
