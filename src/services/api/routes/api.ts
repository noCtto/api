
export default [
  {
    path: "/api",
    whitelist: ["**"],
    use: [],
    mergeParams: true,
    authentication: true,
    autoAliases: true,
    callingOptions: {},
    bodyParsers: {
      json: {
        strict: false,
        limit: "1MB",
      },
      urlencoded: {
        extended: true,
        limit: "1MB",
      },
    },
    mappingPolicy: "all",
    logging: true,
  }
]