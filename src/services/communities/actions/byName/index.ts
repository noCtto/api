
import params from './params'
import handler from './handler'


export default {
  rest: 'GET /:community',
  populate: { type: 'string', optional: true },
  fields: { type: 'string', optional: true },  
  params,
  handler
}