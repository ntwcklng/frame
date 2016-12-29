import chalk from 'chalk'

export default function error(err) {
  console.error(`> ${chalk.red('Error!')} ${err}`)
}
