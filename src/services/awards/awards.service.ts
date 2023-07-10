import MicroService from '@lib/microservice';
// new change made
const AwardsService = MicroService('awards', {
  database: 'awards',
  collection: 'awards',
  fields: [
    '_id',
    'name',
    'description',
    'image',
    'company',
    'createdAt',
    'updatedAt',
  ],
  validator: {},
  actions: {},
  methods: {},
  hooks: {},
  populates: {},
});
export default AwardsService;
