export default {
  before: {
    list(this: any, ctx: any) {
      console.log('list', ctx.params);
      ctx.params.populate = ['posts'];
    },
  },
  after: {
    list(this: any, ctx: any, result: any) {
      console.log('after list', ctx.params);
      return result;
    },
  },
};
