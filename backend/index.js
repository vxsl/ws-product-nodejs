// third-party imports
const express = require('express')
const pg = require('pg')
// local imports
const { endpoints } = require('./endpoints')
const config = require('./config')

const app = express()
const pool = new pg.Pool()

const createUserQueues = (obj) => {
  let result = {}
  for (let key in obj) {
    let t = typeof obj[key]
    result[key] = t == 'string' || t == 'function' ? new Map() : createUserQueues(obj[key]) 
  }
  return result
}

var overallLimits = new Map()
var individualLimits = createUserQueues(endpoints)

const queryHandler = (req, res, next) => {
  if (isLocal(req) || 
  (acceptOverall(req, res) && acceptIndividual(req, res))) {
    pool.query(req.sqlQuery).then((r) => {
      return res.json(r.rows || [])
    }).catch(next)
  }
}

isLocal = (req) => {
  if (config.LOCALHOST.includes(req.ip)
    && !parseInt(req.query.limit)) {
      return true
  }
  return false
}

acceptIndividual = (req, res) => {
  
  let queryLog = req.limits.get(req.ip)
  if (!queryLog || req.timestamp - queryLog[0] > config.INDIVIDUAL_WINDOW - config.LENIENCY) {
    queryLog = [req.timestamp]
    req.limits.set(req.ip, [req.timestamp])
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

acceptOverall = (req, res) => {
  let queryLog = overallLimits.get(req.ip)
  if (!queryLog || req.timestamp - queryLog[0] > config.OVERALL_WINDOW - config.LENIENCY) {
    overallLimits.set(req.ip, [req.timestamp])
  }
  else if (queryLog.length < config.OVERALL_MAX) {
    queryLog.push(req.timestamp)
  }
  else {
    res.status(429)
    res.send('Overall request limit reached. You may not exceed a total of ' + config.OVERALL_MAX + ' requests to this server within a period of ' + parseInt(config.OVERALL_WINDOW / 1000) + ' seconds.')
    return false
  }
  return true
}

app.get('/favicon.ico', (req, res) => {
  res.status(404)
  res.send()
})

app.get('/:category/:specification?/:poi?', (req, res, next) => {
  req.timestamp = Date.now()
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  let cat = req.params.category
  let spec = req.params.specification
  let poi = req.params.poi
  if (spec) {
    req.sqlQuery = endpoints[cat][spec](poi)
    req.limits = individualLimits[cat][spec]
  }
  else {
    req.sqlQuery = endpoints[cat]
    req.limits = individualLimits[cat]
  }
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
