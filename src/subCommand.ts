import path from 'path';

import { Config, CommandConfig } from './types';

function requireCommand(p: string) {
  try {
    return require(p);
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      throw error;
    }
  }
}

export function findSubCommand(
  config: Config,
  name: string
): CommandConfig | undefined {
  let command;
  // @ts-ignore
  if (config.commands) {
    // @ts-ignore
    command = config.commands[name];
  } else {
    // @ts-ignore
    command = requireCommand(path.join(config.commandsPath, name));
  }

  if (
    !command &&
    config.commandPackagePrefixes &&
    config.commandPackagePrefixes.length > 0
  ) {
    const prefix = config.commandPackagePrefixes.find(item =>
      requireCommand(item + name)
    );
    if (prefix) {
      command = requireCommand(prefix + name);
    }
  }

  return command;
}
