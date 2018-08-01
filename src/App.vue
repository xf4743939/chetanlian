<template>
  <div id="app">
    <loading v-model="isLoading" loading="false" :text="text"></loading>
      <keep-alive>
        <transition name="slide-fade">
             <router-view v-if="$route.meta.keepAlive" ></router-view>
        </transition>
      </keep-alive>
      <transition  name="slide-fade">
         <router-view v-if="!$route.meta.keepAlive" ></router-view>
      </transition>
  </div>
</template>

<script>
import {Loading} from 'vux'
import {mapState} from 'vuex';
import {getStore} from '../src/libs/util'
import { getCurrentLoginInfo,createWxMenu} from '../src/libs/api'
export default {
  name: 'App',
  data(){
      return{
        
      }
  },
   created () {
  
     let token=getStore('authToken');
      if(!token){
        this.$store.commit('LOGINSTATUS',false)
      }else{
          this.$store.commit('LOGINSTATUS',true);
          if(!this.userInfo){
             this.getUserInfo()
          }       
      }  
  },
  components:{
    Loading
  },
  computed:{
    ...mapState(['isLoading','isLogin','userInfo','text','isAndroid'])
  },
   methods:{
      async getUserInfo(){
         let res = await getCurrentLoginInfo()
         if(res && res.success){
              let userInfo=res.result;
               this.goToUrl(userInfo)
              this.$store.commit('SAVEUSERINFO',userInfo)
         }else {
            this.$vux.toast.show({
              text:res.error.message,
              type:'warn'
            })
         }
     },
     goToUrl(info){
    
        if(info.gameListType==2 || info.gameListType==1){
           this.$router.push({path:'/detail'})
        }
     },
    async createWxMenu(){
       let res=await createWxMenu();
      
       if(res && res.success){
          console.log(res.result)
       }else{
          this.$vux.toast.text(res.error.message,'middle')
       }
     }
  },
  mounted(){
    
    let data={
      IsIos:this.isAndroid
    };
        //  this.createWxMenu(data)
  }

}
</script>

<style lang="less">
 @import '~vux/src/styles/reset.less';
  @import '~vux/src/styles/1px.less';
 @import '~vux/src/styles/close.less';
 @import '../src/libs/common.less';
  
  /*视图动画*/
 
.slide-fade-enter-active {
  transition: all 1.2s ease;
}
 .slide-fade-leave-active {

  transition: all .1s cubic-bezier(2.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to
{
  left:0;right: 0;
  transform: translateX(50px);
  opacity: 0;
}
</style>
