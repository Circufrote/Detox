const _ = require('lodash');
const DetoxRuntimeError = require('../errors/DetoxRuntimeError');

function hintConfigurations(configurations) {
  return _.keys(configurations).map(c => `* ${c}`).join('\n')
}

function selectConfiguration({ detoxConfig, cliConfig, selectedConfiguration }) {
  const { configurations } = detoxConfig;

  if (_.isEmpty(configurations)) {
    throw new DetoxRuntimeError({
      message: `There are no device configurations in the given Detox config:`,
      debugInfo: util.inspect(detoxConfig, false, 1, false),
    });
  }

  let configurationName = selectedConfiguration || cliConfig.configuration || detoxConfig.selectedConfiguration;
  if (!configurationName && _.size(configurations) === 1) {
    configurationName = _.keys(configurations)[0];
  }

  if (!configurationName) {
    throw new DetoxRuntimeError({
      message: 'Cannot determine which configuration to use.',
      hint: 'Use --configuration to choose one of the following:\n' + hintConfigurations(configurations),
    });
  }

  return configurationName;
}

module.exports = selectConfiguration;