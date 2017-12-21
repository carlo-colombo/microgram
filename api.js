const https = require('https')
const querystring = require('querystring')

const request = (host, path, data) =>
  new Promise((resolve, reject) => {
    const payload = JSON.stringify(data)

    const req = https.request(
      {
        host,
        path: path,
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'Content-length': Buffer.byteLength(payload)
        }
      },
      res => {
        let content = ''
        res.setEncoding('utf8')
        res.on('data', chunk => (content += chunk))
        res.on('end', () => resolve(JSON.parse(content)), console.log(content))
      }
    )

    req.on('error', reject)

    req.write(payload)
    req.end()
  })

function apiFactory(request) {
  return class Api {
    constructor(telegram_key) {
      this.telegram_key = telegram_key
      this.hostname = 'api.telegram.org'
    }
    getUpdates(offset = 0) {
      return request(this.hostname, `/bot${this.telegram_key}/getUpdates`, {
        offset
      })
    }
    sendFullMessage(message) {
      return request(
        this.hostname,
        `/bot${this.telegram_key}/sendMessage`,
        message
      )
    }
    sendMessage(chat_id, text, options) {
      return this.sendFullMessage(Object.assign({ chat_id, text }, options))
    }
  }
}

module.exports = {
  apiFactory,
  request
}
