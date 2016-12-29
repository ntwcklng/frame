#!/usr/bin/env node
import boxen from 'boxen'
import parseArgs from 'minimist'
import updateNotifier from 'update-notifier'
import chalk from 'chalk'
import frame from '../'
import supportedProjects from '../supported-projects'

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

    ${supportedProjects.join(', ')}

  ${chalk.dim('Options:')}

    --git   Initializes a git repository

  ${chalk.dim('Examples:')}

  ${chalk.gray('–')} Spawn the UI

    ${chalk.cyan('$ frame')}

  ${chalk.gray('–')} Create a new React Project

    ${chalk.cyan('$ frame react my-awesome-new-project')}

  ${chalk.gray('–')} Create a new Preact Project and initialize git

    ${chalk.cyan('$ frame preact my-awesome-preact-project --git')}

  `)
  process.exit(0)
}

frame(args)
