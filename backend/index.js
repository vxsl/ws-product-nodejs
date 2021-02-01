const express = require('express')
const pg = require('pg')
const { credentials } = require('./pgCredentials.js')
const config = require('./config')
const { endpoints } = require('./endpoints')
const app = express()
const pool = new pg.Pool(credentials)

var ipMap = new Map()
var endpointMap = new Map()
for (let e of endpoints) {
  endpointMap.set(e.uri, e.query)
}

const queryHandler = (req, res, next) => {
  addCorsHeaders(res)
  if (accept(req, res)) {
    pool.query(req.sqlQuery).then((r) => {
      return res.json(r.rows || [])
    }).catch(next)
  }
}

addCorsHeaders = (res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
} 

accept = (req, res) => {
  let timestamp = Date.now()
  let ip = req.ip
  let queryLog = ipMap.get(ip)
  if (!queryLog || timestamp - queryLog[0] > config.THROTTLE_WINDOW_MS - config.LENIENCY_MS) {
    ipMap.set(ip, [timestamp])
  }
  else if (queryLog.length < config.THROTTLE_MAX_REQUESTS) {
    queryLog.push(timestamp)
  }
  else {
    res.status(429)
    res.send()
    return false
  }
  return true
}

app.get('*', (req, res, next) => {
  addCorsHeaders(res)
  req.sqlQuery = endpointMap.get(req.url)
  return next()
}, queryHandler)

app.listen(process.env.PORT || config.CUSTOM_PORT, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    console.log(`Running on ${process.env.PORT || config.CUSTOM_PORT}`)
  }
})

// last resorts
process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`)
  process.exit(1)
})
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  process.exit(1)
})
