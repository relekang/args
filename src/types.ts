import { Argv } from 'mri';

export type CommandOption<A = any, B = any> = {
  name: string;
  help?: string;
  required?: boolean;
  transform?: (untransformed: A) => B;
  validate?: (value: A | B) => string | null;
};

export type CommandConfig = {
  name: string;
  help: string;
  run: (o: Options) => void | Promise<void>;
  manual?: string;
  positionalOptions?: Array<CommandOption>;
  namedOptions?: Array<CommandOption>;
};

export interface SingleCommandConfig {
  single: true;
  name: string;
  help: string;
  packageInfo?: {
    version?: string;
    dependencies?: { [key: string]: string };
    devDependencies?: { [key: string]: string };
  };
  setup?: () => Promise<void> | void;
  needsSetup?: () => Promise<boolean> | boolean;
  run: (o: Options) => void | Promise<void>;
  manual?: string;
  positionalOptions?: Array<CommandOption>;
  namedOptions?: Array<CommandOption>;
}

export interface BaseConfig {
  name: string;
  packageInfo?: {
    version?: string;
    dependencies?: { [key: string]: string };
    devDependencies?: { [key: string]: string };
  };
  setup?: () => Promise<void> | void;
  needsSetup?: () => Promise<boolean> | boolean;
  defaultCommand?: string;
  commandPackagePrefixes?: string[];
}

export interface ConfigWithCommands extends BaseConfig {
  commands: { [key: string]: CommandConfig };
}

export interface ConfigWithPaths extends BaseConfig {
  commandsPath: string;
}

export type Config = ConfigWithCommands | ConfigWithPaths;

export interface Options extends Argv {
  // eslint-disable-next-line typescript/no-explicit-any
  [key: string]: any;
}
