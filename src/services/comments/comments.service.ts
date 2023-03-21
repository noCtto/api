import actions from './actions';
import methods from './methods';
import hooks from './hooks';
import populates from './populates';

import {
  Validator as entityValidator,
  Fields as fields,
} from './entities/comment.entity';

import type { Context, Service, ServiceSchema } from "moleculer";
import type { DbServiceSettings } from 'moleculer-db';
import type { DbServiceMethods } from '../../mixins/mongodb.mixin';

interface CommentSettings extends DbServiceSettings {
	defaultName: string;
  JWT_SECRET: string;
}

interface CommentMethods {
  extractUser(ctx: Context): string;
}

interface CommentLocalVars {
	myVar: string;
}

export type CommentThis = Service<CommentSettings> & CommentMethods & CommentLocalVars;

const CommentService: ServiceSchema<CommentSettings> & { methods: DbServiceMethods } = {
	name: "comments",
	/**
	 * Settings
	 */
	settings: {
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
		defaultName: "Comment",
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
	created(this: CommentThis) {},

	/**
	 * Service started lifecycle event handler
	 */
	async started(this: CommentThis) {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped(this: CommentThis) {},
};

export default CommentService;