/* adapted from https://vuejs.org/v2/cookbook/practical-use-of-scoped-slots.html */
<template>
  <GoogleMapLoader
    :mapConfig="mapConfig"
    apiKey="AIzaSyC5n1w_QbIWwUZkBgD6fVVvyN9gEDkaFAQ"
  >
    <template slot-scope="{ google, map }" >
      <GoogleMapMarker
        v-for="marker in markers"
        :key="marker.id"
        :marker="marker"
        :google="google"
        :map="map"
      />
    </template>
  </GoogleMapLoader>
</template>

<script>
import GoogleMapLoader from "./GoogleMapLoader";
import GoogleMapMarker from "./GoogleMapMarker";
import { mapSettings } from "./constants/mapSettings";
import { getCenterOfBounds } from 'geolib';

export default {
  components: {
    GoogleMapLoader,
    GoogleMapMarker,
  },
  props: {
    pois: {
      type:Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  computed: {
    dataKey() {
      return Object.keys(this.pois[0])[1]
    },
    max() {
      let m = this.pois[0][this.dataKey]
      for (let p of this.pois) {
        if (p[this.dataKey] > m) {
          m = p[this.dataKey]
        }
      }
      return m
    },
    min() {
      let m = this.pois[0][this.dataKey]
      for (let p of this.pois) {
        if (p[this.dataKey] < m) {
          m = p[this.dataKey]
        }
      }
      return m
    },
    markers() {
      return this.pois.map(o => ({
        position: {
          lat:o.poi.lat,
          lng:o.poi.lon
        },
        intensity:parseFloat((o[this.dataKey] - this.min) / this.max),
        value:o[this.dataKey] 
      }))
    },
    mapConfig() {
      return {
        ...mapSettings,
        center: this.mapCenter
      };
    },
    mapCenter() {
        let result = getCenterOfBounds(this.pois.reduce((points, o) => {
          points.push({
            latitude:o.poi.lat,
            longitude:o.poi.lon
          })
          return points
        },[]))
        return {
          lat:result.latitude,
          lng:result.longitude
        }
    }
  }
};
</script>

<style lang="scss">
.marker {
  display:none !important;
  * {
    display:none !important;
  }
}
title {
  display:none !important;
}
</style>