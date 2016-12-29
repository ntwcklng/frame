import {validateOptions, copyTemplate, installAppDependencies, initGit, successfullyCreated} from './utils'

export default function createProject(opts) {
  return Promise.resolve()
  .then(() => validateOptions(opts))
  .then(() => copyTemplate(opts))
  .then(() => !opts.skipInstall && installAppDependencies(opts))
  .then(() => !opts.skipGit && initGit(opts))
  .then(() => successfullyCreated(opts))
}
