/* adapted from https://vuejs.org/v2/cookbook/practical-use-of-scoped-slots.html */
<template id="marker">
    <div/>
</template>

<script>
//import { POINT_MARKER_ICON_CONFIG } from "./constants/mapSettings";
import colors from '@/scss/custom.scss'
export default {
  props: {
    google: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
    marker: {
      type: Object,
      required: true
    }
  },

  mounted() {
    const { Marker } = this.google.maps;

    new Marker({
      position: this.marker.position,
      marker: this.marker,
      map: this.map,
      icon: {
        path: "M 0, 0 m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0",
        fillColor:colors.tertiaryColor,
        strokeWeight: 0,
        fillOpacity: 1,
        scale: this.marker.intensity * 10
      }
    });
  },

};
</script>