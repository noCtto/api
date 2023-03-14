import type { ServiceSchema } from 'moleculer';
import type { DbServiceSettings } from 'moleculer-db';

import actions from './actions';

interface ModuleSettings extends DbServiceSettings {
	indexes?: Record<string, number>[];
}

const ModulesService: ServiceSchema<ModuleSettings> = {
  name: 'faker',
  _settings: {
    indexes: [{ name: 1 }],
  },
  get settings() {
    return this._settings;
  },
  set settings(value) {
    this._settings = value;
  },
  hooks: {
    before: {},
  },
  actions,
  methods: {},
  async afterConnected() {},
};

export default ModulesService;
