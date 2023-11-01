export interface Params {
  username: string;
  email: string
}

export default {
  username: { type: 'string' },
  email:{
    type: "string",
    optional: true
  }
};