export type Params = {
  username?: string,
  _id?: string,
}

export default {
  username: {
    type: 'string',
    optional: true
  },
  _id: {
    type: 'string',
    optional: true,
  }
}
