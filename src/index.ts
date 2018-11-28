/* eslint-disable global-require */
import mri from 'mri';
import chalk from 'chalk';

import { help } from './help';
import * as logger from './logger';
import { CliError } from './errors';
import { parse } from './parse';
import { setup } from './setup';
import { Config, Options, SingleCommandConfig } from './types';
import { findSubCommand } from './subCommand';

export * from './errors';

function createErrorHandler(
  config: Config | SingleCommandConfig,
  argv: string[]
) {
  return async (error: CliError | Error) => {
    if (error instanceof CliError) {
      if (error.showHelp) {
        logger.error('\n');
        logger.error(chalk.bold(chalk.red(error.toString())));
        logger.error('\n\n');
        await help(config, mri(argv));
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
  };
}

async function multiRunner(config: Config, argv: string[]) {
  let [subCommand, ...rest] = argv;
  subCommand = subCommand || config.defaultCommand || 'help';
  await setup(config);
  if (subCommand === 'help') {
    return help(config, mri(argv));
  }

  const command = findSubCommand(config, subCommand);

  if (command) {
    const options: Options = parse(command, rest);
    await command.run(options);
  } else {
    throw new CliError({
      message: 'Unknown command',
      exitCode: 1,
      showHelp: true,
    });
  }
}

async function singleRunner(config: SingleCommandConfig, argv: string[]) {
  if (argv[0] === 'help') {
    return help(config, mri(argv));
  }
  const options: Options = parse(config, argv);
  await config.run(options);
}

export function args(config: Config | SingleCommandConfig) {
  // @ts-ignore
  const single = !!config.single;
  return async ([_node, _program, ...rest]: Array<string>) => {
    if (single) {
      await singleRunner(config as SingleCommandConfig, rest)
        .catch(createErrorHandler(config, rest))
        .catch((error: Error) => {
          logger.error(error.toString());
        });
    } else {
      await multiRunner(config as Config, rest)
        .catch(createErrorHandler(config, rest))
        .catch((error: Error) => {
          logger.error(error.toString());
        });
    }
  };
}

export default args;
