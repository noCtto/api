import actions from '@voters/actions';
import hooks from '@voters/hooks';
import methods from '@voters/methods';

import {
  Validator as validator,
  Fields as fields,
} from '@voters/entities/voters.entity';

export default {
  database: 'nocheto',
  collection: 'voters',
  fields,
  validator,
  actions,
  hooks,
  methods
};
