import ui from './ui'
import createProject from './create-project'
import error from './error'

export default function frame(args) {
  const type = args._[0] || ''
  const name = args._[1] || ''
  const defaultOptions = {
    type: type.toLowerCase(),
    name,
    skipGit: args['skip-git']
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
    error(err)
  })
}
