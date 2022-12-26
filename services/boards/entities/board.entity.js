module.exports = {
  entity: {
    name: 'string',
    description: { type: 'string', optional: true },
    icon: { type: 'string', optional: true },
    logo: { type: 'string', optional: true },
    palette: {
      type: 'object',
      optional: true,
      props: {
        primary: {
          type: 'object',
          optional: true,
          props: {
            light: { type: 'string', optional: true },
            main: { type: 'string', optional: true },
            dark: { type: 'string', optional: true },
            contrastText: { type: 'string', optional: true },
          },
        },
        secondary: {
          type: 'object',
          optional: true,
          props: {
            light: { type: 'string', optional: true },
            main: { type: 'string', optional: true },
            dark: { type: 'string', optional: true },
            contrastText: { type: 'string', optional: true },
          },
        },
      },
    },
    configurations: {
      type: 'object',
      optional: true,
      props: {
        packingList: {
          type: 'object',
          optional: true,
          props: {
            path: {
              type: 'object',
              optional: true,
              props: {
                dtc: { type: 'string', optional: true },
                Wholesale: { type: 'string', optional: true },
              },
            },
          },
        },
      },
    },
    active: { type: 'boolean', default: true },
    creator: { type: 'object', optional: true },
  },
  fields: [
    '_id',
    'name',
    'description',
    'icon',
    'logo',
    'palette',
    'configurations',
    'active',
    'followers',
    'posts',
    'createdAt',
    'creator',
  ],
};
