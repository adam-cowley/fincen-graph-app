<template>
  <div id="map"></div>
</template>

<script>
import leaflet from "leaflet";

import { viridis as scale } from "scale-color-perceptual";

const minRadius = 10;
const maxRadius = 100;

import geoJson from "../custom.geo.json";

export default {
  props: {
    data: Array,
    onCountryClick: Function,
  },


  watch: {
    data() {
      this.draw()
    }
  },
  computed: {
    minValue() {
      return this.data.reduce(
        (acc, val) => (val.amount < acc ? val.amount : acc),
        0
      );
    },
    maxValue() {
      return this.data.reduce(
        (acc, val) => (val.amount > acc ? val.amount : acc),
        0
      );
    },
  },
  methods: {
    draw() {
      const map = L.map("map").setView([51.505, -0.09], 4);
      L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          id: "mapbox/streets-v11",
          accessToken:
            "pk.eyJ1IjoiYWRhbWNvd2xleSIsImEiOiJjazJwMjEwdXgwcDE0M2dzN3k4YnExNDZpIn0.zkBLjnorMcHvyjNGIiNp3g",
        }
      ).addTo(map);

      const filteredGeoJson = {
        type: "FeatureCollection",
        features: geoJson.features.filter((feature) => {
          return this.data.some(
            (row) => row.country.properties.code === feature.properties.adm0_a3
          );
        }),
      };

      L.geoJson(filteredGeoJson, {
        clickable: false,
        // style: myCustomStyle
        style: {
          stroke: true,
          strokeOpacity: 0.5,

          weight: 1,

          fill: true,
          fillOpacity: 0.5,
        },
        onEachFeature: (feature, layer) => {
          const row = this.data.find(
            (row) => row.country.properties.code === feature.properties.adm0_a3
          );
          // TOOD: Factor??
          const perc =
            1 -
            Math.max(
              Math.min(
                2 * Math.max(row.amount / this.maxValue, 0.2).toFixed(3),
                1
              ),
              0.1
            );

          layer.setStyle({
            color: scale(perc),
            fillColor: scale(perc),
            strokeColor: scale(perc),
          });

          layer.on({
            mouseover: () => layer.setStyle({ fillOpacity: 0.3 }),
            mouseout: () => layer.setStyle({ fillOpacity: 0.5 }),
            click: () => {
              map.fitBounds(layer.getBounds());
              this.onCountryClick(row);
            },
          });
        },
      }).addTo(map);
    },
  },
};
</script>

<style>
#map {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
