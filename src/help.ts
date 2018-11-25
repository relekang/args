/* eslint-disable global-require */
import chalk from 'chalk';
import wrap from 'word-wrap';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

import { Config, CommandConfig, CommandOption, Options } from './types';

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
      return `${command.name}${spacing} - ${command.help || ''}`;
    })
    .join('\n');
}

export function createPositionalUsage(command: CommandConfig) {
  return (command.positionalOptions || [])
    .map(({ name, required }) => (required ? `<${name}>` : `[<${name}>]`))
    .join(' ');
}

export function createUsageString(name: string, command: CommandConfig) {
  const positionals = createPositionalUsage(command);
  return (
    `Usage: ${name} ${command.name}` +
    (positionals ? ` ${positionals}` : '') +
    (command.namedOptions ? ' [--options]' : '')
  );
}

export function createOptionHelpString(option: CommandOption) {
  return `  - ${option.name}${option.help ? ` - ${option.help}` : ''}`;
}

export function createSubCommandHelp(name: string, command: CommandConfig) {
  let lines = [
    chalk`{bold ${command.name}} - ${command.help} `,
    '\n',
    createUsageString(name, command),
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

export async function help(config: Config, options: Options) {
  const dashes = '--------------------------';
  let subCommand;
  if (options._.length > 0) {
    subCommand = findSubCommand(config, options._[0]);
  }
  logger.error(chalk`{gray ${dashes}} {bold ${config.name}} {gray ${dashes}}`);
  logger.error('');
  if (subCommand) {
    logger.error(createSubCommandHelp(config.name, subCommand));
  } else {
    logger.error(chalk.bold`Commands: `);
    logger.error(await createCommandsList(config));
  }
}
