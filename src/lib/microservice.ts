import type { ServiceSchema } from 'moleculer';
import type { DbServiceMethods } from '../mixins/mongodb.mixin';
import DbMixin from '../mixins/mongodb.mixin';

import { extractCompany, extractUser } from '../utils/index';

export interface MicroService extends ServiceSchema {
  afterConnected(): Promise<void>;
}

export interface ServiceMethods extends DbServiceMethods {
  extractCompany: (ctx: any) => Promise<any>;
  extractUser: (ctx: any) => Promise<any>;
}
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

export default function(name:string, conf:any) {
  const { database, collection, fields, validator, actions, methods, hooks, populates } = conf;

  const MicroService: MicroService & { methods: ServiceMethods } = {
    name,
    mixins: [DbMixin(database, collection)],
    _settings: {
      fields: fields,
      entityValidator: validator,
      indexes: [{ name: 1 }],
    },
    get settings() {
      return this._settings;
    },
    set settings(value) {
      this._settings = value;
    },
    hooks,
    populates,
    actions,
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