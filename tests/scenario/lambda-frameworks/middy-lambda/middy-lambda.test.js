import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setup, teardown } from '../../../_testHelpers/index.js'
import { BASE_URL } from '../../../config.js'
import installNpmModules from '../../../installNpmModules.js'

const { stringify } = JSON

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('middy with lambda', function desc() {
  before(async () => {
    await installNpmModules(resolve(__dirname, 'app'))
  })

  beforeEach(async () => {
    await setup({
      servicePath: resolve(__dirname, 'app'),
    })
  })

  afterEach(() => teardown())

  it('get', async () => {
    const url = new URL('/dev/api/info', BASE_URL)
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const response = await fetch(url, options)
    const json = await response.json()

    const expected = {
      foo: 'bar',
    }

    assert.deepEqual(json, expected)
  })

  it('post', async () => {
    const url = new URL('/dev/api/foo', BASE_URL)
    const options = {
      body: stringify({
        foo: 'bar',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }
    const response = await fetch(url, options)

    const json = await response.json()

    const expected = {
      foo: 'bar',
    }

    assert.deepEqual(json, expected)
  })
})
