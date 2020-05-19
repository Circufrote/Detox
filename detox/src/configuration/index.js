const _ = require('lodash');
const DetoxRuntimeError = require('../errors/DetoxRuntimeError');

const configUtils = require('./utils');

async function composeDetoxConfig({
  cwd = process.cwd(),
  argv,
  selectedConfiguration,
  override,
  userParams,
}) {
  const cliConfig = collectCliConfig(argv);
  const cosmiResult = await loadDetoxConfig(cliConfig.configPath, cwd);
  const externalConfig = cosmiResult && cosmiResult.config;
  const detoxConfig = _.merge(
    externalConfig,
    override,
  );

  if (_.isEmpty(detoxConfig)) {
    throw new DetoxRuntimeError({
      message: 'Cannot start Detox without a configuration',
      hint: 'Make sure your package.json has "detox" section, or there\'s .detoxrc file in the working directory',
    });
  }

  if (argv.configuration) {
    detoxConfig.selectedConfiguration = argv.configuration;
  }

  if (selectedConfiguration) {
    detoxConfig.selectedConfiguration = selectedConfiguration;
  }

  const deviceConfig = composeDeviceConfig(detoxConfig);
  const configurationName = _.findKey(detoxConfig.configurations, (config) => {
    return config === deviceConfig;
  });

  const artifactsConfig = composeArtifactsConfig({
    configurationName,
    detoxConfig,
    deviceConfig,
  });

  const behaviorConfig = composeBehaviorConfig({
    detoxConfig,
    deviceConfig,
    userParams,
  });

  const sessionConfig = await composeSessionConfig({
    detoxConfig,
    deviceConfig,
  });

  return {
    meta: {
      configuration: configurationName,
      location: externalConfig.filepath,
    },

    artifactsConfig,
    behaviorConfig,
    deviceConfig,
    sessionConfig,
  };
}

module.exports = {
  throwOnEmptyBinaryPath: configUtils.throwOnEmptyBinaryPath,
  composeDetoxConfig,
};
