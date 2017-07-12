const http = require('http')
const fs = require('fs')
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
  if (reqDate === '') {
    return { unix: null, natural: null }
  }

  const date = createCorrectDate(decodeURI(reqDate))

  if (date) {
    return {
      unix: date.valueOf(),
      natural: moment(date).format('LL')
    }
  }

  return { unix: null, natural: null }
}

function sendResponse(res) {
  return (err, data) => {
    if (err) {
      res.writeHead(500)
      return res.end()
    }

    res.write(data)
    res.end()
  }
}

exports.server = http.createServer((req, res) => {
  const date = url.parse(req.url).pathname.match(/^\/api\/(.*)$/)

  if (date === null) {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    return fs.readFile('./public/index.html', 'utf-8', sendResponse(res))
  }

  const data = JSON.stringify(formResponse(date[1]))

  res.setHeader('Content-Type', 'text/html')
  res.writeHead(200, {
    'Content-Length': Buffer.byteLength(data),
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff'
  })

  res.write(data)
  res.end()
})
