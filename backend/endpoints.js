module.exports = {
  endpoints: [
    {
      uri:'/events/hourly',
      query:`
      SELECT date, hour, events
      FROM public.hourly_events
      ORDER BY date, hour
      LIMIT 168;
      `
    },
    {
      uri:'/events/daily',
      query:`
      SELECT date, SUM(events) AS events
      FROM public.hourly_events
      GROUP BY date
      ORDER BY date
      LIMIT 7;
      `
    },
    {
      uri:'/stats/hourly',
      query:`
      SELECT date, hour, impressions, clicks, revenue
      FROM public.hourly_stats
      ORDER BY date, hour
      LIMIT 168;
      `
    },
    {
      uri:'/stats/daily',
      query:`
      SELECT date,
          SUM(impressions) AS impressions,
          SUM(clicks) AS clicks,
          SUM(revenue) AS revenue
      FROM public.hourly_stats
      GROUP BY date
      ORDER BY date
      LIMIT 7;
      `
    },
    {
      uri:'/poi',
      query:`
      SELECT *
      FROM public.poi;
      `
    },
    
]}