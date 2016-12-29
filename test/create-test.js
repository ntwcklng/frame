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
test('create a new react project without errors', async t => {
  await cli({_: ['react', 'tmp-react'], 'skip-git': true, 'skip-install': true}).then(proj => {
    t.is(proj.name, 'tmp-react')
    t.is(proj.type, 'react')
  })
})
test('create a new preact project without errors', async t => {
  await cli({_: ['preact', 'tmp-preact'], 'skip-git': true, 'skip-install': true}).then(proj => {
    t.is(proj.name, 'tmp-preact')
    t.is(proj.type, 'preact')
  })
})
test('create a new Next.js project without errors', async t => {
  await cli({_: ['next', 'tmp-next'], 'skip-git': true, 'skip-install': true}).then(proj => {
    t.is(proj.name, 'tmp-next')
    t.is(proj.type, 'next')
  })
})
test('should exit when an invalid project type is passed', t => {
  return cli({_: ['invalid', 'tmp-no-exist']}).catch(err => {
    if (err) {
      const firstLine = err.message.split('\n')[0]
      t.is(firstLine, 'invalid is not a valid FRAME project type')
    } else {
      t.fail('No errors?')
    }
  })
})
test.after.always('cleanup', () => {
  process.chdir(origCwd)
  rimraf(tmpDir, () => {
    return
  })
})
