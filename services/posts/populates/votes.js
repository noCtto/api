module.exports = {
  action: 'votes.get',
  params: {
    fields: ['_id', 'count', 'total', 'voted'],
    populate: ['count', 'voted'],
  },
};
