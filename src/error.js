import chalk from 'chalk'

export default function error(err) {
  console.log(`> ${chalk.red('Error!')} ${err}`)
}
