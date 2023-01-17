/* eslint-disable no-param-reassign */
module.exports = function transformEntity2(user, token) {
  if (user) {
    delete user.password;
    delete user.createdAt;
    delete user.active;
    user.token = token;
  }
  return user;
};
