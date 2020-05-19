const { throwOnEmptyBinaryPath } = require('./utils');

describe('throwOnEmptyBinaryPath', () => {
  it('should throw an error', () =>
    expect(throwOnEmptyBinaryPath).toThrowError(/binaryPath.*missing/))
})
