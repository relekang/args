import { createPositionalUsage, createUsageString } from "../src/help";

test("createPositionalUsage should create string of positionals options", () => {
  const command = {
    name: "command",
    positionalOptions: [
      { name: "first", required: true },
      { name: "second", required: false }
    ]
  };

  expect(createPositionalUsage(command)).toEqual("<first> [<second>]");
});

test("createPositionalUsage should create empty string if no optionals", () => {
  const command = {
    name: "command",
    positionalOptions: []
  };

  expect(createPositionalUsage(command)).toEqual("");
});

test("createUsageString should create usage string", () => {
  const command = {
    name: "command",
    positionalOptions: [
      { name: "first", required: true },
      { name: "second", required: false }
    ],
    namedOptions: [{ name: "test" }]
  };

  expect(createUsageString("./cli.js", command)).toEqual(
    "Usage: ./cli.js command <first> [<second>] [--options]"
  );
});

test("createUsageString should create usage string without positionals", () => {
  const command = {
    name: "command",
    namedOptions: [{ name: "test" }]
  };

  expect(createUsageString("./cli.js", command)).toEqual(
    "Usage: ./cli.js command [--options]"
  );
});

test("createUsageString should create usage string without optionals", () => {
  const command = {
    name: "command"
  };

  expect(createUsageString("./cli.js", command)).toEqual(
    "Usage: ./cli.js command"
  );
});
