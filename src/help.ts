/* eslint-disable global-require */
import chalk from 'chalk';
import wrap from 'word-wrap';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

import {
  Config,
  CommandConfig,
  CommandOption,
  Options,
  SingleCommandConfig,
} from './types';

import * as logger from './logger';
import { findSubCommand } from './subCommand';

const readdir = promisify(fs.readdir);

function values<A>(o: { [key: string]: A }): Array<A> {
  return Object.values(o);
}

function findCommandDependencies(
  prefixes: string[],
  dependencies: { [key: string]: string } | undefined
) {
  if (!dependencies) {
    return {};
  }
  return Object.keys(dependencies)
    .filter(name => prefixes.find(prefix => name.indexOf(prefix) === 0))
    .reduce((lastValue, name) => {
      const command = require(name);
      return { ...lastValue, [command.name]: command };
    }, {});
}

async function getCommands(
  config: Config
): Promise<{ [key: string]: CommandConfig }> {
  let commands: { [key: string]: CommandConfig };
  // @ts-ignore
  if (config.commands) {
    // @ts-ignore
    commands = config.commands;
  } else {
    // @ts-ignore
    const commandsPath: string = config.commandsPath;
    commands = (await readdir(commandsPath))
      .filter(file => /\.[jt]s$/.test(file))
      .filter(file => !/\.d\.ts$/.test(file))
      .reduce(
        (lastValue, file) => ({
          ...lastValue,
          [file.replace(/.[jt]s$/, '')]: require(path.join(commandsPath, file)),
        }),
        {}
      );
  }
  if (
    config.commandPackagePrefixes &&
    config.commandPackagePrefixes.length > 0 &&
    config.packageInfo
  ) {
    commands = {
      ...commands,
      ...findCommandDependencies(
        config.commandPackagePrefixes,
        config.packageInfo.devDependencies
      ),
      ...findCommandDependencies(
        config.commandPackagePrefixes,
        config.packageInfo.dependencies
      ),
    };
  }
  return commands;
}

export async function createCommandsList(config: Config) {
  const commands = await getCommands(config);

  const length = Math.max(
    0,
    ...values(commands).map(({ name }) => name.length)
  );
  return values(commands)
    .map(command => {
      const spacing = new Array(Math.max(1, length - command.name.length + 1))
        .fill(' ')
        .join('');
      return `${command.name}${spacing}${
        command.help ? ` - ${command.help}` : ''
      }`;
    })
    .join('\n');
}

export function createPositionalUsage(command: CommandConfig) {
  return (command.positionalOptions || [])
    .map(({ name, required }) => (required ? `<${name}>` : `[<${name}>]`))
    .join(' ');
}

export function createUsageString(
  cliName: string | undefined,
  command: CommandConfig
) {
  const positionals = createPositionalUsage(command);
  return (
    `Usage: ${cliName ? cliName + ' ' : ''}${command.name}` +
    (positionals ? ` ${positionals}` : '') +
    (command.namedOptions ? ' [--options]' : '')
  );
}

export function createOptionHelpString(option: CommandOption) {
  return `  - ${option.name}${option.help ? ` - ${option.help}` : ''}`;
}

export function createSubCommandHelp(
  cliName: string | undefined,
  command: CommandConfig
) {
  let lines = [
    chalk`{bold ${command.name}}${command.help ? ` - ${command.help}` : ''} `,
    '\n',
    createUsageString(cliName, command),
    command.manual ? '\n' + wrap(command.manual, { width: 80 }) : '',
  ];
  if (command.positionalOptions) {
    lines = [...lines, '', chalk.bold('Arguments:')];
    lines = [
      ...lines,
      ...(command.positionalOptions || []).map(createOptionHelpString),
    ];
  }
  if (command.namedOptions) {
    lines = [...lines, '', chalk.bold('Options:')];
    lines = [
      ...lines,
      ...(command.namedOptions || []).map(createOptionHelpString),
    ];
  }
  return lines.join('\n');
}

const dashes = '--------------------------';
export async function multiCommandHelp(config: Config, options: Options) {
  let subCommand;
  if (options._.length > 1) {
    subCommand = findSubCommand(config, options._[1]);
  }
  logger.error(chalk`{gray ${dashes}} {bold ${config.name}} {gray ${dashes}}`);
  logger.error('');
  if (subCommand) {
    logger.error(createSubCommandHelp(config.name, subCommand));
  } else {
    logger.error(chalk.bold`Commands:`);
    logger.error(await createCommandsList(config));
  }
}

export async function singleCommandHelp(config: SingleCommandConfig) {
  logger.error(chalk`{gray ${dashes}} {bold ${config.name}} {gray ${dashes}}`);
  logger.error('');
  logger.error(createSubCommandHelp(undefined, config));
}

export async function help(
  config: Config | SingleCommandConfig,
  options: Options
) {
  // @ts-ignore
  if (config.single) {
    return singleCommandHelp(config as SingleCommandConfig);
  }
  return multiCommandHelp(config as Config, options);
}
