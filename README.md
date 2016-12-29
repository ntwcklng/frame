[![NPM Version](https://img.shields.io/npm/v/frame-cli.svg?style=flat-square)](https://www.npmjs.com/package/frame-cli)
[![node](https://img.shields.io/node/v/frame-cli.svg?style=flat-square)](https://www.npmjs.com/package/frame-cli)
[![Build Status](https://img.shields.io/travis/ntwcklng/frame.svg?branch=master&style=flat-square)](https://travis-ci.org/ntwcklng/frame)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg?style=flat-square)](https://github.com/sindresorhus/xo)

# FRAME
Create a React / Preact Project

## Usage

You can create a new project by running FRAME without arguments. An UI will spawn and you can select your project type and give it a name.
You can also skip the UI by defining a type and a name as arguments.

```

Usage:

 $ frame <project-type | project-name> [options]

Supported Project Types:

 react, preact

Options:

 --skip-git       don't initialize a git repository
 --skip-install   don't install the project dependencies

Examples:

– Spawn the UI

 $ frame

– Create a new React Project

 $ frame react my-awesome-new-project

– Create a new Preact Project and skip git

 $ frame preact my-awesome-preact-project --skip-git

– Create a new React Project and skip npm install

  $ frame react my-awesome-preact-project --skip-install

```
