import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/routes/Home'
import Chord from '@/routes/Chord'

Vue.use(VueRouter)


const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/chord', name: 'chord', component: Chord },
]

export default new VueRouter({
    routes,
})