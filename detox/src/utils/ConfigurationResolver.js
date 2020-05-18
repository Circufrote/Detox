const fs = require('fs');
const path = require('path');

const lookupOrder = [
  '.detoxrc',
  '.detoxrc.js',
  '.detoxrc.json',
  'package.json',
];

const packageJson = 'package.json';
const detoxRc = '.detoxrc';

class ConfigurationResolver {
  constructor(cwd = process.cwd()) {
    this.cwd = cwd;
  }

  getDetoxConfiguration(configPath) {
    configPath = configPath || findUp.sync(lookupOrder);
    if (!configPath) {
      return null;
    }

    const config = path.extname(configPath) === '.js'
      ? this.requireJS(configPath)
      : this.requireJSON(configPath);

    if (configPath) {
      return this.loadConfiguration(configPath);
    }

    const { detox } = this.loadConfiguration(packageJson);
    if (detox) {
      return detox;
    }
    return this.loadDetoxrcConfiguration()
  }

  requireJS(configPath) {

  }

  requireJSON(configPath) {

  }

  loadDetoxrcConfiguration() {
    var data = fs.readFileSync(this.resolvePath(detoxRc)).toString();
    return JSON.parse(data);  
  }

  resolvePath(suffix) {
    return path.resolve(this.cwd, suffix);
  }

  loadConfiguration(configPath) {
    return require(this.resolvePath(configPath));
  }
}

ConfigurationResolver.default = new ConfigurationResolver();

module.exports = ConfigurationResolver;
