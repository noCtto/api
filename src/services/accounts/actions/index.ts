import changePassword from './resetPassword';
import login from './login';
import logout from './logout';
import register from './register';
import updateToken from './updateToken';
import resolveToken from './resolveToken';
import forceLogout from './forceLogout';
import resetPassword from './resetPassword';
import health from '../../../utils/health';
import whoami from './whoami';
import random from './random';

export default {
  changePassword,
  login,
  random,
  logout,
  register,
  updateToken,
  resolveToken,
  forceLogout,
  resetPassword,
  health,
  whoami,
};