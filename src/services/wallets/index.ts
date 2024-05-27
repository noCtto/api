import actions from './actions';
import hooks from './hooks';
import methods from './methods';

import {
  Validator as validator,
  Fields as fields,
} from './entities/wallet.entity';

export default {
  database: process.env.DB_NAME,
  collection: 'wallets',
  fields,
  validator,
  actions,
  hooks,
  methods
};
