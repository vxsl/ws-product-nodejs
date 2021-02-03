<template>
  <div class="padded" id="geo-outer-container">
    <b-col sm='3' id="control-box">
      <b-card id="query-options">
        <span class="control-label">Select a dataset to visualize</span>
        <b-form-checkbox
            class="btn" 
            v-for="endpoint in endpoints" 
            :key="endpoint.title" 
            v-model="selectedEndpoint" 
            :value="endpoint.uri"
            button
        >
            {{ endpoint.title }}
        </b-form-checkbox>
      </b-card>
      <b-card id="frequency-slider">
          <span class="control-label">Individual request frequency</span>
          <b-form-input 
              type="range"
          />
      </b-card>
    </b-col>
    <b-col sm='9' id="map-container">
      <gmaps-map id="map">
        <gmaps-marker v-for="p in poi" :key="p.poi_id" :position="{ lat: p.lat, lng: p.lon }" />
      </gmaps-map>
    </b-col>
  </div>
</template>

<script>
const axios = require("axios");

import { gmapsMap, gmapsMarker } from "x5-gmaps";

export default {
  components: {
    gmapsMap,
    gmapsMarker,
  },
  props: {
    endpoints: Array,
  },
  data() {
    return {
      poi: Array,
      selectedEndpoint:Object
    };
  },
  mounted() {
    this.requestPOI();
  },
  methods: {
    async requestPOI() {
      this.poi = await axios.get("/poi").then((r) => r.data);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/custom.scss";

#geo-outer-container {
  width:100%;
  min-height:93vh;
  padding-top:3em;
  padding-bottom:3em;
  display:flex;
}
#map {
  width: 100%;
  border-radius:1em !important;
  overflow:hidden;
}

#map-container {
  width:100%;
}

#sidebar {
  border-radius:1em;
  padding:1em;
  #endpoint-select-container {
    width:100%;
    padding:1em;
    margin-bottom:1em;
    #endpoint-select-button {
      background:$medium-grey-color;
      border:none;
      width:100%;
      margin-bottom:1em;
      padding:1em;
    }
    #endpoint-select {
      background:$light-grey-color;
      border-radius:1em;
      #endpoint-select-content {
        padding:1em;
        p {
          margin-bottom:1em;
        }
      }
    }
  }
}
</style>