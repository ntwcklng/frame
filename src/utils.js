import path from 'path'
import {exec, execSync} from 'child_process'
import copyTemplateDir from 'copy-template-dir'
import chalk from 'chalk'
import glob from 'glob'
import ora from 'ora'
import {SUPPORTED_PROJECTS, PRINT_PROJ_TYPE, VERSIONS} from './constants'

export function log(type, msg, quiet) {
  if (!quiet && msg && type) {
    switch (type) {
      case 'info':
        console.log(`${chalk.dim(`>`)} ${msg}`)
        break
      case 'err':
        console.error(msg)
        break
      case 'normal':
        console.log(msg)
        break
      default:
        break
    }
  }
}

export function validateOptions(opts) {
  return new Promise((resolve, reject) => {
    if (SUPPORTED_PROJECTS.indexOf(opts.type) === -1) {
      return reject(`${chalk.bold(opts.type)} is not a valid FRAME project type

      FRAME supports: ${chalk.bold(SUPPORTED_PROJECTS.join(', '))}

      ${chalk.dim(`Usage:`)}

        ${`$ frame [${SUPPORTED_PROJECTS.join('|')}] your-awesome-new-projectname`}

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
    log('info', `Validated Options`, opts.quiet)
    resolve()
  })
}

export function copyTemplate(opts) {
  return new Promise((resolve, reject) => {
    const templateDir = path.join(__dirname, `../templates/${opts.type}`)
    const templateVars = {name: opts.name, version: VERSIONS[opts.type]}
    const targetDir = path.resolve(opts.name)
    copyTemplateDir(templateDir, targetDir, templateVars, err => {
      if (err) {
        return reject(err)
      }
      log('info', `Copied template to ${path.resolve(targetDir)}`, opts.quiet)
      resolve()
    })
  })
}

export function installAppDependencies(opts) {
  return new Promise((resolve, reject) => {
    const spinner = ora(`Installing ${PRINT_PROJ_TYPE[opts.type]} dependencies`)
    if (!opts.quiet) {
      spinner.start()
    }
    const cwd = path.resolve(opts.name)
    const cmd = 'npm install'
    exec(cmd, {cwd, stdio: 'ignore'}, err => {
      if (err) {
        return reject(err)
      }
      spinner.stop()
      log('info', `Installed ${PRINT_PROJ_TYPE[opts.type]} dependencies`, opts.quiet)
      resolve()
    })
  })
}

export function initGit(opts) {
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
    log('info', `Initialized a git repository`, opts.quiet)
    resolve()
  })
}

export function successfullyCreated(opts) {
  const npmInstall = opts.skipInstall ? ' && npm install ' : ' '
  log('info', chalk.green(`Successfully created a new ${chalk.bold(PRINT_PROJ_TYPE[opts.type])} Project`), opts.quiet)
  log('normal', `
    ${chalk.dim('To get started run:')}

    ${chalk.cyan(`$ cd ${opts.name}${npmInstall}&& npm run dev`)}

    ${chalk.dim('Your new Project is then available @ http://localhost:3000')}
    `, opts.quiet)

  return opts
}
