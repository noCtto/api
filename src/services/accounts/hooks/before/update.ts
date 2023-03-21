import type { AccountThis } from '../../accounts.service';
import type { Context } from 'moleculer';


export default async function update(this:AccountThis, ctx:Context & { params: { id: string } }) {
  this.logger.info(`Actualizacion de usuario: ${ctx.params.id}`);
};
