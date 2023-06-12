import actions from '~/src/services/comments/actions';
import methods from '~/src/services/comments/methods';
import hooks from '~/src/services/comments/hooks';
import populates from '~/src/services/comments/populates';

import {
  Validator as validator,
  Fields as fields,
} from '~/src/services/comments/entities/comment.entity';

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