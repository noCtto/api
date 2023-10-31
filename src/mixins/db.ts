import {
  MongoClient,
  type Collection,
  type Db,
  type Document,
  type MongoClientOptions,
} from 'mongodb';

import type { ServiceWithDb } from '@types';

export interface MongoDBMixin<TDocument extends Document>
  extends Partial<ServiceWithDb<TDocument>> {
  db: Db;
  client: MongoClient;
  collection: Collection<TDocument>;
}

type MongoDBMixinParams = {
  uri: string;
  options?: MongoClientOptions;
  defaultCollection: string;
};

export const mongoDbMixin = <TDocument extends Document = Document>({
  uri,
  options,
  defaultCollection,
}: MongoDBMixinParams) => {
  const client = new MongoClient(uri, options);
  const db = client.db(process.env.MONGO_DEFAULT_DATABASE);
  const collection = db.collection<TDocument>(defaultCollection);

  return {
    client,
    db,
    collection,
    created() {
      this.client = client;
      this.db = db;
      this.collection = collection;
    },
    async started() {
      await client.connect();
      this.logger!.info('Connected to database!');
    },
    async stopped() {
      await client.close();
      this.logger!.info('Disconnected from database.');
    },
  } satisfies MongoDBMixin<TDocument>;
};
