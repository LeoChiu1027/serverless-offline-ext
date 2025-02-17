import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setup, teardown } from '../../../_testHelpers/index.js'
import { BASE_URL } from '../../../config.js'
import installNpmModules from '../../../installNpmModules.js'

const { stringify } = JSON

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('apollo server lambda graphql', function desc() {
  before(async () => {
    await installNpmModules(resolve(__dirname, 'app'))
  })

  beforeEach(async () => {
    await setup({
      servicePath: resolve(__dirname, 'app'),
    })
  })

  afterEach(() => teardown())

  it('apollo server lambda tests', async () => {
    const url = new URL('/dev/graphql', BASE_URL)

    const response = await fetch(url, {
      body: stringify({
        query: `query test {
          hello
        }`,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const json = await response.json()

    const expected = {
      data: {
        hello: 'Hello graphql!',
      },
    }

    assert.deepEqual(json, expected)
  })
})
