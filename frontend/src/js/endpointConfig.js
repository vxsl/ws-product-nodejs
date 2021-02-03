module.exports = {
  endpoints: [
    {
      title: 'Hourly Events', 
      uri: '/events/hourly',
      chartType:'bar',
      map: {
        domain:'hour',
        metrics:['events']
      },
      xAxis:{
        key:'hour',
        group:true,
        config: {
          type:'time',
          time: {
            unit:'hour',
            displayFormats: {
              'hour':'hA'
            },
            parser:'HH'
          }
        }
      } 
    },
    { 
      title: 'Daily Events', 
      uri: '/events/daily',
      chartType:'line',
      map: {
        domain:'date',
        metrics:['events']
      },
      xAxis:{
        key:'date',
        group:false,
        config: {
          type:'time',
          time: {
            unit:'day',
            displayFormats: {
              'day':'MMM D, YYYY',
              'date':'MMM DD, YYYY',
            },
            parser:'YYYY-MM-DDTHH:mm:ss.SSS'
          }
        }
      } 
    },
    { 
      title: 'Hourly Statistics', 
      uri: '/stats/hourly',
      chartType:'bar',
      map: {
        domain:'hour',
        metrics:['impressions','clicks','revenue']
      },
      xAxis:{
        key:'hour',
        group:true,
        config: {
          type:'time',
          time: {
            unit:'hour',
            displayFormats: {
              'hour':'hA'
            },
            parser:'HH'
          }
        }
      } 
    },
    { 
      title: 'Daily Statistics', 
      uri: '/stats/daily',
      chartType:'line',
      map: {
        domain:'date',
        metrics:['impressions','clicks','revenue']
      },
      xAxis:{
        key:'date',
        group:false,
        config: {
          type:'time',
          time: {
            unit:'day',
            displayFormats: {
              'day':'MMM D, YYYY',
              'date':'MMM DD, YYYY',
            },
            parser:'YYYY-MM-DDTHH:mm:ss.SSS'
          }
        }
      } 
    }
  ]
}