import { CliError } from '../src';

test('CliError.toString should return message', () => {
  expect(
    new CliError({ message: 'supermessage', exitCode: 0 }).toString()
  ).toEqual('supermessage');
});
