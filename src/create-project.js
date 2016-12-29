import path from 'path'
import {exec, execSync} from 'child_process'
import copyTemplateDir from 'copy-template-dir'
import chalk from 'chalk'
import glob from 'glob'
import logSymbols from 'log-symbols'
import supportedProjects, {prettyProjects} from './supported-projects'

function validateOptions(opts) {
  return new Promise((resolve, reject) => {
    opts.spinner.text = 'Validate Options'
    opts.spinner.start()
    if (supportedProjects.indexOf(opts.type) === -1) {
      return reject(`${chalk.bold(opts.type)} is not a valid FRAME project type

      FRAME supports: ${chalk.bold(supportedProjects.join(', '))}

      ${chalk.dim(`Usage:`)}

        ${`$ frame [${supportedProjects.join('|')}] your-awesome-new-projectname`}

      ${chalk.dim(`Or run FRAME without any arguments to get a UI`)}

        $ frame

      `)
    }
    if (!opts.name) {
      return reject(`Please give your new project a name

      ${chalk.dim(`Usage:`)}
        ${`$ frame ${opts.type} your-awesome-new-projectname`}

      `)
    }
    if (glob.sync(`${opts.name}/`).length !== 0) {
      return reject(`A directory with the name ${chalk.bold(opts.name)} already exists`)
    }
    opts.spinner.text = 'Validated options'
    opts.spinner.stopAndPersist(logSymbols.success)
    resolve()
  })
}

function copyTemplate(opts) {
  return new Promise((resolve, reject) => {
    const templateDir = path.join(__dirname, `../templates/${opts.type}`)
    const templateVars = {name: opts.name}
    const targetDir = path.resolve(opts.name)
    opts.spinner.text = 'Copy Template Directory'
    opts.spinner.start()
    copyTemplateDir(templateDir, targetDir, templateVars, err => {
      if (err) {
        return reject(err)
      }
      opts.spinner.text = `Copied template to ${path.resolve(targetDir)}`
      opts.spinner.stopAndPersist(logSymbols.success)
      resolve()
    })
  })
}

function installAppDependencies(opts) {
  return new Promise((resolve, reject) => {
    opts.spinner.text = `Installing ${prettyProjects[opts.type]} dependencies`
    opts.spinner.start()
    const cwd = path.resolve(opts.name)
    const cmd = 'npm install'
    exec(cmd, {cwd, stdio: 'ignore'}, err => {
      if (err) {
        return reject(err)
      }
      opts.spinner.text = `Installed ${prettyProjects[opts.type]} dependencies`
      opts.spinner.stopAndPersist(logSymbols.success)
      resolve()
    })
  })
}

function initGit(opts) {
  return new Promise((resolve, reject) => {
    const cwd = path.resolve(opts.name)
    opts.spinner.text = `Initialize git`
    opts.spinner.start()
    try {
      execSync('git --version', {cwd, stdio: 'ignore'})
      execSync('git init', {cwd, stdio: 'ignore'})
      execSync('git add .', {cwd, stdio: 'ignore'})
      execSync('git commit -m "initial commit"', {cwd, stdio: 'ignore'})
    } catch (err) {
      return reject(err)
    }
    opts.spinner.text = `Initialzed a git repository`
    opts.spinner.stopAndPersist(logSymbols.success)
    resolve()
  })
}

function successfullyCreated(opts) {
  return new Promise(resolve => {
    opts.spinner.text = `Successfully created a new ${opts.type} Project!`
    opts.spinner.succeed()
    console.log(`
    ${chalk.dim('To get started run:')}

      ${chalk.cyan(`$ cd ${opts.name} && npm start`)}

    ${chalk.dim('Your new Project is then available @ http://localhost:8080')}
    `)
    resolve(opts)
  })
}

const createProject = opts => {
  opts.spinner.start()
  return Promise.resolve()
  .then(() => validateOptions(opts))
  .then(() => copyTemplate(opts))
  .then(() => installAppDependencies(opts))
  .then(() => !opts.skipGit && initGit(opts))
  .then(() => successfullyCreated(opts))
}

export default createProject
