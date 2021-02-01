module.exports = {
    endpoints: {
        events: {
            hourly:`
            SELECT date, hour, events
            FROM public.hourly_events
            ORDER BY date, hour
            LIMIT 168;
            `,
            daily:`
            SELECT date, SUM(events) AS events
            FROM public.hourly_events
            GROUP BY date
            ORDER BY date
            LIMIT 7;
            `
        },
        stats: {
            hourly:`
            SELECT date, hour, impressions, clicks, revenue
            FROM public.hourly_stats
            ORDER BY date, hour
            LIMIT 168;
            `,
            daily:`
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
        poi:`
        SELECT *
        FROM public.poi;
        `
    }
}