import api from './api';
import status from './status';
import oauth from './oauth';
import users from './users';

export default [...api, ...status, ...oauth, ...users] as any;
