// @flow
/* eslint-disable global-require */
import mri from "mri";
import path from "path";

import { help } from "./help";
import * as logger from "./logger";
import { CliError } from "./errors";
import type { CommandConfig, Config, Options } from "./types";

export * from "./errors";

function parse(commandConfig, options) {
  const positionals = (commandConfig.positionalOptions || []).reduce(
    (lastValue, item, index) => {
      const value = options._[index];
      if (item.required && !value) {
        throw new CliError(`Missing required argument "${item.name}"`, 1);
      }
      if (!value) return lastValue;
      return {
        ...lastValue,
        [item.name]: item.transform ? item.transform(value) : value
      };
    },
    {}
  );
  return { ...options, ...positionals };
}

async function __args(config: Config, subCommand: string, args: Array<string>) {
  let options: Options = mri(args);
  if (subCommand === "help") {
    return help(config, options);
  }

  let command: CommandConfig;
  if (config.commands) {
    // $FlowFixMe
    command = config.commands[subCommand];
  } else {
    // $FlowFixMe
    command = require(path.join(config.commandsPath, subCommand));
  }

  options = parse(command, options);

  if (command) {
    await command.run(options);
  } else {
    throw new CliError("Unknown command", 1);
  }
}

export function args(config: Config) {
  return ([_node, _program, subCommand, ...rest]: Array<string>) => {
    return __args(config, subCommand || "help", rest).catch(error => {
      if (
        error.constructor === CliError ||
        error.constructor.constructor === CliError
      ) {
        logger.error(error.toString());
        if (process.env.NODE_ENV !== "test") {
          process.exit(error.exitCode);
        }
      }
      logger.error(error);
      if (process.env.NODE_ENV !== "test") {
        process.exit(1);
      }
    });
  };
}

export default args;
