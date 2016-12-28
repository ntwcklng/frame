import inquirer from 'inquirer'
import supportedProjects, {prettyProjects} from './supportedProjects'

export default function ui (spinner) {
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

  return inquirer.prompt(prompts).then(answers => Object.assign({}, {type: answers.type, name: answers.name, spinner}))
}
