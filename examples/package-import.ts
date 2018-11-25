#!/usr/bin/env ts-node
/* eslint-disable no-console */
import args from '../src';

// @ts-ignore
args({
  name: 'supercli',
  defaultCommand: 'test',
  packageInfo: require('../package.json'),
  commands: {
    one: {
      name: 'one',
      help: 'Command loaded from command object in config',
      run: () => {
        console.log('one');
      },
    },
  },
  commandPackagePrefixes: ['none-existing-prefix', '@args-tester/'],
})(process.argv);
