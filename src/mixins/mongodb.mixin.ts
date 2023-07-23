import type { Context, Service, ServiceSchema } from 'moleculer';
import type { DbAdapter, MoleculerDB } from 'moleculer-db';
import DbService from 'moleculer-db';
import MongoDbAdapter from 'moleculer-db-adapter-mongo';

export type DbServiceMethods = {
  seedDb?(): Promise<void>;
};

export type DbServiceSchema = Partial<ServiceSchema> &
  Partial<MoleculerDB<DbAdapter>> & {
    collection?: string;
    adapter?: DbAdapter;
  };

export type DbServiceThis = Service & DbServiceMethods;

export default function createDbServiceMixin(
  dbName: string,
  collection: string
): DbServiceSchema {
  const cacheCleanEventName = `cache.clean.${collection}`;

  const schema: DbServiceSchema = {
    mixins: [DbService],

    events: {
      /**
       * Subscribe to the cache clean event. If it's triggered
       * clean the cache entries for this service.
       */
      async [cacheCleanEventName](this: DbServiceThis) {
        if (this.broker.cacher) {
          await this.broker.cacher.clean(`${this.fullName}.*`);
        }
      },
    },
    _methods: {
      /**
       * Send a cache clearing event when an entity changed.
       */
      async entityChanged(
        _type: string,
        _json: unknown,
        ctx: Context
      ): Promise<void> {
        // console.log('entityChanged', type, json);
        await ctx.broadcast(cacheCleanEventName);
      },
    },
    get methods() {
      return this._methods;
    },
    set methods(value) {
      this._methods = value;
    },

    async started(this: DbServiceThis) {
      // Check the count of items in the DB. If it's empty,
      // call the `seedDB` method of the service.
      if (this.seedDB) {
        const count = await this.adapter.count();
        if (count === 0) {
          this.logger.info(
            `The '${collection}' collection is empty. Seeding the collection...`
          );
          // await this.seedDB();
          this.logger.info(
            'Seeding is done. Number of records:',
            await this.adapter.count()
          );
        }
      }
    },
  };
  console.log(
    'Initiating MongoDbAdapter with',
    process.env.MONGO_URI,
    'and',
    dbName,
    'and',
    collection,
    '...'
  );
  if (process.env.MONGO_URI) {
    // Mongo adapter
    schema.adapter = new MongoDbAdapter(
      process.env.MONGO_URI,
      {},
      dbName
    ) as unknown as DbAdapter;
    schema.dbName = dbName;
    schema.collection = collection;
  }

  return schema;
}
