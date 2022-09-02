/* eslint-disable global-require */
const { getUniqId } = require('./utils/func');

let nodeID = null;
if (require('fs').existsSync('./package.json')) nodeID = require('./package.json').name;

module.exports = {
  namespace: process.env.NAMESPACE || 'microservices',
  nodeID: `${process.env.SERVICE_NAME || nodeID}-${getUniqId()}`,
  logger: true,
  logLevel: 'info',
  logFormatter: 'short',
  cacherx: {
    type: 'memory',
    options: {
      maxParamsLength: 100,
    },
  },
  cacher: false,
  transporter: {
    type: 'NATS',
    options: {
      url: process.env.TRANSPORTER,
      maxPacketSize: 60 * 1024 * 1024,
      maxConnections: process.env.MAX_CONNECTIONS || 40,
    },
  },
  serializer: false,
  requestTimeout: 60 * 1000,
  requestRetry: 0,
  maxCallLevel: 0,
  heartbeatInterval: 5,
  heartbeatTimeout: 15,
  disableBalancer: false,
  registry: {
    strategy: 'RoundRobin',
    preferLocal: true,
  },
  circuitBreaker: {
    enabled: false,
    maxFailures: 3,
    halfOpenTime: 10 * 1000,
    failureOnTimeout: true,
    failureOnReject: true,
  },
  hotreload: true,
  validation: true,
  validator: true,
  metricsRate: 1,
  statistics: false,
  internalActions: true,
  metrics: true,
  tracing: {
    enabled: false,
    exporter: {
      type: 'Console',
      options: {
        logger: null,
        colors: true,
        width: 100,
        gaugeWidth: 40,
      },
    },
  },
};
