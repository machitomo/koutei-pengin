import Vue from 'vue'
import App from './App.vue'
import OnoffToggle from 'vue-onoff-toggle'

Vue.use(OnoffToggle)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
