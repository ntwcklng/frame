import path from 'path'
import {exec, execSync} from 'child_process'
import copyTemplateDir from 'copy-template-dir'
import chalk from 'chalk'
import glob from 'glob'
import ora from 'ora'
import {SUPPORTED_PROJECTS, PRINT_PROJ_TYPE, VERSIONS} from './constants'
import {userError, error} from './error'

export const validateOptions = opts => new Promise(resolve => {
  if (SUPPORTED_PROJECTS.indexOf(opts.type) === -1) {
    userError(`${chalk.bold(opts.type)} is not a valid FRAME project type

    FRAME supports: ${chalk.bold(SUPPORTED_PROJECTS.join(', '))}

    ${chalk.dim(`Usage:`)}

      ${`$ frame [${SUPPORTED_PROJECTS.join('|')}] your-awesome-new-projectname`}

    ${chalk.dim(`Or run FRAME without any arguments to get a UI`)}

      $ frame

    `)
  }
  if (!opts.name) {
    userError(`Please give your new project a name

    ${chalk.dim(`Usage:`)}
      ${`$ frame ${opts.type} your-awesome-new-projectname`}

    `)
  }
  if (glob.sync(`${opts.name}/`).length !== 0) {
    userError(`A directory with the name ${chalk.bold(opts.name)} already exists`)
  }
  opts.logger('info', `Validated Options`)
  resolve()
})

export const copyTemplate = opts => new Promise(resolve => {
  const templateDir = path.join(__dirname, `../templates/${opts.type}`)
  const templateVars = {name: opts.name, version: VERSIONS[opts.type]}
  const targetDir = path.resolve(opts.name)
  copyTemplateDir(templateDir, targetDir, templateVars, err => {
    if (err) {
      error(err)
    }
    opts.logger('info', `Copied template to ${path.resolve(targetDir)}`)
    resolve()
  })
})

export const installAppDependencies = opts => new Promise(resolve => {
  const spinner = ora(`Installing ${PRINT_PROJ_TYPE[opts.type]} dependencies`)
  if (!opts.quiet) {
    spinner.start()
  }
  const cwd = path.resolve(opts.name)
  const cmd = 'npm install'
  exec(cmd, {cwd, stdio: 'ignore'}, err => {
    if (err) {
      error(err)
    }
    spinner.stop()
    opts.logger('info', `Installed ${PRINT_PROJ_TYPE[opts.type]} dependencies`)
    resolve()
  })
})

export const initGit = opts => new Promise(resolve => {
  const cwd = path.resolve(opts.name)
  try {
    execSync('git --version', {cwd, stdio: 'ignore'})
    execSync('git init', {cwd, stdio: 'ignore'})
    execSync('git add .', {cwd, stdio: 'ignore'})
    execSync('git commit -m "initial commit"', {cwd, stdio: 'ignore'})
  } catch (err) {
    error(err)
  }
  opts.logger('info', `Initialized a git repository`)
  resolve()
})

export const successfullyCreated = opts => {
  const npmInstall = opts.skipInstall ? ' && npm install ' : ' '
  opts.logger('info', chalk.green(`Successfully created a new ${chalk.bold(PRINT_PROJ_TYPE[opts.type])} Project`))
  opts.logger('normal', `
    ${chalk.dim('To get started run:')}

    ${chalk.cyan(`$ cd ${opts.name}${npmInstall}&& npm run dev`)}

    ${chalk.dim('Your new Project is then available @ http://localhost:3000')}
    `)
}
