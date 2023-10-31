/* eslint-disable @typescript-eslint/no-namespace */
import type { ActionSchema as MoleculerActionSchema, Context, Service, ServiceSchema } from 'moleculer';
import type { Collection, Db, Document, MongoClient, ObjectId } from 'mongodb';
import type { DbServiceMethods } from '@mixins/mongodb.mixin';
import type { DbServiceSchema } from '@mixins/mongodb.mixin';

import type {
  infer as ZodInfer,
  ZodRawShape,
  ZodTypeAny,
  objectInputType,
  objectOutputType,
} from 'zod';


export type Meta = {
  $statusCode?: number;
  $responseType?: string;
  $responseHeaders?: {
    [key: string]: string;
  };
  oauth: {
    id: ObjectId;
    company: string;
    client: {
      clientId: string;
    };
    user?: {
      _id: string;
    };
  };
};

export interface ActionSchema<
  TParams extends ZodRawShape = ZodRawShape,
  TResponse extends ZodTypeAny = ZodTypeAny,
  // TDocument extends Document = Document,
> extends MoleculerActionSchema {
  params: TParams;
  handler: (
    this: DbServiceSchema,
    ctx: Context<objectOutputType<TParams, ZodTypeAny>, Meta>
  ) => ZodInfer<TResponse> | Promise<ZodInfer<TResponse>>;
  response: TResponse;
}

export type MicroServiceMethods = DbServiceMethods & {
  extractUser(ctx: Context): Promise<any>;
};

export type MicroServiceActions = {
  [key: string]: (ctx: Context) => Promise<any>;
  health: (ctx: Context) => Promise<any>;
  random: (ctx: Context) => Promise<any>;
};

export type MicroServiceSchema = Partial<ServiceSchema> & {
  collection: Collection<Document>;
  methods?: MicroServiceMethods;
  actions?: MicroServiceActions;
  events?: any;
  hooks?: any;
};

export interface DbServiceThis<TDocument extends Document = Document>
  extends Service {
  collection: Collection<TDocument>;
}

export type CallParams<TSchema extends ZodRawShape> = objectInputType<
  TSchema,
  ZodTypeAny
>;

export type ZodService = DbServiceSchema;

// export type MicroService = MicroServiceSchema;

export {};
