const express = require('express')
const pg = require('pg')
const { credentials } = require('./pgCredentials.js')
const config = require('./config')
const { endpoints } = require('./endpoints')
const app = express()
const pool = new pg.Pool(credentials)

const createUserQueues = (obj) => {
  let result = {}
  for (let key in obj) {
    let child = obj[key]
    result[key] = typeof child == 'string' ? new Map() : createUserQueues(child) 
  }
  return result
}

var individualLimits = createUserQueues(endpoints)
const queryHandler = (req, res, next) => {
  addCorsHeaders(res)
  if (accept(req, res)) {
    pool.query(req.sqlQuery).then((r) => {
      return res.json(r.rows || [])
    }).catch(next)
  }
}

acceptIndividual = (req, res) => {
  let queryLog = req.limits.get(req.ip)
  if (!queryLog || req.timestamp - queryLog[0] > config.INDIVIDUAL_WINDOW - config.LENIENCY) {
    //queryLog.set(req.ip, [req.timestamp])
    queryLog = [req.timestamp]
    req.limits.set(req.ip, [req.timestamp])
  }
} 
  }
  else if (queryLog.length < config.INDIVIDUAL_MAX) {
    queryLog.push(req.timestamp)
  }
  else {
    res.status(429)
    res.send('Request limit reached for this endpoint. You may not exceed ' + config.INDIVIDUAL_MAX + ' requests to any given endpoint within a period of ' + parseInt(config.INDIVIDUAL_WINDOW / 1000) + ' seconds.')
    return false
  }
  return true
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

app.get('/:category/:specification?', (req, res, next) => {
  addCorsHeaders(res)
  req.sqlQuery = req.params.specification? endpoints[req.params.category][req.params.specification] : endpoints[req.params.category] 
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
