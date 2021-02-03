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
    markers() {
      return this.pois.map(o => ({
        id:o.events.toString(),
        position: {
          lat:o.poi.lat,
          lng:o.poi.lon
        }
      }))
    },
    mapConfig() {
      return {
        ...mapSettings,
        center: this.mapCenter
      };
    },

    mapCenter() {
      return this.markers[1].position;
    }
  }
};
</script>
