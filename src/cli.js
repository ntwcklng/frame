import ora from 'ora'
import messages from './messages'
import createProject from './'
import parseArgs from 'minimist'
import boxen from 'boxen'
import supportedProjects from './supportedProjects'
import ui from './ui'

const frameVersion = require('../package.json').version

export default function frameCLI (argv) {
  const args = parseArgs(argv, {
    alias: {
      h: 'help',
      v: 'version'
    },
    boolean: ['help', 'version']
  })
  const type = args._[0]
  const name = args._[1]

  messages.info(boxen('FRAME v' + frameVersion, {padding: 1, margin: 1, borderStyle: 'classic'}))
  if (args.version) {
    process.exit(0)
  }
  if (args.help) {
    console.log(`
    Usage: $ frame <project-type> <project-name>

    Supported Project Types: ${supportedProjects.join(', ')}

    Examples:
      $ frame   # Opens the UI for creating a new Project
      $ frame react my-react-app
      $ frame preact my-preact-app
    `)
    process.exit(0)
  }
  const spinner = ora(`FRAME`)

  return Promise.resolve()
  // .then(() => Object.assign({}, {type, name, spinner}))
  .then(() => {
    if (type && name) {
      return Object.assign({}, {type, name, spinner})
    }
    return ui(spinner)
  })
  .then((opts) => createProject(opts))
  .catch(err => {
    spinner.fail()
    messages.error(err)
  })
}
