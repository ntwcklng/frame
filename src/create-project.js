import {validateOptions, copyTemplate, installAppDependencies, initGit, successfullyCreated, log} from './utils'

export default function createProject(opts) {
  opts.logger = opts.silent ? function () {} : log
  return Promise.resolve()
  .then(() => validateOptions(opts))
  .then(() => copyTemplate(opts))
  .then(() => !opts.skipInstall && installAppDependencies(opts))
  .then(() => !opts.skipGit && initGit(opts))
  .then(() => successfullyCreated(opts))
}
