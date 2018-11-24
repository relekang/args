import args from '../src';
import * as logger from '../src/logger';
import { Config } from '../src/types';

jest.mock('../src/logger', () => ({ error: jest.fn(), log: jest.fn() }));

const config: Config = {
  name: 'supercli',
  commands: {
    test: {
      name: 'test',
      help: 'Testing testing',
      manual:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse felis ligula, vulputate tincidunt consectetur sed, euismod sit amet dolor. Cras commodo eu mi sed consectetur. Quisque eget mauris felis. Sed accumsan quis dui quis consequat. Proin a magna mauris. Aenean sit amet mauris sem. Nam tellus eros, malesuada vel diam eget, consectetur sodales nisl. Quisque non libero auctor, tempor nisl eu, rutrum ante. Suspendisse eget lacus ex. ',
      run: jest.fn(),
      positionalOptions: [
        { name: 'first', required: true },
        { name: 'second', required: false, transform: Number },
      ],
      namedOptions: [{ name: 'verbose', required: false }],
    },
    'long-named-command': {
      name: 'long-named-command',
      help: 'Command with long name',
      run: () => {},
    },
  },
};

beforeEach(() => {
  // @ts-ignore
  logger.error.mockReset();
  // @ts-ignore
  logger.log.mockReset();
});

test('args should parse the positional options', async () => {
  await args(config)(['node', 'cli', 'test', 'first-argument', '200']);

  expect(config.commands.test.run).toBeCalledWith({
    _: ['first-argument', '200'],
    first: 'first-argument',
    second: 200,
  });
});

test('args should parse the named option', async () => {
  await args(config)(['node', 'cli', 'test', 'first-argument', '--verbose']);

  expect(config.commands.test.run).toBeCalledWith({
    _: ['first-argument'],
    verbose: true,
    first: 'first-argument',
  });
});

test('args should show help screen', async () => {
  await args(config)(['node', 'cli', 'help']);

  // @ts-ignore flow does not understand mocks
  expect(logger.error.mock.calls.join('\n')).toMatchSnapshot();
});

test('args should show help screen for specific command', async () => {
  await args(config)(['node', 'cli', 'help', 'test']);

  // @ts-ignore flow does not understand mocks
  expect(logger.error.mock.calls.join('\n')).toMatchSnapshot();
});
