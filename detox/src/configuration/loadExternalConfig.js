const { cosmiconfig } = require('cosmiconfig');

async function loadExternalConfig(detoxConfigPath, cwd) {
  const explorer = cosmiconfig('detox')

  return detoxConfigPath
    ? await explorer.load(detoxConfigPath)
    : await explorer.search(cwd);
}

module.exports = loadExternalConfig;
