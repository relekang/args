#!/usr/bin/env ts-node
import { resolve } from 'path';

import args from '../src';

args({
  name: 'supercli',
  defaultCommand: 'test',
  commandsPath: resolve(__dirname, 'commands'),
})(process.argv);
