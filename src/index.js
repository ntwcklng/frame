import ui from './ui'
import {validateOptions, copyTemplate, installAppDependencies, initGit, successfullyCreated} from './create'
import {log} from './utils'

export default function frame(args) {
  const shouldLog = args.silent ? function () {} : log
  const type = args._[0] || ''
  const name = args._[1] || ''
  const defaultOptions = {
    type: type.toLowerCase(),
    name,
    skipGit: args['skip-git'],
    skipInstall: args['skip-install'],
    silent: args.silent,
    logger: shouldLog
  }

  return Promise.resolve()
  .then(async () => {
    let options = {}

    if (type && name) {
      options = Object.assign({}, defaultOptions)
    } else {
      options = await ui(defaultOptions)
    }

    return Promise.resolve()
    .then(() => validateOptions(options))
    .then(() => copyTemplate(options))
    .then(() => !options.skipInstall && installAppDependencies(options))
    .then(() => !options.skipGit && initGit(options))
    .then(() => successfullyCreated(options))
  })
  .catch(err => {
    throw new Error(err)
  })
}
