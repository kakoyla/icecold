// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Popover from 'vue-js-popover'
import VueQrcode from '@xkeshi/vue-qrcode'

Vue.use(Popover)

Vue.component(VueQrcode.name, VueQrcode)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
