export default function populate(ctx: any, options:any={}) {
  if (!ctx) {
    return null
  }

  if (!ctx.params) {
    return ctx
  }
  
  if (ctx.params.populate) {
    
    let populate = ctx.params.populate
    if (typeof ctx.params.populate === 'string') {
      populate = [...ctx.params.populate.split(',')]
    }

    if (!options) {
      ctx.params = {
        ...ctx.params,
        populate
      }
      return ctx
    }

    if (options.populate) {
      populate = [...options.populate, ...populate]
    }  
    ctx.params = {
      ...ctx.params,
      populate
    }
    return ctx
  }  
}
