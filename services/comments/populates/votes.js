module.exports = {
  action: 'votes.get',
  params: {
    fields: ['_id', 'votes', 'voted', 'count', 'total', 'd'],
    populate: ['voted', 'votes', 'count', 'total'],
  },
};
