#!/usr/bin/env node
import boxen from 'boxen'
import parseArgs from 'minimist'
import updateNotifier from 'update-notifier'
import chalk from 'chalk'
import frame from '../'
import {SUPPORTED_PROJECTS} from '../constants'

const pkg = require('../../package.json')

updateNotifier({pkg}).notify()
const frameVersion = pkg.version
const args = parseArgs(process.argv.slice(2), {
  alias: {
    h: 'help',
    v: 'version'
  },
  boolean: ['help', 'version', 'skip-git']
})

console.log(boxen('FRAME v' + frameVersion, {padding: 1, margin: 1, borderStyle: 'double', borderColor: 'blue'}))

if (args.version) {
  process.exit(0)
}
if (args.help) {
  console.log(`
  ${chalk.dim('Usage:')}

    ${chalk.cyan('$ frame <project-type | project-name> [options]')}

  ${chalk.dim('Supported Project Types:')}

    ${SUPPORTED_PROJECTS.join(', ')}

  ${chalk.dim('Options:')}

    --skip-git        don't initialize a git repository
    --skip-install    don't install project dependencies

  ${chalk.dim('Examples:')}

  ${chalk.gray('–')} Spawn the UI

    ${chalk.cyan('$ frame')}

  ${chalk.gray('–')} Create a new React Project

    ${chalk.cyan('$ frame react my-awesome-new-project')}

  ${chalk.gray('–')} Create a new Preact Project and skip git

    ${chalk.cyan('$ frame preact my-awesome-preact-project --skip-git')}

  ${chalk.gray('–')} Create a new React Project and skip npm install

      ${chalk.cyan('$ frame react my-awesome-preact-project --skip-install')}

  `)
  process.exit(0)
}

frame(args).catch(err => {
  console.log(`> ${chalk.red('Error!')} ${err.message}`)
})
