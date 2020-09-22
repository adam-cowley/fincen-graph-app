import Vue from 'vue'
import VueNeo4j from 'vue-neo4j'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

import 'leaflet/dist/leaflet.css'

Vue.use(VueNeo4j)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
