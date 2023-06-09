import actions from './actions';
import methods from './methods';
import hooks from './hooks';
import populates from './populates';

import {
  Validator as entityValidator,
  Fields as fields,
} from './entities/post.entity';

import type { Context, Service, ServiceSchema } from "moleculer";
import type { DbServiceSettings } from 'moleculer-db';
import type { DbServiceMethods } from '../../mixins/mongodb.mixin';
import createDbServiceMixin from '../../mixins/mongodb.mixin';

interface PostSettings extends DbServiceSettings {
	defaultName: string;
  JWT_SECRET: string;
  populates: any;
}

interface PostMethods {
  extractUser(ctx: Context): string;
}

interface PostLocalVars {
	myVar: string;
}

export type PostThis = Service<PostSettings> & PostMethods & PostLocalVars;

const PostService: ServiceSchema<PostSettings> & { methods: DbServiceMethods } = {
	name: "posts",
	/**
	 * Settings
	 */
	settings: {
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
		defaultName: "Post",
    fields: fields,
    entityValidator: entityValidator,
    /**
     * Populates 
     */
    populates: {
      ...populates,
    },
	},
  mixins: [ createDbServiceMixin('nocheto','posts') ],
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
	created(this: PostThis) {},

	/**
	 * Service started lifecycle event handler
	 */
	async started(this: PostThis) {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped(this: PostThis) {},
};

export default PostService;