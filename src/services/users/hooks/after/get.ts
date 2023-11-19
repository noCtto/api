import type { MicroService } from '@lib/microservice';
import type { Context } from 'moleculer';

export default async function get(
  this: MicroService,
  _ctx: Context & { params: { id: string } },
  response: any
) {

  delete response['password']
  delete response['email']

  return response
}
