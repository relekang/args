#!/usr/bin/env ts-node
import { args, CliError } from '../src';

args({
  name: 'supercli',
  commands: {
    test: {
      name: 'test',
      help: 'Testing testing',
      manual:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse felis ligula, vulputate tincidunt consectetur sed, euismod sit amet dolor. Cras commodo eu mi sed consectetur. Quisque eget mauris felis. Sed accumsan quis dui quis consequat. Proin a magna mauris. Aenean sit amet mauris sem. Nam tellus eros, malesuada vel diam eget, consectetur sodales nisl. Quisque non libero auctor, tempor nisl eu, rutrum ante. Suspendisse eget lacus ex. ',
      run: options => {
        // eslint-disable-next-line no-console
        console.log('Running the command ', JSON.stringify(options));
      },
      positionalOptions: [
        { name: 'first', help: 'Some superduper argument.', required: true },
        {
          name: 'second',
          help: 'Not super in any way, still an argument tho.',
          required: false,
        },
      ],
      namedOptions: [{ name: 'test' }],
    },
    'long-named-command': {
      name: 'long-named-command',
      help: 'Command with long name',
      run: options => {
        // eslint-disable-next-line no-console
        console.log('Running the command ', JSON.stringify(options));
      },
    },
    error: {
      name: 'error',
      help: 'Example error handling',
      run: _options => {
        throw new CliError({ message: '¯\\_(ツ)_/¯', exitCode: 1 });
      },
    },
  },
})(process.argv);
