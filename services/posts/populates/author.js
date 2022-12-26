module.exports = {
  action: 'users.get',
  params: {
    fields: ['_id', 'name', 'imageUrl', 'username', 'image'],
    populate: ['gravatar'],
  },
};
