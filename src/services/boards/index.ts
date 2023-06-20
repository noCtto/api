import actions from '~/src/services/boards/actions';
import methods from '~/src/services/boards/methods';
import hooks from '~/src/services/boards/hooks';
import populates from '~/src/services/boards/populates';

import {
  Validator as validator,
  Fields as fields,
} from '~/src/services/boards/entities/board';

export default {
  database: 'nocheto',
  collection: 'boards',
  fields,
  validator,
  actions,
  methods,
  hooks,
  populates,
};