import mri from 'mri';
import { CliError } from './errors';
import { CommandConfig, CommandOption, Options } from './types';

function evaluateOption<A, B>(item: CommandOption<A, B>, value: A): B {
  if (item.required && !value) {
    throw new CliError({
      message: `Missing required argument "${item.name}"`,
      exitCode: 1,
      showHelp: true,
    });
  }
  let transformed = item.transform
    ? item.transform(value)
    : ((value as unknown) as B);
  if (!transformed) {
    return transformed;
  }
  if (typeof item.validate === 'function') {
    const error = item.validate(transformed);
    if (error) {
      throw new CliError({
        message: `Validation error on ${item.name}: ${error}`,
        exitCode: 1,
        showHelp: true,
      });
    }
  }
  return transformed;
}

export function parse(
  commandConfig: CommandConfig,
  args: Array<string>
): Options {
  const options: Options = mri(args);

  const positionals = (commandConfig.positionalOptions || []).reduce(
    (lastValue, item, index) => {
      const value = evaluateOption(item, options._[index]);
      if (value !== false && !value) {
        return lastValue;
      }
      return {
        ...lastValue,
        [item.name]: value,
      };
    },
    {}
  );

  const named = (commandConfig.namedOptions || []).reduce((lastValue, item) => {
    const value = evaluateOption(item, options[item.name]);
    if (value !== false && !value) {
      return lastValue;
    }
    return {
      ...lastValue,
      [item.name]: value,
    };
  }, {});

  return { ...options, ...positionals, ...named };
}
