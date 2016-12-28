import chalk from 'chalk'
const log = console.log
const logError = console.error

const messages = {
  // messages modifier
  success (msg) { log(chalk.green(msg)) },
  info (msg) { log(chalk.blue(msg)) },
  fail (msg) { log(chalk.red(msg)) },
  error (msg) { logError(chalk.red(msg)) },

  // messages printer
  printSuccessMessage (name) {
    log('\n' +
    chalk.dim('To get started just run\n\n') +
    ` $ cd ${name} && npm start\n\n` +
    `Your App is now avaiable at http://localhost:8080\n`
    )
  }
}

export default messages
