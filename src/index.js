import ora from 'ora'
import chalk from 'chalk'
import ui from './ui'
import createProject from './create-project'

export default function frame(args) {
  const type = args._[0] || ''
  const name = args._[1] || ''
  const spinner = ora(`FRAME`)
  const defaultOptions = {
    type: type.toLowerCase(),
    name,
    skipGit: args['skip-git'],
    spinner
  }

  return Promise.resolve()
  .then(() => {
    if (type && name) {
      return Object.assign({}, defaultOptions)
    }
    return ui(defaultOptions)
  })
  .then(opts => createProject(opts))
  .catch(err => {
    spinner.text = `${chalk.bold.red('[error]')} ${err}`
    spinner.fail()
  })
}
