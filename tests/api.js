const should = require('should')
const { apiFactory } = require('../api.js')
const sinon = require('sinon')
const { map, noop } = require('lodash')

describe('api-telegram', () => {
  describe('Api', () => {
    let request, api
    beforeEach(() => {
      request = sinon.spy()
      api = new (apiFactory(request))('-token')
    })
    describe('#getUpdates', () => {
      it('make a request to endpoint with offset == 0', () => {
        api.getUpdates()

        sinon.assert.calledWith(
          request,
          api.hostname,
          '/bot-token/getUpdates',
          { offset: 0 }
        )
      })
      it('make a request to endpoint with specified offset', () => {
        api.getUpdates(42)

        sinon.assert.calledWith(
          request,
          api.hostname,
          '/bot-token/getUpdates',
          { offset: 42 }
        )
      })
    })

    describe('#sendMessage', () => {
      it('makes a request to the proper endpoint', () => {
        api.sendMessage(1234, 'a text', { option: true })

        sinon.assert.calledWith(
          request,
          api.hostname,
          '/bot-token/sendMessage',
          { chat_id: 1234, text: 'a text', option: true }
        )
      })
    })

    describe('#sendFullMessage', () => {
      it('makes a request to the proper endpoint', () => {
        api.sendFullMessage({ chat_id: 1234, text: 'a text', option: true })

        sinon.assert.calledWith(
          request,
          api.hostname,
          '/bot-token/sendMessage',
          { chat_id: 1234, text: 'a text', option: true }
        )
      })
    })

    describe('#getFile', () => {
      it('makes a request to proper endpoint', async () => {
        request = sinon.stub()
        request.returns(Promise.resolve({ result: { file_path: 'fooPath' } }))
        api = new (apiFactory(request))('-token')
        const fileUrl = await api.getFile('file-id')

        should(fileUrl).be.eql(`https://${api.hostname}/file/bot-token/fooPath`)

        sinon.assert.calledWith(
          request,
          api.hostname,
          '/bot-token/getFile?file_id=file-id',
          {}
        )
      })
    })
  })
})
