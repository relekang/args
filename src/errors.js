// @flow
type CliErrorOptions = {
  message: string,
  exitCode: number,
  showHelp?: boolean
};
export class CliError extends Error {
  exitCode: number;
  showHelp: boolean;

  constructor({ message, exitCode, showHelp }: CliErrorOptions) {
    super(message);
    this.exitCode = exitCode;
    this.showHelp = showHelp || false;
  }

  toString() {
    return this.message;
  }
}
