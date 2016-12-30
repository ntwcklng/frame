import {execSync} from 'child_process'
import chalk from 'chalk'

export function log(type, msg) {
  if (msg && type) {
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

export function useYarn() {
  try {
    execSync('yarn --version', {stdio: 'ignore'})
    return true
  } catch (err) {
    return false
  }
}
