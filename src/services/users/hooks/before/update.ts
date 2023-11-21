import type { MicroService } from '@/lib/microservice';
import type { Context } from 'moleculer';

export default async function update(
  this: MicroService,
  ctx: Context & { params: { id: string } }
) {
  this.logger.info(`Actualizacion de usuario: ${ctx.params.id}`);
}
