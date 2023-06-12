import params from './params';
import handler from './handler';

export default {
  rest: 'POST /login',
  cache: false,
  authorization: false,
  params,
  handler,
};
