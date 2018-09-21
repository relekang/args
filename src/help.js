// @flow
/* eslint-disable global-require */
import chalk from "chalk";
import wrap from "word-wrap";
import path from "path";
import fs from "fs";
import { promisify } from "util";

import type { Config, CommandConfig, CommandOption, Options } from "./types";

import * as logger from "./logger";

const readdir = promisify(fs.readdir);

function values<A>(o: { [key: string]: A }): Array<A> {
  // $FlowFixMe
  return Object.values(o);
}

async function getCommands(config): { [key: string]: CommandConfig } {
  if (config.commands) {
    return config.commands;
  }
  return (await readdir(config.commandsPath)).filter(/\.js$/.test).reduce(
    (lastValue, file) => ({
      ...lastValue,
      // $FlowFixMe
      [file.replace(/.js$/, "")]: require(path.join(config.commandsPath, file))
    }),
    {}
  );
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
        .fill(" ")
        .join("");
      return `${command.name}${spacing} - ${command.help || ""}`;
    })
    .join("\n");
}

export function createPositionalUsage(command: CommandConfig) {
  return (command.positionalOptions || [])
    .map(({ name, required }) => (required ? `<${name}>` : `[<${name}>]`))
    .join(" ");
}

export function createUsageString(name: string, command: CommandConfig) {
  const positionals = createPositionalUsage(command);
  return (
    `Usage: ${name} ${command.name}` +
    (positionals ? ` ${positionals}` : "") +
    (command.namedOptions ? " [--options]" : "")
  );
}

export function createOptionHelpString(option: CommandOption) {
  return `  - ${option.name}${option.help ? ` - ${option.help}` : ""}`;
}

export function createSubCommandHelp(name: string, command: CommandConfig) {
  let lines = [
    chalk`{bold ${command.name}} - ${command.help} `,
    "\n",
    createUsageString(name, command),
    command.manual ? "\n" + wrap(command.manual, { width: 80 }) : ""
  ];
  if (command.positionalOptions) {
    lines = [...lines, "", chalk.bold("Arguments:")];
    lines = [
      ...lines,
      ...(command.positionalOptions || []).map(createOptionHelpString)
    ];
  }
  if (command.namedOptions) {
    lines = [...lines, "", chalk.bold("Options:")];
    lines = [
      ...lines,
      ...(command.namedOptions || []).map(createOptionHelpString)
    ];
  }
  return lines.join("\n");
}

function findSubCommand(config: Config, name: string): ?CommandConfig {
  if (config.commands) {
    // $FlowFixMe
    return config.commands[name];
  } else {
    try {
      // $FlowFixMe
      return require(path.join(config.commandsPath, name));
    } catch (error) {
      return;
    }
  }
}

export async function help(config: Config, options: Options) {
  const dashes = "--------------------------";
  const subCommand = findSubCommand(config, options._[0]);
  logger.error(chalk`{gray ${dashes}} {bold ${config.name}} {gray ${dashes}}`);
  logger.error("");
  if (subCommand) {
    logger.error(createSubCommandHelp(config.name, subCommand));
  } else {
    logger.error(chalk.bold`Commands: `);
    logger.error(await createCommandsList(config));
  }
}
