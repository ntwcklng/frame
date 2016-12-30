import chalk from 'chalk'
import inquirer from 'inquirer'
import {SUPPORTED_PROJECTS, PRINT_PROJ_TYPE} from './constants'

export default function ui(opts) {
  const type = opts.type
  const prompts = [
    {
      type: 'list',
      name: 'type',
      message: 'Select a Project Type',
      when: !type,
      choices: SUPPORTED_PROJECTS.map(proj => {
        return {
          name: PRINT_PROJ_TYPE[proj],
          value: proj
        }
      })
    },
    {
      type: 'input',
      name: 'name',
      message: `Give your new ${type && chalk.cyan(PRINT_PROJ_TYPE[type] + ' ')}Project a Name`,
      filter: input => input.split(' ').join('-')
    }
  ]

  return inquirer.prompt(prompts).then(answers => Object.assign({}, opts, {type: type || answers.type, name: answers.name}))
}
