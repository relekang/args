// @flow
import args from "../src";
import * as logger from "../src/logger";
import type { Config } from "../src/types";

jest.mock("../src/logger", () => ({ error: jest.fn(), log: jest.fn() }));

const config: Config = {
  name: "supercli",
  commands: {
    test: {
      name: "test",
      help: "Testing testing",
      manual:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse felis ligula, vulputate tincidunt consectetur sed, euismod sit amet dolor. Cras commodo eu mi sed consectetur. Quisque eget mauris felis. Sed accumsan quis dui quis consequat. Proin a magna mauris. Aenean sit amet mauris sem. Nam tellus eros, malesuada vel diam eget, consectetur sodales nisl. Quisque non libero auctor, tempor nisl eu, rutrum ante. Suspendisse eget lacus ex. ",
      run: jest.fn(),
      positionalOptions: [
        { name: "first", required: true },
        { name: "second", required: false }
      ],
      namedOptions: [{ name: "verbose", required: true }]
    },
    "long-named-command": {
      name: "long-named-command",
      help: "Command with long name",
      run: () => {}
    }
  }
};

beforeEach(() => {
  // $FlowFixMe flow does not understand mocks
  logger.error.mockReset();
  // $FlowFixMe flow does not understand mocks
  logger.log.mockReset();
});

test("args should parse the args", async () => {
  await args(config)(["node", "cli", "test"]);

  // $FlowFixMe
  expect(config.commands.test.run).toBeCalledWith({ _: [] });
});

test("args should show help screen", async () => {
  await args(config)(["node", "cli", "help"]);

  // $FlowFixMe flow does not understand mocks
  expect(logger.error.mock.calls.join("\n")).toMatchSnapshot();
});

test("args should show help screen for specific command", async () => {
  await args(config)(["node", "cli", "help", "test"]);

  // $FlowFixMe flow does not understand mocks
  expect(logger.error.mock.calls.join("\n")).toMatchSnapshot();
});
