
import jwt from 'jsonwebtoken';

export default function generateJWT(userId, expires) {
  return jwt.sign(
    {
      id: userId,
      exp: expires,
    },
    this.settings.JWT_SECRET
  );
};
