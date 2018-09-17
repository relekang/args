// @flow
import mri from "mri";

import { help } from "./help";

export type Config = {
  name: string
};

function __args(config: Config, subCommand: string, args: Array<string>) {
  const options = mri(args);
  if (subCommand === "help") {
    return help(config, options);
  }
  return options;
}

export default function args(config: Config) {
  return ([_node, _program, subCommand, ...rest]: Array<string>) => {
    return __args(config, subCommand || "help", rest);
  };
}
