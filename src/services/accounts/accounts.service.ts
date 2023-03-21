import actions from './actions';
import methods from './methods';
import hooks from './hooks';
import populates from './populates';

import {
  Validator as entityValidator,
  Fields as fields,
} from './entities/user.entity';

import type { Context, Service, ServiceSchema } from "moleculer";
import type { DbServiceSettings } from 'moleculer-db';
import type { DbServiceMethods } from '../../mixins/mongodb.mixin';

interface AccountSettings extends DbServiceSettings {
	defaultName: string;
  JWT_SECRET: string;
}

interface AccountMethods {
  extractUser(ctx: Context): string;
  getByUsername(username:string, ctx: Context): Promise<any>;
  generateJWT: (user: any, expires:any) => Promise<string>;
  transformEntity2: (user: any, withToken: boolean, token: string) => Promise<any>;
  transformEntity: (user: any, withToken: boolean, token: string) => Promise<any>;
  validateSession: (user:any, extra:any, ctx: Context) => Promise<any>;
}

interface AccountLocalVars {
	myVar: string;
}

export type AccountThis = Service<AccountSettings> & AccountMethods & AccountLocalVars;


const AccountService: ServiceSchema<AccountSettings> & { methods: DbServiceMethods } = {
	name: "account",
	/**
	 * Settings
	 */
	settings: {
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
		defaultName: "Account",
    fields: fields,
    entityValidator: entityValidator,
	},
  /**
   * Populates 
   */
  populates: {
    ...populates,
  },
	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
    ...actions,
  },
  /**
   * Methods
   */
  hooks: {
    ...hooks,
  },
	/**
	 * Events
	 */
	events: {
    
  },

	/**
	 * Methods
	 */
	methods: {
    ...methods,
  },

	/**
	 * Service created lifecycle event handler
	 */
	created(this: AccountThis) {},

	/**
	 * Service started lifecycle event handler
	 */
	async started(this: AccountThis) {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped(this: AccountThis) {},
};

export default AccountService;