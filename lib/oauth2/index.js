const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

module.exports = async (
  connectionString,
  options = { useNewUrlParser: true, useUnifiedTopology: true }
) => {
  console.log('Connection String', connectionString);
  const connection = await mongoose.connect(connectionString, options).catch((err) => {
    // eslint-disable-next-line no-console
    console.log(`[oAuth2Server] ❌ Mongoose connection error`, err);
  });
  mongoose.Promise = global.Promise;

  if (Object.keys(mongoose.connection.models).length > 0)
    return { connection, db: mongoose.connection.models };

  const token = connection.model(
    'token',
    new Schema({
      accessToken: String,
      accessTokenExpiresAt: Date,
      client: { type: ObjectId, ref: 'client' },
      user: { type: ObjectId, ref: 'user' },
      scope: String,
    })
  );

  const authorizationCode = connection.model(
    'authorizationCode',
    new Schema({
      code: String,
      expiresAt: Date,
      redirectUri: String,
      scope: String,
      user: { type: ObjectId, ref: 'user' },
      client: { type: ObjectId, ref: 'client' },
    })
  );

  const client = connection.model(
    'client',
    new Schema({
      clientId: String,
      clientSecret: String,
      redirectUris: [String],
      grants: {
        type: [String],
        default: ['authorization_code', 'password', 'refresh_token', 'client_credentials'],
      },
      scope: String,
      user: { type: ObjectId, ref: 'user' },
      extra: String,
    })
  );

  const refreshToken = connection.model(
    'refreshToken',
    new Schema({
      refreshToken: String,
      refreshTokenExpiresAt: Date,
      client: { type: ObjectId, ref: 'client' },
      user: { type: ObjectId, ref: 'user' },
      scope: String,
    })
  );

  const scope = connection.model(
    'scope',
    new Schema({
      scope: String,
      is_default: Boolean,
    })
  );

  const user = connection.model(
    'user',
    new Schema({
      username: String,
      password: String,
      scope: String,
    })
  );

  return {
    connection,
    db: {
      token,
      authorizationCode,
      client,
      refreshToken,
      scope,
      user,
    },
  };
};
