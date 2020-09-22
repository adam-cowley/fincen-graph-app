<template>
  <div id="app">
    <neo4j-connect v-if="!connected" password="neo" :onConnect="onConnect" />
    <div class="app" v-else>
      <navigation />
      <div class="main">
        <router-view />
      </div>

    <!-- <div class="loading" v-else-if="loading" />
    <div v-else>

      <!-- <div style="position:absolute; top:0; right: 0; z-index: 10000; background: #fff">{{ selected }}</div> -
czxaa
      <Map :data="data" :onCountryClick="onCountryClick" />




      <SelectedCountry v-if="selected" :country="selected.country" />







    </div> -->
    </div>
  </div>
</template>

<script>
import Navigation from './components/Navigation'
import Map from './components/Map'
import Key from './components/Key'
import SelectedCountry from './components/SelectedCountry'

export default {
  name: 'App',
  components: {
    Navigation,
    Map,
    Key,
    SelectedCountry
  },
  data: () => ({
    connected: false,
  }),
  methods: {
    onConnect() {
        this.connected = true
    }
  }



}
</script>

<style>
.app {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.secondary.pointing.menu {
  display: flex;
  flex-grow: 0;
  width: 100%;
  margin-bottom: 0 !important;
}
.main {
  display: flex;
  background: #f2f2f2;
  flex-grow: 1;
  position :relative;
}
</style>