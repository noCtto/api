module.exports = {
  rest: 'POST /logout',
  cache: false,
  params: {
    username: { type: 'string' },
  },
  async handler(ctx) {
    const { username } = ctx.params;
    this.logger.info('Logout de session.');

    this.logger.info('Buscamos sesion activa del usuario en sessions.');

    const user = await this.getByUsername(username, ctx);
    if (!user) throw new Error('User not found');

    return ctx
      .call('sessions.find', {
        query: {
          user: user._id,
        },
      })
      .then(([session]) => {
        if (!session) return this.Promise.resolve({ msg: 'Ok!' });
        return ctx
          .call('sessions.remove', {
            id: session._id,
          })
          .then((json) => {
            this.entityChanged('updated', json, ctx);
          });
      });
  },
};
