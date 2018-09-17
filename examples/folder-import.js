#!/usr/bin/env babel-node
// @flow
import { resolve } from "path";

import args from "../src";

args({
  name: "supercli",
  commandsPath: resolve(__dirname, "commands")
})(process.argv);
