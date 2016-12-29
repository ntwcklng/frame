import test from 'ava'
import supportedProjects, {prettyProjects} from '../build/supported-projects'

test('every supported project should have a pretty name', async t => {
  await supportedProjects.map(proj => {
    if (!prettyProjects[proj]) {
      t.fail(`${proj} does not have a pretty name assigned`)
    }
    return t.pass()
  })
})
