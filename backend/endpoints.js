module.exports = {
    endpoints: {
        events: {
            hourly(poi=null) {
                if (!poi) {
                    return `
                    SELECT date, hour, events
                    FROM public.hourly_events
                    ORDER BY date, hour
                    LIMIT 168;
                    `
                }
                else {
                    return `
                    SELECT date, hour, events
                    FROM public.hourly_events
                    WHERE poi_id = ` + poi +
                    ` ORDER BY date, hour
                    LIMIT 168;
                    `
                }
            },
            daily(poi=null) {
                if (!poi) {
                    return `
                    SELECT date, SUM(events) AS events
                    FROM public.hourly_events
                    GROUP BY date
                    ORDER BY date
                    LIMIT 7;
                    `
                }
                else {
                    return `SELECT date, SUM(events) AS events
                    FROM public.hourly_events
                    WHERE poi_id = ` + poi + 
                    ` GROUP BY date, poi_id
                    ORDER BY date
                    `
                }
            }
        },
        stats: {
            hourly(poi=null) {
                if (!poi) {
                    return `
                    SELECT date, hour, impressions, clicks, revenue
                    FROM public.hourly_stats
                    ORDER BY date, hour
                    LIMIT 168;
                    `
                }
                else {
                    return `
                    SELECT date, hour, impressions, clicks, revenue
                    FROM public.hourly_stats
                    WHERE poi_id = ` + poi +
                    ` ORDER BY date, hour
                    LIMIT 168;
                    `
                }
            },
            daily(poi=null) {
                if (!poi) {
                    return `
                    SELECT date,
                        SUM(impressions) AS impressions,
                        SUM(clicks) AS clicks,
                        SUM(revenue) AS revenue
                    FROM public.hourly_stats
                    GROUP BY date
                    ORDER BY date
                    LIMIT 7;
                    `
                }
                else {
                    return `
                    SELECT date,
                        SUM(impressions) AS impressions,
                        SUM(clicks) AS clicks,
                        SUM(revenue) AS revenue
                    FROM public.hourly_stats
                    WHERE poi_id = ` + poi +
                    ` GROUP BY date, poi_id
                    ORDER BY date
                    `
                }
            }
        },
        poi:`
        SELECT *
        FROM public.poi;
        `
    }
}