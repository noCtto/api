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
import createDbServiceMixin from '../../mixins/mongodb.mixin';
import { ObjectId } from 'mongodb';

interface AccountSettings extends DbServiceSettings {
	defaultName: string;
  JWT_SECRET: string;
  populates: any;
}

interface AccountMethods extends DbServiceMethods {
  extractUser(ctx: Context): ObjectId | null;
  getByUsername(ctx: any, username:string): Promise<any>;
  generateJWT(ctx: any, user: any, expires:any):string;
  transformEntity2(ctx: any, user: any, withToken: boolean, token: string): Promise<any>;
  transformEntity(ctx: any, user: any, withToken: boolean, token: string): Promise<any>;
  validateSession(ctx: any,user:any, extra:any): Promise<any>;
}

interface AccountLocalVars {
	myVar: string;
}

export type AccountThis = Service<AccountSettings> & AccountMethods & AccountLocalVars;


const AccountService: ServiceSchema<AccountSettings> & { methods: DbServiceMethods } = {
	name: "accounts",
  mixins: [ createDbServiceMixin('account','users') ],
	/**
	 * Settings
	 */
	settings: {
    JWT_SECRET: 'secret',
		defaultName: "Account",
    fields: fields,
    entityValidator: entityValidator,
    /**
     * Populates 
     */
    populates: {
      ...populates,
    },
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