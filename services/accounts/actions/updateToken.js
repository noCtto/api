module.exports = {
  rest: 'PUT /update-token',
  cache: false,
  params: {
    userId: 'string',
  },
  async handler(ctx) {
    this.logger.info('Actualizar la sesion');
    const { userId } = ctx.params;
    this.logger.info(userId);
    const query = {
      user: userId,
    };

    return this._find(ctx, {
      query: {
        _id: ObjectId(userId),
      },
      populate: ['permissions', 'companies'],
    }).then(([user]) =>
      ctx
        .call('sessions.find', { query, sort: '-createdAt' })
        .then(async (sessions) => {
          if (sessions && sessions.length === 0)
            throw Error('You are not logged, try login again.');

          this.logger.info('Buscamos sesiones ordenadas por creacion y obtenemos la mas reciente.');

          const addTime = 0;
          this.logger.info('el usuario tiene role: ');

          this.logger.info('Tiempo de la session es de:');
          this.logger.info(addTime);

          const now = new Date();
          const exp = (Math.floor(now.getTime() / 1000) + addTime) * 1000;

          const token = this.generateJWT(user._id, exp);

          const ss = await ctx
            .call('sessions.update', {
              _id: sessions[0]._id,
              token,
              expires: new Date(exp),
            })
            .then((json) => {
              this.entityChanged('updated', json, ctx);
              return json;
            });

          return {
            // session: this.transformEntity2(user, token),
            s: ss,
            token,
          };
        })
        .catch((e) => {
          throw Error(e);
        })
    );
  },
};
