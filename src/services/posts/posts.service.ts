
import MicroService from '../../lib/microservice';

import {
  Validator as entityValidator,
  Fields as fields,
} from './entities/post.entity';

import actions from './actions';
import methods from './methods';
import hooks from './hooks';
import populates from './populates';

export default MicroService('posts', {
  fields,
  actions,
  methods,
  hooks,
  populates,
  entityValidator,
});
