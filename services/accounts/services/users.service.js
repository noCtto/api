/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
const { MoleculerClientError } = require('moleculer').Errors;
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const faker = require('faker');
const MongoDbMixin = require('../../../mixins/mongodb.mixin');
require('dotenv').config();

const {
  NORMAL_MIN,
  CLIENT_ROLE,
  COUNTRY_PROCESS,
  CLIENT_MIN,
  FIELDS,
  OPERATORS,
} = require('../../../utils/constants');

const { sha256, isObjectId } = require('../../../utils/func');

const { JWT_SECRET } = process.env;

module.exports = {
  name: 'users',
  mixins: [MongoDbMixin('users', 'account')],
  settings: {
    JWT_SECRET,
    fields: [
      '_id',
      'username',
      'email',
      'password',
      'imageUrl',
      'createdAt',
      'lastLogin',
      'active',
      'posts',
    ],
    entityValidator: {
      username: 'string|min:5',
      name: 'string|min:3',
      email: 'email',
      password: 'string|min:35',
      imageUrl: { type: 'string', optional: true },
      createdAt: 'date',
      lastLogin: { type: 'date', optional: true },
      active: { type: 'boolean', default: true },
      stuff: 'array',
      post: {
        type: 'array',
        optional: true,
      },
    },
    populates: {
      posts(ids, users, rule, ctx) {
        return this.Promise.all(
          users.map((user) =>
            ctx
              .call('posts.list', {
                query: { author: ObjectId(user._id) },
                fields: ['_id', 'title', 'text', 'createdAt', 'image', 'board', 'votes', 'author'],
                page: ctx.params.page || 1,
                pageSize: ctx.params.pageSize || 10,
                populate: ['votes'].join(','),
              })
              .then((res) => {
                user.posts = res;
                return user;
              })
          )
        );
      },
    },
  },
  hooks: {
    before: {
      async create(ctx) {
        const query = {
          username: ctx.params.username,
        };

        const exist = await ctx
          .call('users.find', {
            query,
            fields: ['_id', 'username'],
          })
          .then(([user]) => user);

        if (exist) throw new Error(`This user ${exist.email} already exist!.`);

        ctx.params.createdAt = new Date();
      },
      async update(ctx) {
        this.logger.info(`Actualizacion de usuario: ${ctx.params.id}`);
      },
      async get(ctx) {
        if (ctx.params.id && !isObjectId(ctx.params.id) && typeof ctx.params.id === 'string') {
          const query = {
            username: ctx.params.id,
          };
          const exist = await ctx
            .call('users.find', {
              query,
              fields: ['_id'],
            })
            .then(([user]) => user);

          if (exist) {
            ctx.params.id = exist._id;
          }
        }
      },
    },
    after: {},
  },
  actions: {
    getUserInfo: {
      handler(ctx) {
        return ctx.meta.user;
      },
    },
    register: {
      params: {
        username: 'string|min:5',
        name: 'string|min:3',
        lastName: 'string|min:5',
        email: 'email',
        password: 'string|min:35',
        photoUrl: { type: 'string', optional: true },
      },
      handler(ctx) {
        return 'YES';
      },
    },
    fake: {
      rest: 'POST /fake',
      async handler(ctx) {
        for (let n = 0; n < 10; n++) {
          const randomCard = faker.helpers.createCard();
          this._create(ctx, {
            ...randomCard,
            username: faker.internet.userName(),
            accountHistory: null,
            photoUrl: faker.image.imageUrl(),
            password: '123456',
            active: true,
          });
        }
        return {
          done: true,
        };
      },
    },
    forceLogout: {
      rest: 'POST /forceLogout',
      cache: false,
      params: {
        username: { type: 'string' },
        password: { type: 'string', min: 35 },
        environment: { type: 'string' },
        fingerprint: {
          type: 'string',
          default: 'localhost',
          optional: true,
        },
      },
      handler(ctx) {
        const { username } = ctx.params;
        return this._find(ctx, {
          query: {
            username: { $regex: username },
          },
        }).then(([user]) => {
          if (!user) {
            return this.Promise.reject(new MoleculerClientError('No user found', 400, 'Error2'));
          }
          return this.Promise.resolve(
            ctx
              .call('users.logout', { id: user._id })
              .then(() => ({
                msg: 'Ok!',
              }))
              .catch(() => ({ msg: 'Ok!' }))
          );
        });
      },
    },
    login: {
      rest: 'POST /login',
      cache: false,
      authorization: false,
      params: {
        username: { type: 'string' },
        password: { type: 'string', min: 4 },
        environment: { type: 'string', optional: true },
        fingerprint: {
          type: 'string',
          default: 'localhost',
          optional: true,
        },
        csrfToken: {
          type: 'string',
          optional: true,
        },
      },
      handler(ctx) {
        console.log('Logging In', ctx.params);
        const { email, password, environment, fingerprint, username } = ctx.params;
        if (!password || (!username && !email))
          return this.Promise.reject(
            new MoleculerClientError('Invalid credentials', 400, ctx.params)
          );
        return this._find(ctx, {
          query: { $or: [{ email }, { username }] },
          fields: ['_id', 'name', 'lastName', 'username', 'email', 'photoUrl', 'password'],
          // populate: ['permissions', 'companies', 'role'],
        })
          .then((users) => {
            const user = users.length > 0 ? users[0] : null;
            if (user) {
              console.log('Logging In user', user[0]);
              if (user.password === sha256(password)) {
                return user;
              }
            }

            return this.Promise.reject(
              new MoleculerClientError('Email or password is invalid!', 422, 'account', [
                // {
                //     field: 'email',
                //     message: 'is not found',
                // },
                user,
              ])
            );
          })
          .then((user) => {
            const update = {
              $set: {
                lastLogin: new Date(),
              },
            };

            return this.adapter.updateById(user._id, update).then(() => user);
          })
          .then((user) => this.transformDocuments(ctx, {}, user))
          .then(async (user) => {
            const token = await this.validateSession(user, ctx);
            return this.transformEntity2(user, token);
          });
      },
    },
    me: {
      rest: 'GET /whoiam',
      // cache: {
      //     keys: ['#token'],
      // },
      handler(ctx) {
        console.log('THIS ME', ctx.meta.oauth.user.id);
        return this.getById(ctx.meta.oauth.user.id)
          .then((user) => {
            console.log('USER', user);
            if (!user) return this.Promise.reject(new MoleculerClientError('User not found!', 400));

            return this.transformDocuments(ctx, { fields: ['_id', 'username'] }, user);
          })
          .then((user) => this.transformEntity2(user, true, ctx.meta.token));
      },
    },
    resolveToken: {
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
    },
    updateToken: {
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

              this.logger.info(
                'Buscamos sesiones ordenadas por creacion y obtenemos la mas reciente.'
              );

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
    },
    setMainCompany: {
      rest: 'PUT /set-company',
      cache: false,
      params: {
        userId: 'string',
        mainCompany: 'string',
      },
      handler(ctx) {
        const { userId, mainCompany } = ctx.params;

        return this._find(ctx, {
          query: {
            _id: ObjectId(userId),
          },
          populate: ['permissions', 'companies', 'role'],
        }).then(([u]) => {
          this.logger.info('Buscamos sesion activa del usuario en sessions.');
          return ctx
            .call('sessions.find', {
              query: {
                user: ObjectId(userId),
              },
              sort: '-createdAt',
            })
            .then(async ([session]) => {
              // objeto extra para el jwt
              const extra = {
                env: u.environment,
                cc: u.cc,
                company: ObjectId(mainCompany), // se pone el company con el cual se va cambiar
                fingerprint: session.fingerprint,
              };
              const addTime = 60 * 10; // 10 MIN
              const today = new Date();

              const exp = (Math.floor(today.getTime() / 1000) + addTime) * 1000;
              const token = this.generateJWT(u._id, extra, exp);
              await ctx
                .call('sessions.update', {
                  _id: session._id,
                  company: ObjectId(mainCompany),
                  expires: new Date(exp),
                  token,
                })
                .then((json) => {
                  this.entityChanged('updated', json, ctx);
                  return json;
                });
              // const localTime = (exp / 1000 - 25200) * 1000;

              return {
                // session: this.transformEntity2(u, token),
                s: { id: session._id },
                expires: exp,
                token,
              };
              // return { token };
            })
            .then((response) =>
              this.Promise.resolve(
                ctx.call('companies.get', {
                  id: mainCompany,
                  fields: ['_id', 'socialName', 'name', 'configurations', 'shipstore'],
                  populate: ['shipstore'],
                })
              ).then((cmp) => {
                if (!cmp) return response;

                return {
                  ...response,
                  cmp,
                };
              })
            );
        });
      },
    },
    logout: {
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
    },
    fetchCatalogs: {
      rest: 'GET /catalogs',
      cache: false,
      async handler(ctx) {
        const query = {
          active: true,
          palette: { $exists: true },
        };
        const companies = await ctx.call('companies.find', {
          query,
          fields: ['_id', 'name'],
        });
        const roles = await ctx.call('roles.find', {
          query: { active: true },
          fields: ['_id', 'name', 'modules'],
        });
        const cc = COUNTRY_PROCESS;
        const permissions = await ctx.call('modules.find', {
          query: { active: true },
          fields: ['_id', 'name', 'toolbox'],
        });
        const fields = FIELDS;
        const operators = OPERATORS;
        return {
          roles,
          companies,
          cc,
          permissions,
          fields,
          operators,
        };
      },
    },
    changePassword: {
      rest: 'PUT /change-password-by-admin',
      cache: false,
      params: {
        userId: 'string',
        password: 'string',
        repeat: 'string',
      },
      handler(ctx) {
        this.logger.info('Actualizar password.');
        const { userId, password, repeat } = ctx.params;
        this.logger.info(userId);

        if (password !== repeat)
          return this.Promise.reject(
            new MoleculerClientError('The passwords is different!', 401, 'account')
          );

        return this._find(ctx, {
          query: {
            _id: ObjectId(userId),
          },
          fields: ['name', 'email', 'password'],
        }).then((user) => {
          if (!user)
            return this.Promise.reject(
              new MoleculerClientError('Ops, user not exist!', 401, 'account')
            );
          return ctx.call('users.update', {
            _id: userId,
            password,
          });
        });
      },
    },
    follow: {
      rest: 'POST /follow',
      params: {
        id: 'string',
      },
      handler(ctx) {
        console.log('FOLLOWING THIS USER', this.extractUser(ctx), ctx.params.id);
        return 'Hello';
      },
    },
  },
  methods: {
    generateJWT(userId, expires) {
      return jwt.sign(
        {
          id: userId,
          exp: expires,
        },
        this.settings.JWT_SECRET
      );
    },
    validateSession(user, ctx) {
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
                console.log('THIS error', er);
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
    },
    async transformEntity(user, withToken = true, token = null, extra = {}, ctx) {
      if (user) {
        delete user.password;
        delete user.createdAt;
        delete user.active;
        if (withToken) user.token = token || (await this.validateSession(user, extra, ctx));
      }

      return user;
    },
    transformEntity2(user, token) {
      if (user) {
        delete user.password;
        delete user.createdAt;
        delete user.active;

        user.token = token;
      }

      return user;
    },
    extractCompany(ctx) {
      if (ctx.meta.oauth) {
        if (ctx.meta.oauth.company) ctx.params.company = ObjectId(ctx.meta.oauth.company);
        // set company by token
        else if (ctx.meta.oauth.client)
          ctx.params.company = ObjectId(ctx.meta.oauth.client.clientId);
      }
      return ctx.params.company;
    },
    extractUser(ctx) {
      let usrId = null;
      if (ctx.meta.oauth) {
        if (ctx.meta.oauth.user) {
          usrId = ctx.meta.oauth.user.id;
        } else {
          usrId = ctx.meta.oauth.id;
        }
      }
      return ObjectId(usrId);
    },
    getByUsername(username, ctx) {
      return this._find(ctx, { username: { $regex: username } }).then(([user]) => user);
    },
  },
};
