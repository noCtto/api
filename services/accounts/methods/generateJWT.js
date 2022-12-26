const jwt = require('jsonwebtoken');

module.exports = function generateJWT(userId, expires) {
  return jwt.sign(
    {
      id: userId,
      exp: expires,
    },
    this.settings.JWT_SECRET
  );
};
