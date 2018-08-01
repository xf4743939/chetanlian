<template>
    <div class="activity page_Wrap">
     
       <div class="activity_img">
           <img src="../../../static/images/banner3.png">
       </div>
       <div class="activity_rules">      
           <div class="rules">
                <p>1.登记您的车牌号码,填写邮寄地址.支付押金获取“车碳宝”车载WIFI设备,与APP绑定后,装上爱车,即刻开始您的减排积分之旅.</p>
                <p>2.共有两种减排计算方式可供您自主选择,分别为按驾驶里程计算和按停驶天数计算.</p>
                <p>3.“车碳宝”能识别您健康的驾驶行为,规范行驶一定里程可获得正向碳积分,开车也能享受积分收益.</p>
                <p>4.碳积分可在系统商城内兑换奖品,亦可按照一定比例兑换成现金奖励.</p>
           </div>
       </div>
       <div class="btn_wrap">
           <button @click="join" class="btn1" :class="{ 'active' : !disabled }" >{{btnTxt}}</button>
       </div>
    </div>
</template>
<script>

import { gameListType} from '../../libs/constants'
import {mapState,mapMutations} from 'vuex'

export default {
    data(){
        return{
            btnTxt:'我要参加',
            disabled:false
        }
    },
    computed:{
      ...mapState(['isLogin','userInfo'])  
    },
    methods: {
        ...mapMutations(['UPDATETYPE']),
        join(){  
            if(this.disabled){
                return ;
            }  
            this.$store.commit('UPDATETYPE',2)   
             if(!this.isLogin){
                 this.$router.push({path:'/login'})
             }else{    
                 if(this.userInfo.carNo && this.userInfo.carNo.length){
                      this.$router.push({path:'/reduction'})
                 }else{
                      this.$router.push({path:'/carplate'})
                 }          
             }
        },
          getData(){
             if(this.isLogin){
                 if(this.userInfo && this.userInfo.gameListType==gameListType.two){
                        this.disabled=true
                        this.btnTxt='已参加'
                 }
             }
        }
    },
    mounted () {
        this.getData()
    }
}
</script>
<style lang="less" scoped>
 @import '../../libs/activity';
</style>


