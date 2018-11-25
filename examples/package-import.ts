#!/usr/bin/env ts-node
/* eslint-disable no-console */
import args from '../src';

// @ts-ignore
args({
  name: 'supercli',
  defaultCommand: 'test',
  commands: {
    one: {
      name: 'one',
      run: () => {
        console.log('one');
      },
    },
  },
  commandPackagePrefixes: ['none-existing-prefix', '@args-tester/'],
})(process.argv);
