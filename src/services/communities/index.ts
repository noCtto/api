import actions from '@communities/actions';
import methods from '@communities/methods';
import hooks from '@communities/hooks';
import populates from '@communities/populates';

import {
  Validator as validator,
  Fields as fields,
} from '@communities/entities/community';

export default {
  database: 'nocheto',
  collection: 'communities',
  fields,
  validator,
  actions,
  methods,
  hooks,
  populates,
};
