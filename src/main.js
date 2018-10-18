// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Popover from 'vue-js-popover'
import VueQrcode from '@xkeshi/vue-qrcode'

Vue.use(Popover)

Vue.component(VueQrcode.name, VueQrcode)

Vue.config.productionTip = false

// filters

Vue.filter('toXrp', function (value) {
  if (typeof value !== 'number') {
    return value
  }
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal', // currency, percent, decimal
    // currency: 'USD', //only needed if style = currency
    maximumFractionDigits: 6
  })
  return formatter.format(value)
})

Vue.filter('toDecimal', function (value) {
  if (typeof value !== 'number') {
    return value
  }
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal', // currency, percent, decimal
    // currency: 'USD', //only needed if style = currency
    maximumFractionDigits: 6

  })
  return formatter.format(value)
})

Vue.filter('toDecimal2', function (value) {
  if (typeof value !== 'number') {
    return value
  }
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal', // currency, percent, decimal
    // currency: 'USD', //only needed if style = currency
    maximumFractionDigits: 2

  })
  return formatter.format(value)
})

Vue.filter('toDecimal4', function (value) {
  if (typeof value !== 'number') {
    return value
  }
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal', // currency, percent, decimal
    // currency: 'USD', //only needed if style = currency
    maximumFractionDigits: 4,
    minimumFractionDigits: 4

  })
  return formatter.format(value)
})


Vue.filter('hex2Ascii', function (value) {
  var hex = value.toString()// force conversion
  var str = ''
  for (var i = 0; i < hex.length; i += 2) { str += String.fromCharCode(parseInt(hex.substr(i, 2), 16)) }
  return str
})

Vue.filter('abrevNum', function (value) {
  let abrv
  let newvalue
  value = Number(value)

  switch (true) {
    case value >= 1000000000 : abrv = ' B'; newvalue = value / 1000000000
      break
    case value >= 1000000 : abrv = ' M'; newvalue = value / 1000000
      break
    case value >= 1000 : abrv = ' K'; newvalue = value / 1000
      break
    default:abrv = ''; newvalue = value
  }

  var formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal', // currency, percent, decimal
    // currency: 'USD', //only needed if style = currency
    maximumFractionDigits: 1,
    minimumFractionDigits: 1
  })

  newvalue = formatter.format(newvalue)

  newvalue = newvalue.toString()

  newvalue = newvalue + abrv

  return newvalue
})




/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
