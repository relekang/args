// @flow
/* eslint-disable global-require */
import mri from "mri";
import path from "path";

import { help } from "./help";
import type { CommandConfig, Config, Options } from "./types";

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
    throw new Error("Unknown command");
  }
}

export default function args(config: Config) {
  return ([_node, _program, subCommand, ...rest]: Array<string>) => {
    return __args(config, subCommand || "help", rest).catch(error => {
      // eslint-disable-next-line no-console
      console.error(error);
      process.exit(1);
    });
  };
}
