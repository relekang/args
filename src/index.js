// @flow

export type Config = {};

export default function args(_config: Config) {
  return ([_node, _program, ..._rest]: Array<String>) => ({});
}
