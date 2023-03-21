import actions from './actions';
import methods from './methods';
import hooks from './hooks';
import populates from './populates';

import {
  Validator as entityValidator,
  Fields as fields,
} from './entities/thread.entity';

import type { Context, Service, ServiceSchema } from "moleculer";
import type { DbServiceSettings } from 'moleculer-db';
import type { DbServiceMethods } from '../../mixins/mongodb.mixin';

interface ThreadSettings extends DbServiceSettings {
	defaultName: string;
  JWT_SECRET: string;
}

interface ThreadMethods {
  extractUser(ctx: Context): string;
}

interface ThreadLocalVars {
	myVar: string;
}

export type ThreadThis = Service<ThreadSettings> & ThreadMethods & ThreadLocalVars;

const ThreadService: ServiceSchema<ThreadSettings> & { methods: DbServiceMethods } = {
	name: "threads",
	/**
	 * Settings
	 */
	settings: {
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
		defaultName: "Thread",
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
	created(this: ThreadThis) {},

	/**
	 * Service started lifecycle event handler
	 */
	async started(this: ThreadThis) {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped(this: ThreadThis) {},
};

export default ThreadService;