// @flow
import type { CommandConfig } from "./types";

type CliErrorOptions = {
  message: string,
  exitCode: number,
  showHelp?: boolean,
  commandConfig?: CommandConfig
};
export class CliError extends Error {
  exitCode: number;
  showHelp: boolean;
  commandConfig: ?CommandConfig;

  constructor({ message, exitCode, showHelp, commandConfig }: CliErrorOptions) {
    super(message);
    this.exitCode = exitCode;
    this.showHelp = showHelp || false;
    this.commandConfig = commandConfig;
  }

  toString() {
    return this.message;
  }
}
