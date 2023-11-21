/* eslint-disable global-require */
import { BrokerOptions } from 'moleculer';

const brokerConfig: BrokerOptions = {
  namespace: process.env.NAMESPACE || 'microservices',
  logger: true,
  logLevel: 'info',
  cacher: false,
  transporter: 'TCP',
  requestTimeout: 60 * 1000,
  maxCallLevel: 0,
  heartbeatInterval: 5,
  heartbeatTimeout: 15,
  disableBalancer: false,
  validator: true,
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

export default brokerConfig;
