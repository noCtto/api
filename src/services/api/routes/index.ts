import api from './api';
import status from './status';
import oauth from './oauth';
import users from './users';
import front from './front';

export default [...api, ...status, ...oauth, ...users, ...front ] as any;
