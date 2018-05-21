// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueHighcharts from 'vue-highcharts';
import Highcharts from 'highcharts'
import stockInit from 'highcharts/modules/stock'
import axios from 'axios';
import Buefy from 'buefy';
import 'buefy/lib/buefy.css'


 
stockInit(Highcharts)
Vue.use(VueHighcharts,{Highcharts});
Vue.use(Buefy);
Vue.use(require('vue-moment'));

Vue.prototype.$axios = axios;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
