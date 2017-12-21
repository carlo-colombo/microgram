const nock = require('nock')

const { request } = require('../api.js')

describe('request', () => {
  it('makes post request', async () => {
    const server = nock(/https.*/)
      .matchHeader('accept', 'application/json')
      .post('/endpoint', { data: 42 })
      .reply(200, { ok: true })

    const req = request('www.example.com', '/endpoint', {
      data: 42
    })

    should(await req).has.property('ok', true)

    return should(req).be.fulfilled()
  })

  it('reject promise if request return an error', async () => {
    const server = nock(/https.*/)
      .post('/endpoint', { data: 42 })
      .replyWithError({ ok: false })

    const req = request('https://www.example.com', '/endpoint', { data: 42 })
    try {
      await req
    } catch (resp) {
      should(resp).has.property('ok', false)
    }

    return should(req).be.rejected()
  })
})
