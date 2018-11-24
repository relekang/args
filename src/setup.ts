import { CliError } from './errors';
import { Config } from './types';

export async function setup(config: Config) {
  if (config.needsSetup && (await config.needsSetup())) {
    if (config.setup) {
      await config.setup();
    } else {
      throw new CliError({
        message: 'This cli requires setup, however the setup is not provided.',
        exitCode: 1,
      });
    }
  }
}
