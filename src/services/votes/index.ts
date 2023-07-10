import actions from '@votes/actions';
import methods from '@votes/methods';
import hooks from '@votes/hooks';
import populates from '@votes/populates';

import {
  Validator as validator,
  Fields as fields,
} from '@votes/entities/votes.entity';

export default {
  database: 'nocheto',
  collection: 'votes',
  fields,
  validator,
  actions,
  methods,
  hooks,
  populates,
};
