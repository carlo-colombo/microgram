const https = require('https')

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
    constructor(telegramKey) {
      if (!telegramKey){
        throw 'invalid token, empty or null'
      }
      this.telegramKey = telegramKey
      this.hostname = 'api.telegram.org'
    }
    getUpdates(offset = 0) {
      return request(this.hostname, `/bot${this.telegramKey}/getUpdates`, {
        offset
      })
    }
    sendFullMessage(message) {
      return request(
        this.hostname,
        `/bot${this.telegramKey}/sendMessage`,
        message
      )
    }
    sendMessage(chat_id, text, options) {
      return this.sendFullMessage(Object.assign({ chat_id, text }, options))
    }
    getFile(file_id) {
      return request(
        this.hostname,
        `/bot${this.telegramKey}/getFile?file_id=${file_id}`,
        {}
      ).then(
        ({ result: { file_path } }) =>
          `https://${this.hostname}/file/bot${this.telegramKey}/${file_path}`
      )
    }
  }
}

module.exports = {
  apiFactory,
  request
}
