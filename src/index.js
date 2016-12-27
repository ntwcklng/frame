import copyTemplateDir from 'copy-template-dir'
import path from 'path'
import {exec} from 'child_process'
import messages from './messages'
import chalk from 'chalk'
import glob from 'glob'
import supportedProjects from './supportedProjects'

function validateOptions (opts) {
  return new Promise((resolve, reject) => {
    opts.spinner.text = 'Validate Options'
    if (supportedProjects.indexOf(opts.type) === -1) {
      reject(`${chalk.bold(opts.type)} is not a valid FRAME Project.\n\n` +
        `${chalk.reset(`FRAME supports the following types:\n` +
          `${supportedProjects.join(', ')}`)}`)
    }
    if (!opts.name) {
      reject(`Please give your new project a name.\n` +
        `${chalk.reset(`\nUsage:\n$ frame ${opts.type} your-awesome-new-projectname`)}`)
    }
    if (glob.sync(`${opts.name}/`).length !== 0) {
      reject(`A directory with the name ${opts.name} already exists`)
    }
    resolve()
  })
}

function copyTemplate (opts, inDir, outDir, vars, cb) {
  return new Promise((resolve, reject) => {
    const templateDir = path.join(__dirname, `../templates/${opts.type}`)
    const templateVars = {name: opts.name}
    const targetDir = path.resolve(opts.name)
    opts.spinner.text = 'Copy Template Directory'
    copyTemplateDir(templateDir, targetDir, templateVars, (err, files) => {
      if (err) reject(err)
      resolve()
    })
  })
}

function installAppDependencies (opts) {
  return new Promise((resolve, reject) => {
    opts.spinner.text = `Installing ${opts.type} dependencies`
    const cwd = path.resolve(opts.name)
    const cmd = 'npm install'
    exec(cmd, {cwd, stdio: 'ignore'}, (err) => {
      if (err) reject(err)
      resolve()
    })
  })
}

function successfullyCreated (opts) {
  return new Promise((resolve, reject) => {
    opts.spinner.text = `Successfully created a new ${opts.type} Project!`
    opts.spinner.succeed()
    messages.printSuccessMessage(opts.name)
    resolve(opts)
  })
}

const createProject = (opts) => {
  opts.spinner.start()
  return Promise.resolve()
  .then(() => validateOptions(opts))
  .then(() => copyTemplate(opts))
  .then(() => installAppDependencies(opts))
  .then(() => successfullyCreated(opts))
}

export default createProject
