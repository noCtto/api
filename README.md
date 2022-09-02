# api-gateway

API Gateway - microservices with moleculerjs 💪

## Configuration file example

```json
{
  "env": "development",
  "development": {
    "port": 3000,
    "connections": {
      "mongodb": {
        "host": "localhost",
        "database": "micro-service",
        "user": null,
        "password": null,
        "port": 27017
      },
      "mysql": {
        "host": "127.0.0.1",
        "port": 3306,
        "user": "root",
        "password": "",
        "database": "wms"
      },
      "hts": {
        "uri": "https://hts.gsmartcode.com/api/service",
        "apiKey": "D8B8F1EB457140789A2392C09B6576CC"
      }
    }
  }
}
```

## Installation

This is a [Node.js](https://nodejs.org/) module available through the
[npm registry](https://www.npmjs.com/). It can be installed using the
[`npm`](https://docs.npmjs.com/getting-started/installing-npm-packages-locally)
or
[`yarn`](https://yarnpkg.com/en/)
command line tools.

```sh
npm install micro-service --save
```

## Dependencies

- [compression](https://ghub.io/compression): Node.js compression middleware
- [moleculer](https://ghub.io/moleculer): Fast &amp; powerful microservices framework for Node.JS
- [moleculer-db](https://ghub.io/moleculer-db): Moleculer service to store entities in database
- [moleculer-db-adapter-mongo](https://ghub.io/moleculer-db-adapter-mongo): MongoDB native adapter for Moleculer DB service.
- [moleculer-web](https://ghub.io/moleculer-web): Official API Gateway service for Moleculer framework
- [request](https://ghub.io/request): Simplified HTTP request client.
- [request-promise](https://ghub.io/request-promise): The simplified HTTP request client &#39;request&#39; with Promise support. Powered by Bluebird.

## Dev Dependencies

- [eslint](https://ghub.io/eslint): An AST-based pattern checker for JavaScript.
- [moleculer-repl](https://ghub.io/moleculer-repl): REPL module for Moleculer

## License

MIT
