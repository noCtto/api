import type { Context, ServiceSchema } from 'moleculer';
import type { DbServiceMethods } from '@mixins/mongodb.mixin';
import DbMixin from '@mixins/mongodb.mixin';
import { extractUser, health, random } from '@utils/index';

export type MicroServiceMethods = DbServiceMethods & {
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
  events?: any;
  hooks?: any;
};

export interface MicroServiceConf {
  database: string;
  collection: string;
  fields: string[];
  validator: any;
  actions: any;
  methods: any;
  hooks: any;
  events: any;
  populates: any;
}

export type MicroService = MicroServiceSchema;

export default function (name: string, conf: any) {
  const {
    database,
    collection,
    fields,
    validator,
    actions,
    methods,
    hooks,
    populates,
    events,
  } = conf;

  const MicroService: MicroService & { methods: MicroServiceMethods } = {
    name,
    mixins: [DbMixin(database, collection)],
    _settings: {
      fields: fields,
      entityValidator: validator,
      indexes: [{ name: 'name', value: 1, options: { unique: true } }],
      populates,
    },
    get settings() {
      return this._settings;
    },
    set settings(value) {
      this._settings = value;
    },
    hooks,
    actions: {
      ...actions,
      random,
      health,
    },
    events: {
      ...events,
    },
    methods: {
      ...methods,
      extractUser,
    },
    async afterConnected() {
      this.logger.info(`Connected successfully to ${database}`);
    },
    onStarted() {
      this.logger.info(`Service ${name} started`);
    },
  };
  return MicroService;
}
