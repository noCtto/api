const jwt = require('jsonwebtoken');

module.exports = {
  params: {
    token: 'string',
  },
  async handler(ctx) {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(ctx.params.token, this.settings.JWT_SECRET, (err, tokenDecoded) => {
        if (err) {
          this.logger.error(err);
          return reject(new Error('Token has expired, try login again.'));
        }

        return resolve(tokenDecoded);
      });
    });
    return decoded;
  },
};
