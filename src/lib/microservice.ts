import type { ServiceSchema } from 'moleculer';
import type { DbServiceSettings } from 'moleculer-db';
import type { DbServiceMethods } from '../mixins/mongodb.mixin';
import DbMixin from '../mixins/mongodb.mixin';

import { extractCompany, extractUser } from '../utils/index';

export interface Service {
  name: string;
  mixins: any[];
  _settings: any;
  get settings(): any;
  set settings(value: any);
  hooks: any;
  populates: any;
  actions: any;
  methods: any;
  afterConnected(): Promise<void>;
}


export default function(name:string, conf:any) {
  const { collection, fields, validator, actions, methods, hooks, populates } = conf;

  interface Settings extends DbServiceSettings {
    indexes?: Record<string, number>[];
  }
  
  const MicroService: ServiceSchema<Settings> & { methods: DbServiceMethods } = {
    name,
    mixins: [DbMixin(collection)],
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
    async afterConnected() {},
  };
  return MicroService;
}