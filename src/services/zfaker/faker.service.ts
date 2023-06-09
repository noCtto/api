import actions from './actions';
import type { Service, ServiceSchema } from "moleculer";

interface FakeLocalVars {
	myVar: string;
}

export type FakeThis = Service & FakeLocalVars;

const FakeService: ServiceSchema = {
	name: "fake",
	actions: {
    ...actions,
  },
};

export default FakeService;