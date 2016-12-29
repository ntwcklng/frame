import test from 'ava'
import rimraf from 'rimraf'
import temp from 'temp'
import cli from '../build/'

let origCwd
let tmpDir
test.before(() => {
  origCwd = process.cwd()
  tmpDir = temp.mkdirSync('frame-new')
  process.chdir(tmpDir)
})
test.serial('create a new react project without errors', async t => {
  await cli({_: ['react', 'tmp-react'], 'skip-git': true}).then(proj => {
    t.is(proj.name, 'tmp-react')
    t.is(proj.type, 'react')
  })
})
test.serial('create a new preact project without errors', async t => {
  await cli({_: ['preact', 'tmp-preact'], 'skip-git': true}).then(proj => {
    t.is(proj.name, 'tmp-preact')
    t.is(proj.type, 'preact')
  })
})
test.after.always('cleanup', () => {
  process.chdir(origCwd)
  rimraf(tmpDir, () => {
    return
  })
})
