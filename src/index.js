// @flow
/* eslint-disable global-require */
import mri from "mri";
import path from "path";

import { help } from "./help";
import * as logger from "./logger";
import { CliError } from "./errors";
import { parse } from "./parse";
import type { CommandConfig, Config, Options } from "./types";

export * from "./errors";

async function __args(config: Config, subCommand: string, args: Array<string>) {
  if (subCommand === "help") {
    return help(config, mri(args));
  }

  let command: CommandConfig;
  if (config.commands) {
    // $FlowFixMe
    command = config.commands[subCommand];
  } else {
    // $FlowFixMe
    command = require(path.join(config.commandsPath, subCommand));
  }

  const options: Options = parse(command, args);

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
