import path from 'path'
import {exec, execSync} from 'child_process'
import copyTemplateDir from 'copy-template-dir'
import chalk from 'chalk'
import glob from 'glob'
import ora from 'ora'
import {SUPPORTED_PROJECTS, PRINT_PROJ_TYPE, VERSIONS} from './constants'

export function log(msg) {
  return console.log(`${chalk.dim(`>`)} ${msg}`)
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
    log(`Validated Options`)
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
      log(`Copied template to ${path.resolve(targetDir)}`)
      resolve()
    })
  })
}

export function installAppDependencies(opts) {
  return new Promise((resolve, reject) => {
    const spinner = ora(`Installing ${PRINT_PROJ_TYPE[opts.type]} dependencies`).start()
    const cwd = path.resolve(opts.name)
    const cmd = 'npm install'
    exec(cmd, {cwd, stdio: 'ignore'}, err => {
      if (err) {
        return reject(err)
      }
      spinner.stop()
      log(`Installed ${PRINT_PROJ_TYPE[opts.type]} dependencies`)
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
    log(`Initialized a git repository`)
    resolve()
  })
}

export function successfullyCreated(opts) {
  const npmInstall = opts.skipInstall ? ' && npm install ' : ' '
  log(chalk.green(`Successfully created a new ${chalk.bold(PRINT_PROJ_TYPE[opts.type])} Project`))
  console.log(`
  ${chalk.dim('To get started run:')}

    ${chalk.cyan(`$ cd ${opts.name}${npmInstall}&& npm run dev`)}

  ${chalk.dim('Your new Project is then available @ http://localhost:3000')}
  `)
  return opts
}
