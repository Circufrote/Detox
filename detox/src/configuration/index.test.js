const _ = require('lodash');
const path = require('path');

jest.mock('./argparse');

describe('configuration', () => {
  let args;
  let configuration;
  let detoxConfig;
  let deviceConfig;
  let userParams;

  beforeEach(() => {
    args = {};
    detoxConfig = {};
    deviceConfig = {};
    userParams = undefined;

    require('../utils/argparse').getArgValue.mockImplementation(key => args[key]);
    configuration = require('./index');
  });

  describe('composeDetoxConfig', () => {
    it('should throw if no config given', async () => {
      await expect(configuration.composeDetoxConfig({})).rejects.toThrowError(
        /Cannot start Detox without a configuration/
      );
    });

    it('should implicitly use package.json config if it has "detox" section', async () => {
      const config = await configuration.composeDetoxConfig({
        cwd: path.join(__dirname, '__mocks__/configuration/priority'),
      });

      expect(config).toMatchObject({
        deviceConfig: expect.objectContaining({
          device: 'Hello from package.json',
        }),
      });
    });

    it('should implicitly use .detoxrc if package.json has no "detox" section', async () => {
      const config = await configuration.composeDetoxConfig({
        cwd: path.join(__dirname, '__mocks__/configuration/detoxrc')
      });

      expect(config).toMatchObject({
        deviceConfig: expect.objectContaining({
          device: 'Hello from .detoxrc',
        }),
      });
    });

    it('should explicitly use the specified config (via env-cli args)', async () => {
      args['config-path'] = path.join(__dirname, '__mocks__/configuration/priority/detox-config.json');
      const config = await configuration.composeDetoxConfig({});

      expect(config).toMatchObject({
        deviceConfig: expect.objectContaining({
          device: 'Hello from detox-config.json',
        }),
      });
    });

    it('should throw if explicitly given config is not found', async () => {
      args['config-path'] = path.join(__dirname, '__mocks__/configuration/non-existent.json');

      await expect(configuration.composeDetoxConfig({})).rejects.toThrowError(
        /ENOENT: no such file.*non-existent.json/
      );
    });

    it('should return a complete Detox config merged with the file configuration', async () => {
      const config = await configuration.composeDetoxConfig({
        cwd: path.join(__dirname, '__mocks__/configuration/detoxrc'),
        selectedConfiguration: 'another',
        override: {
          configurations: {
            another: {
              type: 'ios.simulator',
              device: 'iPhone X',
            },
          },
        }
      });

      expect(config).toMatchObject({
        artifactsConfig: expect.objectContaining({}),
        behaviorConfig: expect.objectContaining({}),
        deviceConfig: expect.objectContaining({
          type: 'ios.simulator',
          device: 'iPhone X',
        }),
        sessionConfig: expect.objectContaining({
          server: 'ws://localhost:9999',
          sessionId: 'external file works',
        }),
      });
    });
  });
});
