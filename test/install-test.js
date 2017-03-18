/* eslint-disable import/no-unresolved, import/no-dynamic-require */
import {exec} from 'child_process'
import path from 'path'
import glob from 'glob'
import test from 'ava'
import rimraf from 'rimraf'
import temp from 'temp'
import cli from '../build/'
import {VERSIONS} from '../build/constants'

const run = opts => new Promise(async (resolve, reject) => {
  try {
    await cli({_: [opts.type, opts.targetDir], 'skip-git': true, silent: false})
    const cwd = path.resolve(process.cwd(), `./${opts.targetDir}`)
    const pkg = require(path.join(cwd, 'package.json'))
    await exec('npm run build', {cwd, stdio: 'inherit'}, () => {
      glob('**', {
        dot: true,
        cwd,
        ignore: opts.ignore
      }, (err, matches) => {
        if (err) {
          throw new Error(err)
        }
        return resolve({matches, pkg})
      })
    })
  } catch (err) {
    reject(err)
  }
})

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
test('SKIP_WATCH create a new React Project, install dependencies and build', async t => {
  const type = 'react'
  const targetDir = 'tmp-react-install'
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
  const result = await run({
    type,
    targetDir,
    ignore: ['node_modules/**']
  })
  t.deepEqual(result.matches, shouldMatch)
  t.is(result.pkg.dependencies.react, VERSIONS[type])
})

/**
* Test the Preact Project by installing all
* dependencies and running the build command
*/
test('SKIP_WATCH create a new Preact Project, install dependencies and build', async t => {
  const type = 'preact'
  const targetDir = 'tmp-preact-install'
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
  const result = await run({
    type,
    targetDir,
    ignore: ['node_modules/**']
  })
  t.deepEqual(result.matches, shouldMatch)
  t.is(result.pkg.dependencies[type], VERSIONS[type])
})

/**
* Test the Next.js Project by installing all
* dependencies and running the build command
*/
test('SKIP_WATCH create a new Next.js Project, install dependencies and build', async t => {
  const type = 'next'
  const targetDir = 'tmp-next-install'
  const shouldMatch = [
    '.next',
    '.next/commons.js',
    'package.json',
    'pages',
    'pages/index.js'
  ]
  try {
    const result = await run({
      type,
      targetDir,
      ignore: ['node_modules/**', '.next/bundles/**', '.next/dist/**']
    })
    t.deepEqual(result.matches, shouldMatch)
    t.is(result.pkg.dependencies[type], VERSIONS[type])
    return
  } catch (err) {
    throw new Error(err)
  }
})

test.after.always('cleanup', () => {
  process.chdir(origCwd)
  rimraf(tmpDir, () => {

  })
})
