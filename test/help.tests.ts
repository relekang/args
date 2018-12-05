import {
  createPositionalUsage,
  createUsageString,
  createCommandsList,
} from '../src/help';
import { Config } from '../src/types';

test('createPositionalUsage should create string of positionals options', () => {
  const command = {
    name: 'command',
    help: 'Test command',
    run: () => {},
    positionalOptions: [
      { name: 'first', required: true },
      { name: 'second', required: false },
    ],
  };

  expect(createPositionalUsage(command)).toEqual('<first> [<second>]');
});

test('createPositionalUsage should create empty string if no optionals', () => {
  const command = {
    name: 'command',
    help: 'Test command',
    run: () => {},
    positionalOptions: [],
  };

  expect(createPositionalUsage(command)).toEqual('');
});

test('createUsageString should create usage string', () => {
  const command = {
    name: 'command',
    help: 'Test command',
    run: () => {},
    positionalOptions: [
      { name: 'first', required: true },
      { name: 'second', required: false },
    ],
    namedOptions: [{ name: 'test' }],
  };

  expect(createUsageString('./cli.js', command)).toEqual(
    'Usage: ./cli.js command <first> [<second>] [--options]'
  );
});

test('createUsageString should create usage string without positionals', () => {
  const command = {
    name: 'command',
    help: 'Test command',
    run: () => {},
    namedOptions: [{ name: 'test' }],
  };

  expect(createUsageString('./cli.js', command)).toEqual(
    'Usage: ./cli.js command [--options]'
  );
});

test('createUsageString should create usage string without optionals', () => {
  const command = {
    name: 'command',
    help: 'Test command',
    run: () => {},
  };

  expect(createUsageString('./cli.js', command)).toEqual(
    'Usage: ./cli.js command'
  );
});

test('createUsageString should create usage string', () => {
  const command = {
    name: 'command',
    help: 'Test command',
    run: () => {},
    positionalOptions: [
      { name: 'first', required: true },
      { name: 'second', required: false },
    ],
    namedOptions: [{ name: 'test' }],
  };

  expect(createUsageString(undefined, command)).toEqual(
    'Usage: command <first> [<second>] [--options]'
  );
});

test('createCommandsList should creat list of commands with and without help', async () => {
  // @ts-ignore
  const config: Config = {
    name: 'supercli',
    commands: {
      test: { name: 'test' },
      test2: { name: 'test2', help: 'Testing testing' },
    },
  };
  expect(await createCommandsList(config)).toEqual(
    'test  \ntest2  - Testing testing'
  );
});
