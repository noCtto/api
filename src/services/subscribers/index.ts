import actions from '@subscribers/actions';
import hooks from '@subscribers/hooks';

import {
  Validator as validator,
  Fields as fields,
} from '@subscribers/entities/subscribers.entity';

export default {
  database: 'nocheto',
  collection: 'subscribers',
  fields,
  validator,
  actions,
  hooks,
};
