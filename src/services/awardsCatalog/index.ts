import actions from './actions';
import {
  Validator as validator,
  Fields as fields,
} from './entities/award.entity';

export default {
  database: 'nocheto',
  collection: 'awardsCatalog',
  fields,
  validator,
  actions,
  hooks: {},
  populate: {}
};
