import actions from './actions';
import methods from './methods';
import hooks from './hooks';
import populates from './populates';

import {
  Validator as entityValidator,
  Fields as fields,
} from './entities/session.entity';

import type { Context, Service, ServiceSchema } from "moleculer";
import type { DbServiceSettings } from 'moleculer-db';
import type { DbServiceMethods } from '../../mixins/mongodb.mixin';

interface SessionSettings extends DbServiceSettings {
	defaultName: string;
  JWT_SECRET: string;
}

interface SessionMethods {
  extractUser(ctx: Context): string;
}

interface SessionLocalVars {
	myVar: string;
}

export type SessionThis = Service<SessionSettings> & SessionMethods & SessionLocalVars;

const SessionService: ServiceSchema<SessionSettings> & { methods: DbServiceMethods } = {
	name: "sessions",
	/**
	 * Settings
	 */
	settings: {
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
		defaultName: "Session",
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
	created(this: SessionThis) {},

	/**
	 * Service started lifecycle event handler
	 */
	async started(this: SessionThis) {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped(this: SessionThis) {},
};

export default SessionService;