import test from 'ava'
import cli from '../lib/cli'
import rimraf from 'rimraf'
import temp from 'temp'

let origCwd
let tmpDir
test.before(t => {
  origCwd = process.cwd()
  tmpDir = temp.mkdirSync('frame-new')
  process.chdir(tmpDir)
})
test.serial('create a new react project without errors', t => {
  return cli(['react', 'tmp-react']).then(proj => {
    t.is(proj.name, 'tmp-react')
    t.is(proj.type, 'react')
  })
})
test.serial('create a new preact project without errors', t => {
  return cli(['preact', 'tmp-preact']).then(proj => {
    t.is(proj.name, 'tmp-preact')
    t.is(proj.type, 'preact')
  })
})

test.after.always('cleanup', t => {
  process.chdir(origCwd)
  rimraf(tmpDir, () => {
    return
  })
})
