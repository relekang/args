# @relekang/args

[![CircleCI](https://circleci.com/gh/relekang/args/tree/master.svg?style=svg)](https://circleci.com/gh/relekang/args/tree/master)

Just another _opinionated_ lazy argument parser. This library is made to be
opinionated about the structure of node cli application. It strives to give
you a most of what you would need out of the box if you agree with its opinions.

## Installation

```
yarn add @relekang/args
```

## Usage

There is two ways of using args:


### A directory with commands

```javascript
const args = require('@relekang/args')

args({
  commandsPath: "./commands",
})(process.argv)
```

### An object with commands

This gives you the control of the importing of the commands. It can
be useful if you use something like rollup to create a single bundle 
of the cli.

```javascript
const args = require('@relekang/args')

const info = require('./commands/info')
const update = require('./commands/update')

const commands = {info, update}

args({ commands })(process.argv)
```

### Requiring setup on first run

`args` takes two options that help with initial setup and installation
of your cli: `needsSetup` and `setup`.

#### Example

```javascript
const args = require('@relekang/args')
const fs = require("fs")
const {promisfy} = require("util")

const {createConfig} = require("./config")
const readFile = promisify(fs.readFile)

args({
  commandsPath: "./commands",
  needsSetup: async () => {
      try {
        const config = JSON.parse(await readFile("~/config"))
        return true
      } catch (error) {
        return false
      }
  },
  setup: createConfig
})(process.argv)

````

### Creating a command

The command must either use named export of all the properties or 
export and object with all the properties. The available properties are:

* name - required string - The name of the command like `./cli.js <name>`
* help - required string - A small help string shown on the command list help screen
* manual - optional string - A multiline description of how to use the command with usage examples etc.
* run - required (async) function - The code that will be executed with options as first argument, can be async.
* positionalOptions - optional array of options - The positional options for the command. See options below for fields.
* namedOptions - optional array of options - The positional options for the command. See options below for fields.

#### Options
* name - required string - The name of the option
* help - required string - A small help string shown on the command help screen
* required - required boolean - Is the option required
* transform - optional function - A function that converts the input. This runs before the validator. `transform: Boolean` and `transform: Number` is helpful.
* validator - optional (async) function - A function that validates the input. This might return a promise for async operations.

#### Example

A tiny example below, see example folder for more examples.

```javascript
export const name = 'update'
export const help = 'Update supercli'
export const positionalOptions = [
    {
        name: 'latest', 
        help: 'Will update to latest and not within range if present.', 
        required: false, 
        transform: Boolean
    }
]

export async function command(options) {
    const range = getVersionRange()
    await exec('npm -g install @org/supercli@'+ options.latest ? 'latest' : range)
}