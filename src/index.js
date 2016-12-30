import ui from './ui'
import createProject from './create-project'

export default function frame(args) {
  const type = args._[0] || ''
  const name = args._[1] || ''
  const defaultOptions = {
    type: type.toLowerCase(),
    name,
    skipGit: args['skip-git'],
    skipInstall: args['skip-install'],
    quiet: args.quiet
  }

  return Promise.resolve()
  .then(() => {
    const opts = Object.assign({}, defaultOptions)
    if (type && name) {
      return opts
    }
    return ui(opts)
  })
  .then(opts => createProject(opts))
  .catch(err => {
    throw new Error(err)
  })
}
