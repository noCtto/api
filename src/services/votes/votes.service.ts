import actions from './actions';
import methods from './methods';
import hooks from './hooks';
import populates from './populates';

import {
  Validator as entityValidator,
  Fields as fields,
} from './entities/votes.entity';

import type { Context, Service, ServiceSchema } from "moleculer";
import type { DbServiceSettings } from 'moleculer-db';
import type { DbServiceMethods } from '../../mixins/mongodb.mixin';
import createDbServiceMixin from '../../mixins/mongodb.mixin';

interface VoteSettings extends DbServiceSettings {
	defaultName: string;
  JWT_SECRET: string;
  populates: any;
}

interface VoteMethods {
  extractUser(ctx: Context): string;
}

interface VoteLocalVars {
	myVar: string;
}

export type VoteThis = Service<VoteSettings> & VoteMethods & VoteLocalVars;

const VoteService: ServiceSchema<VoteSettings> & { methods: DbServiceMethods } = {
	name: "votes",
	/**
	 * Settings
	 */
	settings: {
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
		defaultName: "Vote",
    fields: fields,
    entityValidator: entityValidator,
    /**
     * Populates 
     */
    populates: {
      ...populates,
    },
	},
  mixins: [ createDbServiceMixin('nocheto','votes') ],
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
	created(this: VoteThis) {},

	/**
	 * Service started lifecycle event handler
	 */
	async started(this: VoteThis) {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped(this: VoteThis) {},
};

export default VoteService;