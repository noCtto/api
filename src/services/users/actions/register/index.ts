import params from './params';
import handler from './handler';

export default {
  rest: 'POST /register',
  cache: false,
  authorization: false,
  params,
  handler,
};
