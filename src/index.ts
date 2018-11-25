/* eslint-disable global-require */
import mri from 'mri';
import path from 'path';
import chalk from 'chalk';

import { help } from './help';
import * as logger from './logger';
import { CliError } from './errors';
import { parse } from './parse';
import { setup } from './setup';
import { CommandConfig, Config, Options } from './types';

export * from './errors';

function requireCommand(p: string) {
  try {
    return require(p);
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      throw error;
    }
  }
}

async function __args(config: Config, subCommand: string, args: Array<string>) {
  await setup(config);
  if (subCommand === 'help') {
    return help(config, mri(args));
  }

  let command: CommandConfig;
  // @ts-ignore
  if (config.commands) {
    // @ts-ignore
    command = config.commands[subCommand];
  } else {
    // @ts-ignore
    command = requireCommand(path.join(config.commandsPath, subCommand));
  }

  if (
    !command &&
    config.commandPackagePrefixes &&
    config.commandPackagePrefixes.length > 0
  ) {
    const prefix = config.commandPackagePrefixes.find(item =>
      requireCommand(item + subCommand)
    );
    command = requireCommand(prefix + subCommand);
  }

  if (command) {
    const options: Options = parse(command, args);
    await command.run(options);
  } else {
    throw new CliError({
      message: 'Unknown command',
      exitCode: 1,
      showHelp: true,
    });
  }
}

export function args(config: Config) {
  return ([_node, _program, subCommand, ...rest]: Array<string>) => {
    return __args(config, subCommand || config.defaultCommand || 'help', rest)
      .catch(async error => {
        if (
          error.constructor === CliError ||
          error.constructor.constructor === CliError
        ) {
          if (error.showHelp) {
            logger.error('\n');
            logger.error(chalk.bold(chalk.red(error.toString())));
            logger.error('\n\n');
            await help(config, mri(rest));
          } else {
            logger.error(error.toString());
          }
          if (process.env.NODE_ENV !== 'test') {
            process.exit(error.exitCode);
          }
        } else {
          logger.error(error);
        }
        if (process.env.NODE_ENV !== 'test') {
          process.exit(1);
        }
      })
      .catch(error => {
        logger.error(error.toString());
      });
  };
}

export default args;
