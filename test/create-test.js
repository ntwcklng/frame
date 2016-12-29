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
test('should exit when a wrong project type is given', async t => {
  await cli({_: ['I_DONT_EXIST', 'tmp-no-exist']}).catch(err => {
    if (err) {
      const firstLine = err.message.split('\n')[0]
      t.is(firstLine, '> Error! i_dont_exist is not a valid FRAME project type')
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
