module.exports = {
  endpoints: [
    {
      title: 'Hourly Events', 
      description:'Total events per hour over all dates',
      uri: '/events/hourly',
      chartType:'bar',
      exclude:['date'],
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
      description:'',
      chartType:'line',
      exclude:[],
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
      description:'Total hourly statistics over all dates',
      uri: '/stats/hourly',
      chartType:'bar',
      exclude:['date'],
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
      description:'', 
      uri: '/stats/daily',
      chartType:'line',
      exclude:[],
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