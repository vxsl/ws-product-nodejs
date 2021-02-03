const moment = require("moment");

export default {
  name: 'dataOperations',
  methods: {
    // ex. for '/hourly/events,' we want to ignore the 'day' field and generate data that shows us how
    // many events occurred at a given hour, regardless of the day. This requires significant manipulation
    // of the original data.
    groupData(groupBy, dataKeys, dataSource) {
      let result = [];
      let groups = new Set(); // ensure uniqueness of each group by collecting in a Set
      for (let obj of dataSource) {
        let el;
        let groupName = obj[groupBy];

        // locate element or create if does not exist, assign to 'el'
        if (groups.has(groupName)) {
          el = result.find((obj) => obj[groupBy] == groupName);
        } else {
          groups.add(groupName);
          el = {
            [groupBy]: groupName,
          };
          result.push(el);
        }

        // sum values of duplicate fields
        for (let k of dataKeys) {
          el[k] = el[k] ? el[k] + parseFloat(obj[k]) : parseFloat(obj[k]);
        }
      }
      return result;
    },
    groupDataForMap(groupBy, dataSource, parameter) {
      let result = [];
      for (let obj of dataSource) {
        let groupName = obj[groupBy];
        if (result[groupName]) {
          result[groupName] += parseFloat(obj[parameter])
        } else {
          result[groupName] = parseFloat(obj[parameter])
        }
      }
      return result;
    },
    parse(key, value) {
      let parser = this.endpoint.xAxis.config.time.parser;
      let format = this.endpoint.xAxis.config.time.displayFormats[key];
      return moment(value, parser).format(format);
    },
  }
}

