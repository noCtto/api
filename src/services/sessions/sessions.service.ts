
import MicroService from '../../lib/microservice';

import {
  Validator as entityValidator,
  Fields as fields,
} from './entities/session.entity';

import actions from './actions';
import methods from './methods';
import hooks from './hooks';
import populates from './populates';

export default MicroService('sessions', {
  fields,
  actions,
  methods,
  hooks,
  populates,
  entityValidator,
});
