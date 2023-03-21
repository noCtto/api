import actions from './actions';
import type { Service, ServiceSchema } from "moleculer";

interface FakeLocalVars {
	myVar: string;
}

export type FakeThis = Service & FakeLocalVars;

const FakeService: ServiceSchema = {
	name: "faker",
	/**
	 * Actions
	 */
	actions: {
    ...actions,
  },
	/**
	 * Events
	 */
	events: {
    
  },
	/**
	 * Service created lifecycle event handler
	 */
	created(this: FakeThis) {},

	/**
	 * Service started lifecycle event handler
	 */
	async started(this: FakeThis) {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped(this: FakeThis) {},
};

export default FakeService;