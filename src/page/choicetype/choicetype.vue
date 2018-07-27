<template>
    <div class="pay_container page_Wrap">
          <div class="pay_money">
               <div class="pay_sale">
                   <span>{{fee}}</span>
                   <span>元</span>
               </div>
               <div class="pay_real">
                   <p class="line"></p>
                   <p>原价200.00元</p>
               </div>
          </div>
          <div class="types">
              <div class="type1 type" @click="choice(1)">
              支持支付宝/微信支付设备押金,押金共计80元.使用满一年后押金即可提现,车载WIFI设备您可保留,继续使用“车碳宝”APP仍可获得现金和碳积分奖励.
              </div>
          </div>
         <div class="types" v-if="false">
              <div class="type2 type" @click="choice(2)">
                 采用租赁贷方式代为支付押金.
              </div>
          </div>
        
    </div>
</template>
<script>
import { mapMutations} from 'vuex'
import { getGameTwoFee} from '../../libs/api'
import{setStore} from '../../libs/util.js'
export default {
    data(){
        return{
           fee:0
        }
    },
    methods: {
        ...mapMutations(['SAVECHOICETYPE']),
       choice(index){
           const that=this
         this.$store.commit('SAVECHOICETYPE',{type:index,fee:that.fee})
            setStore('choiceType',index)
            setStore('fee',that.fee)
            this.$router.push({path:'/paymoney'})
         
       },
     async getGameTwoFee(){
         let res= await getGameTwoFee()
             debugger
         if(res && res.success){
            this.fee=res.result
         }else{
             this.$vux.toast.text(res.error.message,'middle')
         }
     }
    },
    mounted () {
        this.getGameTwoFee()
    }   
}
</script>
<style lang="less" scoped>
   .pay_container{
       padding-left: 0;
       padding-right: 0;
       .pay_money{
           margin-top: 30px;
         .pay_sale{
             text-align: center;
             span:nth-child(1){
                 color: #f41f1f;
                 font-size: 33px;
                 margin-right: 10px;
                 display: inline-flex;
             }
             span:nth-child(2){
                 color: #333;
                 font-size: 14px;
             }
         }
         .pay_real{
             text-align: center;
             display: -webkit-flex;
             display: flex;
             justify-content: center;
             align-items: center;
             .line{
                 height: 2px;
                 background: #999;
                 width: 110px;
                 position: absolute;
             }
             span:nth-child(2){
                 color: #333;
                 z-index: 99;
             }
         }  
       }
        .types{
             padding-left: 20px;
             padding-right: 20px;
             position: relative;
              margin-top: 30px;
              margin-bottom: 35px;
            .type{
                border: 1px solid #4eb248;
                border-radius: 8px;
                padding: 24px 15px 25px 15px;
                margin-bottom: 10px;
                height:80px;  
            }
            .type1:before{
                content: '自付';
                width:44px;      
                padding-left: 4px;
                padding-right:4px;
                position: absolute;
                top: -10px;
                color: #4eb248;
                background: #fff;
                font-size: 15px;     
            }
             .type2:before{
                content: '租赁贷';
                width:50px;      
                padding-left: 4px;
                padding-right:4px;
                color: #4eb248;
                position: absolute;
                top:-10px;
                background: #fff;
                font-size: 15px;     
            }
          
        }
     
      
   }
</style>


