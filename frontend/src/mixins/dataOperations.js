const moment = require("moment");

export default {
  name: 'dataOperations',
  methods: {
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
        for (let key of dataKeys.filter(k => !this.endpoint.exclude.includes(k))) {
          el[key] = el[key] ? el[key] + parseFloat(obj[key]) : parseFloat(obj[key]);
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

