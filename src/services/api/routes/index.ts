import api from './api';
import status from './status';
import oauth from './oauth';
import accounts from './accounts';

export default [
  ...api,
  ...status,
  ...oauth,
  ...accounts,
] as any;