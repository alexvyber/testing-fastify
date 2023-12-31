'use strict'

const t = require('tap')
const tap = t
const { buildApp } = require('./helper')

// const dockerHelper = require('./helper-docker')
// const docker = dockerHelper()
// const { Containers } = dockerHelper

// t.before(async function before() {
//   await docker.startContainer(Containers.mongo)
// })

// t.teardown(async () => {
//   await docker.stopContainer(dockerHelper.Containers.mongo)
// })

tap.test('the alive route is online', async (tap) => {
  const app = await buildApp(tap, {
    MONGO_URL: 'mongodb://localhost:27017/basis-test-db'
  })
  const response = await app.inject({
    method: 'GET',
    url: '/'
  })

  tap.same(response.json(), { root: true })
})

t.test('the application should start', async (t) => {
  const app = await buildApp(t, {
    MONGO_URL: 'mongodb://localhost:27017/basis-test-db'
  })

  await app.ready()
  t.pass('the application is ready')
})

t.test('the application should not start', async (mainTest) => {
  mainTest.test('if there are missing ENV vars', async (t) => {
    try {
      await buildApp(t, {
        NODE_ENV: 'test',
        MONGO_URL: undefined
      })
      t.fail('the server must not start')
    } catch (error) {
      t.ok(error, 'error must be set')
      t.match(error.message, "required property 'MONGO_URL'")
    }
  })

  mainTest.test('when mongodb is unreachable', async (t) => {
    try {
      await buildApp(t, {
        NODE_ENV: 'test',
        MONGO_URL: 'mongodb://localhost:33333/test'
      })
      t.fail('the server must not start')
    } catch (error) {
      t.ok(error, 'error must be set')
      t.match(error.message, 'connect ECONNREFUSED')
    }
  })
})
