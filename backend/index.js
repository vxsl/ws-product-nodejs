const express = require('express')
const pg = require('pg')
const { credentials } = require('./pgCredentials.js')
const config = require('./config')
const { endpoints } = require('./endpoints')
const app = express()
const pool = new pg.Pool(credentials)

var ipMap = new Map()

const queryHandler = (req, res, next) => {
  addCorsHeaders(res)
  if (accept(req, res)) {
    pool.query(req.sqlQuery).then((r) => {
      return res.json(r.rows || [])
    }).catch(next)
  }
}

accept = (req) => {
  let timestamp = Date.now()
  let ip = req.ip
  let queryLog = ipMap.get(ip)
  if (!queryLog || timestamp - queryLog[0] > config.THROTTLE_WINDOW_MS - config.LENIENCY_MS) {
    ipMap.set(ip, [timestamp])
  }
  else if (queryLog.length < config.THROTTLE_MAX_REQUESTS) {
    queryLog.push(timestamp)
  }
  else return false
  return true
}

addCorsHeaders = (res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
} 

app.get('/', (req, res) => {
  addCorsHeaders(res)
  if (accept(req)) {
    res.send('Welcome to EQ Works 😎')
  }
  else {
    res.status(429)
    res.send()
  }
})

app.get('/events/hourly', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, hour, events
    FROM public.hourly_events
    ORDER BY date, hour
    LIMIT 168;
  `
  return next()
}, queryHandler)

app.get('/events/daily', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, SUM(events) AS events
    FROM public.hourly_events
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `
  return next()
}, queryHandler)

app.get('/stats/hourly', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, hour, impressions, clicks, revenue
    FROM public.hourly_stats
    ORDER BY date, hour
    LIMIT 168;
  `
  return next()
}, queryHandler)

app.get('/stats/daily', (req, res, next) => {
  req.sqlQuery = `
    SELECT date,
        SUM(impressions) AS impressions,
        SUM(clicks) AS clicks,
        SUM(revenue) AS revenue
    FROM public.hourly_stats
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `
  return next()
}, queryHandler)

app.get('/poi', (req, res, next) => {
  req.sqlQuery = `
    SELECT *
    FROM public.poi;
  `
  return next()
}, queryHandler)

app.listen(process.env.PORT || 5555, (err) => {
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
