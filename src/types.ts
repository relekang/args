import mri from "mri";

export type CommandOption<A = any, B = any> = {
  name: string;
  help?: string;
  required?: boolean;
  transform?: (untransformed: A) => B;
  validate?: (value: A) => string | null;
};

export type CommandConfig = {
  name: string;
  help: string;
  run: (o: Options) => void | Promise<void>;
  manual?: string;
  positionalOptions?: Array<CommandOption>;
  namedOptions?: Array<CommandOption>;
};

export interface BaseConfig {
  name: string;
  setup?: () => Promise<void>;
  needsSetup?: () => Promise<boolean>;
  defaultCommand?: string,
}

export interface ConfigWithCommands extends BaseConfig {
  commands: { [key: string]: CommandConfig };
}

export interface ConfigWithPaths extends BaseConfig {
  commandsPath: string;
}

export type Config = ConfigWithCommands | ConfigWithPaths;

export interface Options extends mri.Argv {
  [key: string]: any;
}
