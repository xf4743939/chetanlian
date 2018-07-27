// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import FastClick  from 'fastclick'
import store from './store/index'
import * as types from './store//mutation-type'
import { AlertPlugin, ToastPlugin,  WechatPlugin, DevicePlugin } from 'vux'

Vue.use(DevicePlugin)
Vue.use(WechatPlugin)
// Vue.use(AjaxPlugin)
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)

FastClick.attach(document.body);

Vue.config.productionTip = false



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  mounted(){
    
    this.$store.commit(types.UPDATE_DEVICE,{isAndroid:Vue.device.isAndroid})
  }
})
