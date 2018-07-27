<template>
    <div class="pay_container page_Wrap">
        <detail-modal v-if="isShow" :isSHow="isShow" :payInfo="payInfo" v-on:hideModal="hideModal"></detail-modal>
          <div class="pay_money">
               <div class="pay_sale">
                   <span>{{ fee }}</span>
                   <span>元</span>
               </div>
               <div class="pay_real">
                   <p class="line"></p>
                   <p>原价200.00元</p>
               </div>
          </div>
          <div class="pay_types">
              <div class="title">付款方式</div>
              <div class="pay_item">
                  <div class="pay_name">
                    <img src="../../../static/images/wx.png">
                    <span>微信支付</span>
                  </div>
                  <div>
                       <!-- <checkbox-group @change="changewx">
                        <label class="weui-cell weui-check__label">
                            <checkbox class="weui-check"  :checked="checked" />
                            <div class="weui-cell__hd weui-check__hd_in-checkbox">
                                <icon class="weui-icon-checkbox_circle" type="circle" size="23" v-if="!checked"></icon>
                                <icon class="weui-icon-checkbox_success" type="success" size="23" v-if="checked"></icon>
                            </div>
                        </label>
                      </checkbox-group> -->
                  </div>
                  
              </div>
              <div class="pay_item">
                  <div class="pay_name">
                      <img src="../../../static/images/zhifubao.png">
                     <span>支付宝支付</span>
                  </div>
                   <div>
                        <!-- <checkbox-group @change="changezf">
                                <label class="weui-cell weui-check__label">
                                    <checkbox class="weui-check"  :checked="zfchecked" />
                                    <div class="weui-cell__hd weui-check__hd_in-checkbox">
                                        <icon class="weui-icon-checkbox_circle" type="circle" size="23" v-if="!zfchecked"></icon>
                                        <icon class="weui-icon-checkbox_success" type="success" size="23" v-if="zfchecked"></icon>
                                    </div>
                                </label>
                        </checkbox-group> -->
                   </div>       
              </div>
          </div>
          <div class="pay_tip">
               <h3>付款说明</h3>
               <p>1.付款对象为深圳碳链技术股份有限公司.</p>
               <p>2.付款用途为“车碳宝”车载WIFI设备租用押金.</p>
            
          </div>
           <div class="btn_wrap">
                    <button class="btn" @click="confirm">确认</button>
          </div>
   
    </div>
</template>
<script>
import { mapState,mapMutations } from 'vuex'
import detailModal from '../../components/detailModal'
import{getStore,setStore} from '../../libs/util.js'
export default {
    data(){
        return{
           checked:true,
           zfchecked:false,
           isShow:false,
           gameFeePayType:0,//支付方式
           payInfo:null //支付的信息传给modal 
        }
    },
    components: {
        detailModal
    },
    computed: {
      ...mapState(['fee','carNo','schem','address','gameFeeChoiceType'])  
    },
    methods: {
          hideModal(){
            this.isShow=false;     
        },
        changewx(){
            if(this.checked){
                return;
            }
            this.checked=!this.checked;
            this.zfchecked=false
        },
        changezf(){
            if(this.zfchecked){
                return;
            }
            this.zfchecked=!this.zfchecked
            this.checked=false
        },
        initData(){
            if(!this.fee){
             
                const fee=getStore('fee')
             
                if(fee){
                  this.$store.state.fee=fee
                }
            }
            if(!this.carNo || this.carNo.length==0){
                const carNo=getStore('carNo')   
                if(carNo){
                     this.$store.state.carNo=carNo
                  
                }
            }
              if(!this.schem){
                const schem=getStore('schem')
                if(schem){
                     this.$store.state.schem=schem
                }
            }
              if(!this.address && this.address.length==0){
                const address=getStore('address')
                if(address){
                     this.$store.state.address=address         
                }
            }
              if(!this.gameFeeChoiceType){
                const gameFeeChoiceType=getStore('choiceType')
                if(gameFeeChoiceType){
                     this.$store.state.gameFeeChoiceType=gameFeeChoiceType
                }
            }
          
        },
        confirm(){
            const that=this
            if(this.zfchecked){
                this.gameFeePayType=2
            }
            if(this.checked){
                this.gameFeePayType=1
            }
            this.payInfo={
                schem:that.schem,
                fee:that.fee,
                gameFeeChoiceType:that.gameFeeChoiceType,
                address:that.address,
                carNo:that.carNo.toUpperCase(),
                gameFeePayType:that.gameFeePayType
            }
            this.isShow=true
        }
    },
    mounted () {
        this.initData()
        
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
       .pay_types{
           margin-top: 40px;
           padding-left: 20px;
           padding-right: 20px;
           .title{
               font-size: 16px;
               margin-bottom: 25px;
           }
           .pay_item{
               display: flex;
               display: -webkit-flex;
               justify-content: space-between;
               align-items: center;
               border-bottom: 1px solid #efefef;
               padding:5px 0; 
               .pay_name{
                   line-height: 30px;
                   display: flex;
                   display: -webkit-flex;
                   justify-content: flex-start;
                   align-items: center;
                   
               }
               img{
                   width:23px;
                   height:23px;
               
                   margin-right: 15px;
               }
               span{
                   height:100%;
                   color: #000;
               }
               .weui-cell{
                   padding-right: 0;
               }
           }
       }
       .pay_tip{
           padding: 0 20px;
           margin-top: 15px;
           h3{
               color: #333;
               margin-bottom: 5px;
           }
           p{
               color: #333;
           }
       }
       .btn_wrap{
           margin-top: 30px;
           text-align: center;
           .btn{
               color: #fff;
           }
       }
   }
</style>


