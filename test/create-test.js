/* eslint-disable import/no-unresolved, import/no-dynamic-require */

import path from 'path'
import test from 'ava'
import rimraf from 'rimraf'
import temp from 'temp'
import cli from '../build/'
import {VERSIONS} from '../build/constants'

let origCwd
let tmpDir

const run = args => Promise.resolve()
.then(async () => {
  try {
    await cli(args)
  } catch (err) {
    if (err.userError) {
      console.error(`> ${err.message}`)
    } else {
      console.error(`> ${err.stack}`)
    }
  }
})

test.before(() => {
  origCwd = process.cwd()
  tmpDir = temp.mkdirSync('frame-new')
  process.chdir(tmpDir)
})

test('create a new react project without errors', async t => {
  const tmpDir = 'tmp-react'
  await cli({_: ['react', tmpDir], 'skip-git': true, 'skip-install': true, silent: true}).then(proj => {
    const pkg = require(path.resolve(process.cwd(), `./${tmpDir}/package.json`))
    t.is(pkg.dependencies.react, VERSIONS[proj.type])
    t.is(proj.name, tmpDir)
    t.is(proj.type, 'react')
  })
})

test('create a new preact project without errors', async t => {
  const tmpDir = 'tmp-preact'
  await cli({_: ['preact', tmpDir], 'skip-git': true, 'skip-install': true, silent: true}).then(proj => {
    const pkg = require(path.resolve(process.cwd(), `./${tmpDir}/package.json`))
    t.is(pkg.dependencies.preact, VERSIONS[proj.type])
    t.is(proj.name, tmpDir)
    t.is(proj.type, 'preact')
  })
})

test('create a new Next.js project without errors', async t => {
  const tmpDir = 'tmp-next'
  await cli({_: ['next', tmpDir], 'skip-git': true, 'skip-install': true, silent: true}).then(proj => {
    const pkg = require(path.resolve(process.cwd(), `./${tmpDir}/package.json`))
    t.is(pkg.dependencies.next, VERSIONS[proj.type])
    t.is(proj.name, tmpDir)
    t.is(proj.type, 'next')
  })
})

test('should exit when an invalid project type is passed', async t => {
  try {
    await run({_: ['invalid', 'tmp-no-exist']})
  } catch (err) {
    const firstLine = err.message.split('\n')[0]
    t.is(firstLine, 'invalid is not a valid FRAME project type')
  }
})

test.after.always('cleanup', () => {
  process.chdir(origCwd)
  rimraf(tmpDir, () => {

  })
})
