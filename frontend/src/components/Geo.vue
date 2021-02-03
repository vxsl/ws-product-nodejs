<template>
  <div class="padded" id="geo-outer-container">
    <div class="w-100 row">
      <b-col sm='3' id="control-box">
        <b-card id="query-options">
          <span class="control-label">Select a dataset to visualize</span>
          <div id="blocker" v-if="loading"/>
          <span
          v-for="e in endpoints" 
          :key="e.title">
            <b-form-checkbox
              class="btn" 
              v-model="endpoint" 
              :value="e"
              button
            >
            {{ e.title }}
            </b-form-checkbox>
            <span
            class="metrics" 
            v-if="endpoint == e && showMetrics && e.map.metrics.length > 1">
              <b-form-radio-group>
                <b-form-radio
                  v-for="(m, index) in e.map.metrics"
                  class="btn monospace"
                  v-model="metricIndex"
                  ref="metricRadio"
                  :key="index"
                  :value="index"
                >
                  {{ m.toUpperCase() || '' }}
                </b-form-radio>
              </b-form-radio-group>
            </span>
          </span>
        </b-card>
        <div v-if="loading" class="spinner-splash d-flex justify-content-center align-items-center">
          <div class="spinner-inner-container text-light">
            <b-spinner/>
            <span class="break-here"></span>
            <p class="lead">LOADING</p>
          </div>
        </div>
        <b-card v-else id="frequency-slider">
            <span class="monospace control-label">{{domain.key.toUpperCase() || ''}}</span>
            <b-form-input 
                type="range"
                v-model="domain.currentIndex"
                :min="domain.min"
                :max="domain.max"
            />
            <span>{{parse(domain.key, domain.arr[domain.currentIndex])}}</span>
        </b-card>
      </b-col>
      <b-col sm='9' id="map-container">
        <PoiMap 
        v-if="!loading"
        class="map"
        :key="domain.arr[domain.currentIndex]"
        :pois='activePois'
        />
      </b-col>
    </div>
  </div>
</template>

<script>
// third-party requirements
const axios = require("axios");

// local imports
import dataOperations from '@/mixins/dataOperations.js'
import PoiMap from './map/PoiMap.vue';

export default {
  components: {
    PoiMap,
  },
  mixins:[dataOperations],
  props: {
    endpoints: Array,
  },
  data() {
    return {
      endpoint:Object,
      metric:Object,
      metricIndex:0,
      pois:Array,
      poiIds:Array,
      dataSources:[],
      summedData:[],
      domain: {
        arr:Array,
        currentIndex:0,
        key:String,
        value:Object,
        min:Number,
        max:Number
      },
      ready:false,
      loading:true
    };
  },
  mounted() {
    this.endpoint = this.endpoints[2]
    this.createMap()
  },
  watch: {
    metricIndex() {
      this.createMap()
    },
    endpoint() {
      this.metricIndex = 0
      this.createMap()
    }
  },
  computed: {
    showMetrics() {
      return this.endpoint.map.metrics.length > 1
    },
    activePois() {
      let result = []
      console.log(this.metricIndex)
      for (let id in this.pois) {
        if (this.summedData[id]) {
          let key = this.endpoint.map.metrics[this.metricIndex]
          let value = this.summedData[id][this.domain.arr[this.domain.currentIndex]]
          if (value) {
            result.push({
              poi:this.pois[id],
              [key]:value
            })
          }
        }
      }
      return result
    }
  },
  methods: {
    async createMap() {
      this.loading = true
      this.pois = await this.getPois()
      this.poiIds = this.pois.map(o => o.poi_id)

      this.summedData = []

      for (let id in this.poiIds) {
        this.dataSources[id] = await this.request(parseInt(id)+1);
        this.summedData.push(this.groupDataForMap(this.endpoint.map.domain, this.dataSources[id], this.endpoint.map.metrics[this.metricIndex]))
      }

      this.domain.key = this.endpoint.map.domain
      this.domain.arr = Object.keys(this.summedData[0])
      this.domain.min = Object.keys(this.summedData)[0][0]
      this.domain.max = Object.keys(this.summedData[0])[Object.keys(this.summedData[0]).length - 1]

      this.loading = false
    },
    async getPois() {
      let result = await axios.get('/poi').then((r) => r.data)
      return result
    },
    async request(id) {
      return await axios.get(this.endpoint.uri + '/' + id).then((r) => r.data);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/custom.scss";

.spinner-splash {
  background:transparent;
  border:solid;
  border-radius:2px;
  border-color:$dark-color;
  user-select:none;
  flex-wrap:wrap;
  width:100%;
  max-height:93vh;
  padding-top:3em;
  padding-bottom:3em;
  border-radius:1em !important;
  z-index:3;
  .spinner-inner-container {
    text-align:center;
    color:$dark-color  !important;
    p {
      padding:1em;
      margin:0;
    }
    .break-here {
      flex-basis:100%
    }
  }
}

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
  border-radius:2em;
  overflow: hidden;
  padding:0;
  height:100%;
  z-index:4;
  .map {
    height:100%;
  }
}

#query-options {
  .metrics {
    display:flex;
    flex-direction:column;
    padding-left:10%;
    padding-right:10%;
  font-size:0.9em;
  }
}
#blocker {
  width:100%;
  height:100%;
  z-index:2;
  opacity:0;
  background:$medium-grey-color;
  position:absolute;
  border-top-right-radius:2em;
  border-bottom-right-radius:2em;
  border-top-left-radius:0.3em;
  border-bottom-left-radius:0.3em;
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