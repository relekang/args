// @flow
import chalk from "chalk";
import wrap from "word-wrap";

import * as logger from "./logger";

export function createCommandsList(commands) {
  const length = Math.max(
    0,
    ...Object.values(commands).map(({ name }) => name.length)
  );
  return Object.values(commands)
    .map(command => {
      const spacing = new Array(Math.max(1, length - command.name.length + 1))
        .fill(" ")
        .join("");
      return `${command.name}${spacing} - ${command.help || ""}`;
    })
    .join("\n");
}

export function createPositionalUsage(command) {
  return (command.positionalOptions || [])
    .map(({ name, required }) => (required ? `<${name}>` : `[<${name}>]`))
    .join(" ");
}

export function createUsageString(name, command) {
  const positionals = createPositionalUsage(command);
  return (
    `Usage: ${name} ${command.name}` +
    (positionals ? ` ${positionals}` : "") +
    (command.namedOptions ? " [--options]" : "")
  );
}
export function createOptionHelpString(option) {
  return `  - ${option.name}${option.help ? ` - ${option.help}` : ""}`;
}
export function createSubCommandHelp(name, command) {
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
      ...command.positionalOptions.map(createOptionHelpString)
    ];
  }
  if (command.namedOptions) {
    lines = [...lines, "", chalk.bold("Options:")];
    lines = [...lines, ...command.namedOptions.map(createOptionHelpString)];
  }
  return lines.join("\n");
}

export function help(config, options) {
  const dashes = "--------------------------";
  const subCommand = config.commands[options._[0]];
  logger.error(chalk`{gray ${dashes}} {bold ${config.name}} {gray ${dashes}}`);
  logger.error("");
  if (subCommand) {
    logger.error(createSubCommandHelp(config.name, subCommand));
  } else {
    logger.error(chalk.bold`Commands: `);
    if (config.commands) {
      logger.error(createCommandsList(config.commands));
    }
  }
}
