const { ObjectId } = require('mongodb');

module.exports = function validateSession(user, ctx) {
  this.logger.info('Validating: ', user, ctx.params);
  this.logger.info('validateSession');

  const addTime = 0;
  const today = new Date();

  const exp = (Math.floor(today.getTime() / 1000) + addTime) * 1000;
  const query = {
    user: user._id,
  };
  return ctx
    .call('sessions.find', { query, sort: '-createdAt' })
    .then(async (sessions) => {
      this.logger.info('Buscamos sesiones ordenadas por creacion.');
      if (!sessions.length) {
        this.logger.info('No hay sesiones activas');
        this.logger.info('Crear Nueva sesion');
        const token = this.generateJWT(user._id, exp);
        const sessionData = {
          user: ObjectId(user._id),
          start: today,
          expires: new Date(exp),
          createdAt: new Date(),
          token,
        };
        this.logger.info('session -> ', sessionData);
        await ctx
          .call('sessions.create', sessionData)
          .then(() => {
            this.logger.info('Sesion creada, se regresa a front.');
          })
          .catch((er) => {
            console.log('error', er);
          });
        return token;
      }

      this.logger.info('Hay una session al parecer');
      const expired = today > sessions[0].expires;

      // La session mas reciente, validamos que aun no haya expirado y si el fingerprint corresponde
      // si es diferente se regresa session activa.
      if (!expired) {
        this.logger.info('El usuario esta loggeado en otra maquina o tablet');
        throw Error('You are logged in another machine or tablet.');
      } else if (!expired) {
        // La session esta activa aun y concide con el fingerprint
        this.logger.info('Session activa se regresa la misma session.');
        return sessions[0].token;
      } else if (expired) {
        this.logger.info(`La sesion ya expiro en ${expired}, se procede a crear nueva session`);

        await ctx
          .call('sessions.remove', {
            id: sessions[0]._id,
          })
          .then((json) => this.entityChanged('updated', json, ctx));

        // La session ya expiro, se debe crear una nueva y actualizar la session pasada como inactiva.
        this.logger.info('Se actualizo a expired la sesion vieja');
        const token = this.generateJWT(user._id, exp);
        const sessionData = {
          user: ObjectId(user._id),
          start: today,
          expires: new Date(exp),
          createdAt: new Date(),
          token,
        };

        this.logger.info('Se crea nueva session...');

        ctx.call('sessions.create', sessionData).then(() => {
          this.logger.info('Sesion creada.');
        });
        return token;
      } else {
        this.logger.info('La session ya expiro se conecto en otro dispositivo o navegador');
        const token = this.generateJWT(user._id, exp);
        const sessionData = {
          user: ObjectId(user._id),
          start: today,
          expires: new Date(exp),
          createdAt: new Date(),
        };
        await ctx.call('sessions.create', sessionData).then(() => {
          this.logger.info('Sesion creada, se regresa a front.');
        });
        return token;
      }
    })
    .catch((e) => {
      throw Error(e);
    });
};
