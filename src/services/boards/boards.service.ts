import actions from './actions';
import methods from './methods';
import hooks from './hooks';
import populates from './populates';

import {
  Validator as entityValidator,
  Fields as fields,
} from './entities/board.entity';

import type { Context, Service, ServiceSchema } from "moleculer";
import type { DbServiceSettings } from 'moleculer-db';
import type { DbServiceMethods } from '../../mixins/mongodb.mixin';

interface BoardSettings extends DbServiceSettings {
	defaultName: string;
  JWT_SECRET: string;
}

interface BoardMethods {
  extractUser(ctx: Context): string;
}

interface BoardLocalVars {
	myVar: string;
}

export type BoardThis = Service<BoardSettings> & BoardMethods & BoardLocalVars;

const BoardService: ServiceSchema<BoardSettings> & { methods: DbServiceMethods } = {
	name: "boards",
	/**
	 * Settings
	 */
	settings: {
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
		defaultName: "Board",
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
	created(this: BoardThis) {},

	/**
	 * Service started lifecycle event handler
	 */
	async started(this: BoardThis) {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped(this: BoardThis) {},
};

export default BoardService;