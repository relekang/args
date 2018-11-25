import path from 'path';
import { findSubCommand } from '../src/subCommand';

const configDefaults = { name: 'testcli' };

test('findSubCommand(config, name) should find inline command', () => {
  const command = findSubCommand(
    { ...configDefaults, commands: { test: { name: 'test' } } },
    'test'
  );

  expect(command).toEqual({ name: 'test' });
});

test('findSubCommand(config, name) should find path based command', () => {
  const commandsPath = path.resolve(__dirname, '..', 'examples', 'commands');
  const command = findSubCommand({ ...configDefaults, commandsPath }, 'test');

  expect(command.name).toEqual('test');
  expect(command.help).toEqual('Testing testing');
});

test('findSubCommand(config, name) should find package based command', () => {
  const command = findSubCommand(
    {
      ...configDefaults,
      commands: {},
      commandPackagePrefixes: ['@args-tester/'],
    },
    'test'
  );

  expect(command.name).toEqual('test');
  expect(command.help).toEqual(
    'Command imported from subpackage based on prefix'
  );
});
