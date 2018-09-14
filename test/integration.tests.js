// @flow
import args from "../src";
import type { Config } from "../src";

const config: Config = {};

test("args should parse the args", () => {
  expect(args(config)([])).toEqual({});
});
