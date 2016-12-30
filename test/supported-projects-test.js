import test from 'ava'
import {SUPPORTED_PROJECTS, PRINT_PROJ_TYPE} from '../build/constants'

test('every supported project should have a pretty name', async t => {
  await SUPPORTED_PROJECTS.map(proj => {
    if (!PRINT_PROJ_TYPE[proj]) {
      t.fail(`${proj} does not have a pretty name assigned`)
    }
    return t.pass()
  })
})
