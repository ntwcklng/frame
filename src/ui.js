import inquirer from 'inquirer'
import supportedProjects, {prettyProjects} from './supported-projects'

export default function ui(opts) {
  const prompts = [
    {
      type: 'list',
      name: 'type',
      message: 'Select a Project Type',
      choices: supportedProjects.map(proj => {
        return {
          name: prettyProjects[proj],
          value: proj
        }
      })
    },
    {
      type: 'input',
      name: 'name',
      message: 'Give your new Project a Name',
      filter: input => input.split(' ').join('-')
    }
  ]

  return inquirer.prompt(prompts).then(answers => Object.assign({}, opts, {type: answers.type, name: answers.name}))
}
