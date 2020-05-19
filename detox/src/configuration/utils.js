const _ = require('lodash');
const DetoxConfigError = require('../errors/DetoxConfigError');

function hintConfigurations(configurations) {
  return Object.keys(configurations).map(c => `* ${c}`).join('\n')
}

function throwOnEmptyBinaryPath() {
  throw new DetoxConfigError(`'binaryPath' property is missing, should hold the app binary path`);
}

module.exports = {
  negateDefined,
  hintConfigurations,
  throwOnEmptyBinaryPath,
  throwOnEmptyDevice,
  throwOnEmptyType,
};
