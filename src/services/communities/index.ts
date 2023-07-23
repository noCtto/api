import actions from '~/src/services/communities/actions';
import methods from '~/src/services/communities/methods';
import hooks from '~/src/services/communities/hooks';
import populates from '~/src/services/communities/populates';

import {
  Validator as validator,
  Fields as fields,
} from '~/src/services/communities/entities/community';

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
