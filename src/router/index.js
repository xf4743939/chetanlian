import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const login = r => require.ensure([],() => require('../page/login/login.vue'),'login')

const one= r => require.ensure([],() => require('../page/activity/one.vue'),'one')

const two= r => require.ensure([],() => require('../page/activity/two.vue'),'two')

const home= r => require.ensure([],() => require('../page/home/home.vue'),'home')

const detail = r => require.ensure([],() => require('../page/mydetail/detail.vue'),'detail')

const carplate = r => require.ensure([],() => require('../page/carplate/carplate.vue'),'carplate')

const province = r => require.ensure([],() => require('../page/province/province.vue'),'province')

const city = r => require.ensure([],() => require('../page/city/city.vue'),'city')

const address = r => require.ensure([],() => require('../page/address/address.vue'),'address')

const choicetype = r => require.ensure([],() => require('../page//choicetype/choicetype.vue'),'choicetype')

const odometer = r => require.ensure([],() => require('../page//odometer/odometer.vue'),'odometer')

const reduction = r => require.ensure([],() => require('../page//reduction/reduction.vue'),'reduction')

const paymoney = r => require.ensure([],() => require('../page/paymoney/paymoney.vue'),'paymoney')


const routes= [
  {
     path:'/',
     name:'home',
     component:home,
     meta:{
       title:'车碳宝',
       keepAlive:false
     } 
  },
  {
     path:'/paymoney',
     name:'paymoney',
     component:paymoney,
     meta:{
       title:'押金付款确认',
       keepAlive:false
     }
  },
  {
    path:'/reduction',
    name:'reduction',
    component:reduction,
    meta:{
      title:'选择减排计算方式',
      keepAlive:false
    }
  },
  {
    path:'/odometer',
    name:'odometer',
    component:odometer,
    meta:{
      title:'拍照上传里程表',
      keepAlive:false
    }
  },
  {
    path:'/choicetype',
    name:'choicetype',
    component:choicetype,
    meta:{
      title:'设备押金提交方式',
      keepAlive:false
    }
  },
  {
   path:'/address',
   name:'address',
   component:address,
   meta:{
     title:"填写设备邮寄地址",
     keepAlive:false
   }
  },
  {
    path:"/province",
    name:'province',
    component:province,
    meta:{
      title:'选择省份',
      keepAlive:true
    }
  },
  {
     path:'/city',
     name:'city',
     component:city,
     meta:{
       title:'选择市',
       keepAlive:false
     }
  },
  {
    path:'/carplate',
    name:'carplate',
    component:carplate,
    meta:{
      title:'输入车牌号码',
      keepAlive:false
    }
  },
  {
    path:'/home',
    name:'home',
    component:home,
    meta:{
      title:'车碳宝',
      keepAlive:false
    } 
 },
  {
    path: '/login',
    name: 'login',
    component: login,
    meta:{
      title:'登录/注册',
      keepAlive:false
    }
  },
  {
    path:'/one',
    name:'one',
    component:one,
    meta:{
      title:'活动一:拍照参与减排',
      keepAlive:false
    }
  },
  {
    path:'/two',
    name:'two',
    component:two,
    meta:{
      title:'活动二:租赁车载wifi设备...',
      keepAlive:false
    }
  },
  {
    path:'/detail',
    name:'detail',
    component:detail,
    meta:{
      title:'我的奖励',
      keepAlive:false
    }
  }
]

const router=new Router({
  routes,
  mode:'history'
})



router.beforeEach((to,form,next) =>{
 
  document.title=to.meta.title 
  next()
})

export default router