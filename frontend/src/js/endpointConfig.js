module.exports = {
  endpoints: [
    {
      title: 'Hourly Events', 
      uri: '/events/hourly',
      chartType:'bar',
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
      xAxis:{
        key:'date',
        group:false,
        config: {
          type:'time',
          time: {
            unit:'day',
            displayFormats: {
              'day':'MMM D, YYYY'
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
      xAxis:{
        key:'date',
        group:false,
        config: {
          type:'time',
          time: {
            unit:'day',
            displayFormats: {
              'day':'MMM D, YYYY'
            },
            parser:'YYYY-MM-DDTHH:mm:ss.SSS'
          }
        }
      } 
    }
  ]
}