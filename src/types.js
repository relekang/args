// @flow

export type CommandOption = {
  name: string,
  help?: string,
  required?: boolean
};

export type CommandConfig = {
  name: string,
  help: string,
  command: Options => void | Promise<void>,
  manual?: string,
  positionalOptions?: Array<CommandOption>,
  namedOptions?: Array<CommandOption>
};

export type Config = {
  name: string,
  commands: { [key: string]: CommandConfig }
};

export type Options = {
  _: Array<string>,
  [key: string]: mixed
};
