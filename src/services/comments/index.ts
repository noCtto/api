import actions from '@comments/actions';
import methods from '@comments/methods';
import hooks from '@comments/hooks';
import populates from '@comments/populates';

import {
  Validator as validator,
  Fields as fields,
} from '@comments/entities/comment.entity';

export default {
  database: 'nocheto',
  collection: 'comments',
  fields,
  validator,
  actions,
  methods,
  hooks,
  populates,
};