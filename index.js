const http = require('http')
const url = require('url')
const moment = require('moment')

function createCorrectDate(dateStr) {
  if (/^\d+$/.test(dateStr)) {
    return new Date(Number(dateStr))
  }

  if (/^[A-Z][a-z]+\s\d{1,2},\s\d{4}/.test(dateStr)) {
    return Date.parse(dateStr)
  }

  return undefined
}

function formResponse(reqDate) {
  if (reqDate === '/') {
    return { unix: null, natural: null }
  }

  const date = createCorrectDate(decodeURI(reqDate.slice(1)))

  if (date) {
    return {
      unix: date.valueOf(),
      natural: moment(date).format('LL')
    }
  }

  return { unix: null, natural: null }
}

exports.server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  const date = url.parse(req.url).pathname

  res.end(JSON.stringify(formResponse(date)))
})
