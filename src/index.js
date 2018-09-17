// @flow
import mri from "mri";

import { help } from "./help";
import type { Config, Options } from "./types";

async function __args(config: Config, subCommand: string, args: Array<string>) {
  const options: Options = mri(args);
  if (subCommand === "help") {
    return help(config, options);
  }

  await config.commands[subCommand].command(options);
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
