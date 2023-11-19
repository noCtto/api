import api from './api';
import status from './status';
import oauth from './oauth';
import users from './users';
import front from './front';
import fake from './fake';

export default [...api, ...status, ...oauth, ...users, ...front, ...fake ] as any;
