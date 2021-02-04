// third-party requirements
const express = require('express')
const pg = require('pg')
// local imports
const { endpoints } = require('./endpoints')
const config = require('./config')

const app = express()
const pool = new pg.Pool()

// recursive algorithm for creating a replica of some object,
// but with all String or Function values replaced with a Map 
const createUserQueues = (obj) => {
  let result = {}
  for (let key in obj) {
    let t = typeof obj[key]
    result[key] = t == 'string' || t == 'function' ? new Map() : createUserQueues(obj[key]) 
  }
  return result
}

// initialize the limit queues
var overallLimits = new Map()
var individualLimits = createUserQueues(endpoints)

// make the PostgreSQL query and respond to the client with the result,
// unless one or both of the following conditions is true:
//
//  - the request is determined to be local
//  - the request violates one or both rate limit rules
const queryHandler = (req, res, next) => {
  if (isLocal(req) || 
  (acceptOverall(req, res) && acceptIndividual(req, res))) {
    pool.query(req.sqlQuery).then((r) => {
      return res.json(r.rows || [])
    }).catch(next)
  }
}

// determine if the request appears to have originated from localhost.
// If this is true but the client wants to be rate-limited, they can 
// include the GET parameter '?limit=1' to be treated as a non-local client.
isLocal = (req) => {
  if (config.LOCALHOST.includes(req.ip)
    && !parseInt(req.query.limit)) {
      return true
  }
  return false
}

// determine whether the request should be denied based on 
// the discrete rate limit. Requests in excess of config.INDIVIDUAL_MAX
// during a period of config.INDIVIDUAL_WINDOW will be denied.
acceptIndividual = (req, res) => {
  // get the discrete-limit queue corresponding to the client's IP 
  let queryLog = req.limits.get(req.ip)
  if (!queryLog || req.timestamp - queryLog[0] > config.INDIVIDUAL_WINDOW - config.LENIENCY) {
    // if the queue is empty, or if the window has finished, initialize the queue.
    req.limits.set(req.ip, [req.timestamp])
  }
  else if (queryLog.length < config.INDIVIDUAL_MAX) {
    // otherwise, if there is space in the queue, push this request's timestamp 
    queryLog.push(req.timestamp)
  }
  else {
    // otherwise, deny the request 
    res.status(429)
    res.send('Request limit reached for this endpoint. You may not exceed ' + config.INDIVIDUAL_MAX + ' requests to any given endpoint within a period of ' + parseInt(config.INDIVIDUAL_WINDOW / 1000) + ' seconds.')
    return false
  }
  return true
}

// determine whether the request should be denied based on 
// the discrete rate limit. Requests in excess of config.INDIVIDUAL_MAX
// during a period of config.INDIVIDUAL_WINDOW will be denied.
acceptOverall = (req, res) => {
  // get the global-limit queue corresponding to the client's IP 
  let queryLog = overallLimits.get(req.ip)
  if (!queryLog || req.timestamp - queryLog[0] > config.OVERALL_WINDOW - config.LENIENCY) {
    // if the queue is empty, or if the window has finished, initialize the queue.
    overallLimits.set(req.ip, [req.timestamp])
  }
  else if (queryLog.length < config.OVERALL_MAX) {
    // otherwise, if there is space in the queue, push this request's timestamp 
    queryLog.push(req.timestamp)
  }
  else {
    // otherwise, deny the request 
    res.status(429)
    res.send('Overall request limit reached. You may not exceed a total of ' + config.OVERALL_MAX + ' requests to this server within a period of ' + parseInt(config.OVERALL_WINDOW / 1000) + ' seconds.')
    return false
  }
  return true
}

// deny all requests for favicon.ico
app.get('/favicon.ico', (req, res) => {
  res.status(404)
  res.send()
})

// handle GET requests with the following parameters:
// [:category] -- i.e. poi, stats, events
// [:specification] -- OPTIONAL -- i.e. daily, hourly
// [:poi] -- OPTIONAL -- i.e. 1, 2, 3
//
// Providing the poi parameter joins the poi_id column with the existing query. 
app.get('/:category/:specification?/:poi?', (req, res, next) => {
  req.timestamp = Date.now()
  // add CORS headers to the response so that we may use this API in-browser
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  // handle request, then pass to queryHandler
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
