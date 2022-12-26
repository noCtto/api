module.exports = {
  action: 'threads.get',
  params: {
    fields: ['_id', 'comments'],
    populate: ['comments'],
  },
};
