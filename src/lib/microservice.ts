
import type { DbServiceMethods } from '@mixins/mongodb.mixin';

import type { Context, ServiceSchema } from 'moleculer';

import DbMixin from '@mixins/mongodb.mixin';

import { extractCompany, extractUser, health, random } from '@utils/index';

export type MicroServiceMethods = DbServiceMethods & {
  extractCompany(ctx: Context): Promise<any>;
  extractUser(ctx: Context): Promise<any>;
};

export type MicroServiceActions = {
  [key: string]: (ctx: Context) => Promise<any>;
  health: (ctx: Context) => Promise<any>;
  random: (ctx: Context) => Promise<any>;
};

export type MicroServiceSchema = Partial<ServiceSchema> & {
  collection?: string;
  methods?: MicroServiceMethods;
  actions?: MicroServiceActions;
};

export interface MicroServiceConf {
  database: string;
  collection: string;
  fields: string[];
  validator: any;
  actions: any;
  methods: any;
  hooks: any;
  populates: any;
}

export type MicroService = MicroServiceSchema;

export default function(name:string, conf:any) {
  const { database, collection, fields, validator, actions, methods, hooks, populates } = conf;

  const MicroService: MicroService & { methods: MicroServiceMethods } = {
    name,
    mixins: [DbMixin(database, collection)],
    _settings: {
      fields: fields,
      entityValidator: validator,
      indexes: [{ name: 'name', value: 1, options: { unique: true }}],
    },
    get settings() {
      return this._settings;
    },
    set settings(value) {
      this._settings = value;
    },
    hooks,
    populates,
    actions: {
      ...actions,
      random,
      health,
    },
    methods: {
      ...methods,
      extractCompany,
      extractUser,
    },
    async afterConnected() {
      this.logger.info(`Connected successfully to ${database}`);
    },
    onStarted() {
      this.logger.info(`Service ${name} started`);
    }
  };
  return MicroService;
}