import actions from './actions';
import type { Service, ServiceSchema } from "moleculer";
import fakePost from '../zfaker/methods/fakePost';
interface FakeLocalVars {
	myVar: string;
}

export type FakeThis = Service & FakeLocalVars;

const FakeService: ServiceSchema = {
	name: "fake",
	actions: {
    ...actions,
  },
  methods: {
    fakePost,
  }
};

export default FakeService;