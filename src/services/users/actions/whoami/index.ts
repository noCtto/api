import handler from './handler';

export default {
  rest: 'POST /whoami',
  cache: false,
  handler,
};