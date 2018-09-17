#!/usr/bin/env babel-node
// @flow
import args from "../src";

args({
  name: "supercli",
  commands: {
    test: {
      name: "test",
      help: "Testing testing",
      manual:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse felis ligula, vulputate tincidunt consectetur sed, euismod sit amet dolor. Cras commodo eu mi sed consectetur. Quisque eget mauris felis. Sed accumsan quis dui quis consequat. Proin a magna mauris. Aenean sit amet mauris sem. Nam tellus eros, malesuada vel diam eget, consectetur sodales nisl. Quisque non libero auctor, tempor nisl eu, rutrum ante. Suspendisse eget lacus ex. ",
      command: options => {
        // eslint-disable-next-line no-console
        console.log("Running the command ", JSON.stringify(options));
      },
      positionalOptions: [
        { name: "first", help: "Some superduper argument.", required: true },
        {
          name: "second",
          help: "Not super in any way, still an argument tho.",
          required: false
        }
      ],
      namedOptions: [{ name: "test" }]
    },
    "long-named-command": {
      name: "long-named-command",
      help: "Command with long name",
      command: options => {
        // eslint-disable-next-line no-console
        console.log("Running the command ", JSON.stringify(options));
      }
    }
  }
})(process.argv);
