/* eslint-disable import/no-unresolved, import/no-dynamic-require */

import {exec} from 'child_process'
import path from 'path'
import glob from 'glob'
import test from 'ava'
import rimraf from 'rimraf'
import temp from 'temp'
import cli from '../build/'
import {VERSIONS} from '../build/constants'

let origCwd
let tmpDir
test.before(() => {
  origCwd = process.cwd()
  tmpDir = temp.mkdirSync('frame-new')
  process.chdir(tmpDir)
})

/**
 * Test the React Project by installing all
 * dependencies and running the build command
 */
test.cb('SKIP_WATCH create a new React project without errors and install dependencies', t => {
  const tmpDir = 'tmp-react-install'
  cli({_: ['react', tmpDir], 'skip-git': true, quiet: true}).then(proj => {
    const cwd = path.resolve(process.cwd(), `./${tmpDir}`)
    const pkg = require(path.join(cwd, `package.json`))
    exec('npm run build', {cwd, stdio: 'ignore'}, err => {
      if (err) {
        t.fail(err)
      }
      glob('**', {
        dot: true,
        cwd,
        ignore: ['node_modules/**']
      }, (err, matches) => {
        if (err) {
          t.fail(err)
        }
        const shouldMatch = [
          '.babelrc',
          '.gitignore',
          'build',
          'build/bundle.js',
          'build/bundle.js.map',
          'build/index.html',
          'package.json',
          'README.md',
          'src',
          'src/index.html',
          'src/index.js',
          'src/index.scss',
          'webpack.config.js'
        ]
        t.deepEqual(matches, shouldMatch)
        t.is(pkg.dependencies.react, VERSIONS[proj.type])
        t.is(proj.name, tmpDir)
        t.is(proj.type, 'react')
        t.end()
      })
    })
  })
})

/**
 * Test the Preact Project by installing all
 * dependencies and running the build command
 */
test.cb('SKIP_WATCH create a new Preact project without errors and install dependencies', t => {
  const tmpDir = 'tmp-preact-install'
  cli({_: ['preact', tmpDir], 'skip-git': true, quiet: true}).then(proj => {
    const cwd = path.resolve(process.cwd(), `./${tmpDir}`)
    const pkg = require(path.join(cwd, `package.json`))
    exec('npm run build', {cwd, stdio: 'ignore'}, err => {
      if (err) {
        t.fail(err)
      }
      glob('**', {
        dot: true,
        cwd,
        ignore: ['node_modules/**']
      }, (err, matches) => {
        if (err) {
          t.fail(err)
        }
        const shouldMatch = [
          '.babelrc',
          '.gitignore',
          'build',
          'build/bundle.js',
          'build/bundle.js.map',
          'build/index.html',
          'package.json',
          'README.md',
          'src',
          'src/index.html',
          'src/index.js',
          'src/index.scss',
          'webpack.config.js'
        ]
        t.deepEqual(matches, shouldMatch)
        t.is(pkg.dependencies.preact, VERSIONS[proj.type])
        t.is(proj.name, tmpDir)
        t.is(proj.type, 'preact')
        t.end()
      })
    })
  })
})

/**
 * Test the Next.js Project by installing all
 * dependencies and running the build command
 */
test.cb('SKIP_WATCH create a new Next.js project without errors and install dependencies', t => {
  const tmpDir = 'tmp-next-install'
  cli({_: ['next', tmpDir], 'skip-git': true, quiet: true}).then(proj => {
    const cwd = path.resolve(process.cwd(), `./${tmpDir}`)
    const pkg = require(path.join(cwd, `package.json`))
    exec('npm run build', {cwd, stdio: 'ignore'}, err => {
      if (err) {
        t.fail(err)
      }
      glob('**', {
        dot: true,
        cwd,
        ignore: ['node_modules/**', '.next/bundles/**', '.next/dist/**']
      }, (err, matches) => {
        if (err) {
          t.fail(err)
        }
        const shouldMatch = [
          '.next',
          '.next/commons.js',
          'package.json',
          'pages',
          'pages/index.js'
        ]
        t.deepEqual(matches, shouldMatch)
        t.is(pkg.dependencies.next, VERSIONS[proj.type])
        t.is(proj.name, tmpDir)
        t.is(proj.type, 'next')
        t.end()
      })
    })
  })
})

test.after.always('cleanup', () => {
  process.chdir(origCwd)
  rimraf(tmpDir, () => {
    return
  })
})
