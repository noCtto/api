import actions from '@accounts/actions';
import methods from '@accounts/methods';
import hooks from '@accounts/hooks';
import populates from '@accounts/populates';

import {
  Validator as validator,
  Fields as fields,
} from '@accounts/entities/user.entity';

import MicroService from '@lib/microservice';

const AccountsService = MicroService(
  'accounts',
  {
    database: 'account',
    collection: 'users',
    fields: fields,
    validator,
    actions,
    methods,
    hooks,
    populates,
  }
);
export default AccountsService;