const { ObjectId } = require('mongodb');
const MongoDbMixin = require('../../../mixins/mongodb.mixin');
const ModelMixin = require('../../../mixins/model.mixin');
const filters = require('../../../utils/filter');

module.exports = {
  name: 'roles',
  mixins: [MongoDbMixin('roles', 'account'), ModelMixin],
  settings: {
    fields: ['_id', 'name', 'description', 'environment', 'modules', 'createdAt', 'active'],
    entityValidator: {
      name: 'string|min:5',
      description: { type: 'string', optional: true },
      environment: { type: 'object' },
      createdAt: 'date',
      modules: {
        type: 'array',
      },
      active: { type: 'boolean', default: true },
    },
    populates: {
      environment: 'environments.get',
      modules: 'modules.get',
    },
  },
  hooks: {
    before: {
      create(ctx) {
        this.logger.info('Create role');
        ctx.params.createdAt = new Date();
        ctx.params.active = true;
        ctx.params.environment = ObjectId(ctx.params.environment);

        if (ctx.params.modules.length > 0) {
          ctx.params.modules = ctx.params.modules.map((p) => ObjectId(p._id));
        }
      },
      update(ctx) {
        this.logger.info('Update role');

        if (ctx.params.environment) ctx.params.environment = ObjectId(ctx.params.environment);

        if (ctx.params.modules && ctx.params.modules.length > 0) {
          ctx.params.modules = ctx.params.modules.map((p) => ObjectId(p._id));
        }
      },
      list(ctx) {
        if (!ctx.params.query) ctx.params.query = {};
        ctx.params.query.active = true;
      },
    },
    after: {
      list(ctx, res) {
        return filters.list(ctx, res);
      },
      async update(ctx) {
        this.logger.info('- - Role Updated. Updating Modules - -');

        await ctx
          .call('roles.get', {
            id: ctx.params._id,
            fields: ['_id', 'modules'],
            populate: ['modules'],
          })
          .then(async (role) => {
            const query = {
              role: ObjectId(role._id),
            };
            const pToUpdate = role.modules.map((p) => ({
              module: ObjectId(p._id),
              actions: ['create', 'read', 'update', 'delete'],
              createdAt: new Date(),
              toolbox: p.toolbox || false,
            }));

            ctx
              .call('users.find', {
                query,
                fields: ['_id', 'name', 'role'],
              })
              .then((usersToUpdate) => {
                this.logger.info(`Total usuarios a actualizar permisos: ${usersToUpdate.length}`);

                if (usersToUpdate && usersToUpdate.length > 0) {
                  usersToUpdate.forEach((u) => {
                    const toUpdate = {
                      id: ObjectId(u._id),
                      permissions: pToUpdate,
                    };
                    ctx
                      .call('users.update', toUpdate)
                      .then(() => this.logger.info(`user ${u._id} updated!`))
                      .catch((err) => this.logger.error(err));
                  });
                }
              });
          });
      },
    },
  },
};
