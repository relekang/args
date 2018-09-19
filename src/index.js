// @flow
/* eslint-disable global-require */
import mri from "mri";
import path from "path";

import { help } from "./help";
import * as logger from "./logger";
import { CliError } from "./errors";
import type { CommandConfig, Config, Options } from "./types";

export * from "./errors";

async function __args(config: Config, subCommand: string, args: Array<string>) {
  const options: Options = mri(args);
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
        process.exit(error.exitCode);
      }
      logger.error(error);
      process.exit(1);
    });
  };
}

export default args;
