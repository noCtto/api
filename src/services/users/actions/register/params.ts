export interface Params {
  username: string;
  email: string;
  password: string;
}

export default {
  username: 'string|min:4',
  email: 'email',
  password: 'string|min:8',
};
