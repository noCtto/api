import actions from '@boards/actions';
import methods from '@boards/methods';
import hooks from '@boards/hooks';
import populates from '@boards/populates';

import {
  Validator as validator,
  Fields as fields,
} from '@boards/entities/board';

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
