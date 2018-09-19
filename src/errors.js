// @flow

export class CliError extends Error {
  exitCode: number;

  constructor(message: string, exitCode: number) {
    super(message);
    this.exitCode = exitCode;
  }

  toString() {
    return this.message;
  }
}
