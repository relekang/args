import { setup } from "../src/setup";

const defaultConfig = { name: 'cli', commands: {} };

test('setup should not do anything when needsSetup is not present', () => {
  setup(defaultConfig);
});

test('setup should not call setup when needsSetup resolves false', async () => {
  const config = {
    ...defaultConfig,
    needsSetup: async () => false,
    setup: jest.fn(),
  };

  await setup(config);

  expect(config.setup).not.toHaveBeenCalled();
});

test('setup should call setup when needsSetup resolves true', async () => {
  const config = {
    ...defaultConfig,
    needsSetup: async () => true,
    setup: jest.fn(),
  };

  await setup(config);

  expect(config.setup).toHaveBeenCalled();
});

test('setup should throw when needs setup and setup is missing', async () => {
  const config = {
    ...defaultConfig,
    needsSetup: async () => true,
  };

  await expect(setup(config)).rejects.toThrowErrorMatchingSnapshot();
});
