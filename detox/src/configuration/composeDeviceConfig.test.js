describe('composeDeviceConfig', () => {
  let composeDeviceConfig;
  let configs;
  let cliConfig;

  beforeEach(() => {
    composeDeviceConfig = require('./composeDeviceConfig');

    cliConfig = {};
    configs = [1, 2].map(i => ({
      type: `someDriver${i}`,
      device: `someDevice${i}`,
    }));
  });

  describe('validation', () => {
    it('should throw if no configurations are passed', () => {
      expect(() => composeDeviceConfig({
        configurations: {},
      }, cliConfig)).toThrowError(/There are no device configurations/);
    });

    it('should throw if configuration driver (type) is not defined', () => {
      expect(() => composeDeviceConfig({
        configurations: {
          undefinedDriver: {
            device: { type: 'iPhone X' },
          },
        },
      }, cliConfig)).toThrowError(/type.*missing.*ios.simulator.*android.emulator/);
    });

    it('should throw if device query is not defined', () => {
      expect(() => composeDeviceConfig({
        configurations: {
          undefinedDeviceQuery: {
            type: 'ios.simulator',
          },
        },
      }, cliConfig)).toThrowError(/device.*empty.*device.*query.*type.*avdName/);
    });
  });

  describe('for no specified configuration name', () => {
    beforeEach(() => { delete cliConfig.configuration; });

    describe('when there is a single config', () => {
      it('should return it', () => {
        const singleDeviceConfig = configs[0];

        expect(composeDeviceConfig({
          configurations: {singleDeviceConfig }
        }, cliConfig)).toBe(singleDeviceConfig);
      });
    });

    describe('when there is more than one config', () => {
      it('should throw if there is more than one config', () => {
        const [config1, config2] = configs;
        expect(() => composeDeviceConfig({
          configurations: { config1, config2 },
        }, cliConfig)).toThrowError(/Cannot determine/);
      });

      describe('but also selectedConfiguration param is specified', () => {
        it('should select that configuration', () => {
          const [config1, config2] = configs;

          expect(composeDeviceConfig({
            selectedConfiguration: 'config1',
            configurations: { config1, config2 },
          }, cliConfig)).toEqual(config1);
        });
      });
    });
  });

  describe('for a specified configuration name', () => {
    let sampleConfigs;

    beforeEach(() => {
      cliConfig.configuration = 'config2';

      const [config1, config2] = [1, 2].map(i => ({
        type: `someDriver${i}`,
        device: `someDevice${i}`,
      }));

      sampleConfigs = { config1, config2 };
    });

    it('should return that config', () => {
      expect(composeDeviceConfig({
        configurations: sampleConfigs
      }, cliConfig)).toEqual(sampleConfigs.config2);
    });

    describe('if device-name override is present', () => {
      beforeEach(() => { cliConfig.deviceName = 'Override'; });

      it('should return that config with an overriden device query', () => {
        expect(composeDeviceConfig({
          configurations: sampleConfigs
        }, cliConfig)).toEqual({
          ...sampleConfigs.config2,
          device: 'Override',
        });
      });
    })
  });
});

