import path from 'path'
import {exec, execSync} from 'child_process'
import copyTemplateDir from 'copy-template-dir'
import chalk from 'chalk'
import glob from 'glob'
import ora from 'ora'
import supportedProjects, {prettyProjects} from './supported-projects'

function validateOptions(opts) {
  return new Promise((resolve, reject) => {
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
    console.log(`> Validated Options`)
    resolve()
  })
}

function copyTemplate(opts) {
  return new Promise((resolve, reject) => {
    const templateDir = path.join(__dirname, `../templates/${opts.type}`)
    const templateVars = {name: opts.name}
    const targetDir = path.resolve(opts.name)
    copyTemplateDir(templateDir, targetDir, templateVars, err => {
      if (err) {
        return reject(err)
      }
      console.log(`> Copied template to ${path.resolve(targetDir)}`)
      resolve()
    })
  })
}

function installAppDependencies(opts) {
  return new Promise((resolve, reject) => {
    const spinner = ora(`Installing ${prettyProjects[opts.type]} dependencies`).start()
    const cwd = path.resolve(opts.name)
    const cmd = 'npm install'
    exec(cmd, {cwd, stdio: 'ignore'}, err => {
      if (err) {
        return reject(err)
      }
      spinner.stop()
      console.log(`> Installed ${prettyProjects[opts.type]} dependencies`)
      resolve()
    })
  })
}

function initGit(opts) {
  return new Promise((resolve, reject) => {
    const cwd = path.resolve(opts.name)
    try {
      execSync('git --version', {cwd, stdio: 'ignore'})
      execSync('git init', {cwd, stdio: 'ignore'})
      execSync('git add .', {cwd, stdio: 'ignore'})
      execSync('git commit -m "initial commit"', {cwd, stdio: 'ignore'})
    } catch (err) {
      return reject(err)
    }
    console.log(`> Initialized a git repository`)
    resolve()
  })
}

function successfullyCreated(opts) {
  console.log(`> Successfully created a new ${chalk.bold(opts.type)} Project`)
  console.log(`
  ${chalk.dim('To get started run:')}

    ${chalk.cyan(`$ cd ${opts.name} ${opts.skipInstall && '&& npm install '}&& npm start`)}

  ${chalk.dim('Your new Project is then available @ http://localhost:8080')}
  `)
  return opts
}

const createProject = opts => {
  return Promise.resolve()
  .then(() => validateOptions(opts))
  .then(() => copyTemplate(opts))
  .then(() => !opts.skipInstall && installAppDependencies(opts))
  .then(() => !opts.skipGit && initGit(opts))
  .then(() => successfullyCreated(opts))
}

export default createProject
