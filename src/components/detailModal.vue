<template>
    <div>
    <div class="modal-mask" @click="hideModal" v-if="isSHow" @catchtouchmove="preventTouchMove" ></div>
        <div class="modal-dialog" v-if="isSHow">
            <div class="modal-title">{{title}}</div>
            <div class="modal-content">
                <div class="item">
                    <span>车牌</span>
                    <span class="item_val">{{ payInfo.carNo }}</span>
                </div>
                <div class="item">
                    <span>减排计算方式</span>
                    <span class="item_val">{{ payInfo.schem==1 ? '按里程计算' : '按停驶天数计算' }}</span>
                </div>
                <div class="item">
                    <span>设备邮寄地址</span>
                    <span class="item_val " id="item_address">{{ payInfo.address }}</span>
                </div>
                <div class="item">
                    <span>押金提交方式</span>
                    <span class="item_val">{{ payInfo.gameFeeChoiceType==1 ? '自费' : '租赁贷' }}</span>
                </div>
                <div class="item">
                    <span>押金付款方式</span>
                    <span class="item_val">{{ payInfo.gameFeePayType==1 ? '微信' : '支付宝' }}</span>
                </div>
                <div class="item">
                    <span>押金金额</span>
                    <span class="item_val" style="color:#f41f1f">{{ payInfo.fee }}元</span>
                </div>             
            </div>
            <div class="modal-footer">
                <div class="btn-cancel" @click="onCancel" data-status="cancel">取消</div>
                <div class="btn-confirm" @click="onConfirm" data-status='confirm'>确认并付款</div> 
            </div>
        </div>
    </div>
    
</template>
<script>
import { applyGameTwo } from '../libs/api'

export default {
    data(){
        return{
            showModal:false,
            title:"活动二详情"
        }
    },

    props: ['isSHow','payInfo'],
    methods: {
       preventTouchMove(){
        },
        hideModal(){
           this.$emit('hideModal')
        },
         onCancel() {
           this.hideModal();
         },
         onConfirm() {     
            this.payMoney()
         }, 
        async payMoney(){
            const that=this;
            let data=this.payInfo
            let res= await applyGameTwo(data)
        
            if(res && res.success){
                let data=JSON.parse(res.result);
                let appid=data.appid
                let timestamp=''+ data.timestamp
                let nonceStr=  data.noncestr
                let packages='prepay_id='+ data.prepayid
                let keys="gS8NoVGODkOCtuEisN8ZmN6qeSbSF4y9";
                const str=`appid=${appid}&nonceStr=${nonceStr}&package=prepay_id=${data.prepay_id}&signType=MD5&timeStamp${timestamp}&key=${keys}`
                let paysign=md5(str).toUpperCase()     
                console.log(paysign)          
                this.$wechat.chooseWXPay({
                    'timeStamp':timestamp,
                    'nonceStr': nonceStr,
                    'package': packages,
                    'signType': 'MD5',
                    'paySign':paysign,
                    'success':function(res){
                       that.$vux.toast.text('支付成功')
                       that.$vux.toast.show({
                           text:'支付成功',
                           onShow(){

                           },
                           onHide(){
                               that.hideModal()
                           }
                       })
                    
                    },
                    'fail':function(res){  
                           that.$vux.toast.show({
                           text:res.errMsg,
                           onShow(){

                           },
                           onHide(){
                               that.hideModal()
                           }
                       })                  
                     },        
                    })     
            }else{
                this.hideModal()
                this.$vux.toast.text(res.error.message,'middle')
            }
        }   
    },
    mounted () {
       
    }
}
</script>
<style lang="less" scoped>
  .modal-mask{
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      background: #000;
      opacity:0.5;
      overflow: hidden;
      z-index: 9000;
      color: #fff;
  }
  .modal-dialog{
      width:300px;
      overflow: hidden;
      position: fixed;
      top:50%;
      left:50%;
      z-index: 9999;
      background: #f9f9f9;
      margin: -210px -150px;
      border-radius: 9px;
  }
  .modal-title{
      padding-top: 25px;
      font-size: 18px;
      color: #030303;
      text-align: center;
  }
  .modal-content{
      padding: 25px 16px;
      .item{
          margin-bottom: 15px;
          display:flex;
          display: -webkit-flex;
          justify-content: space-between;
          align-items: center;
          .item_val{
              color:#4eb248;        
          }
          span:nth-of-type(2){
              width:160px;
              text-align: right;
              overflow: hidden;
              white-space: nowrap;
              text-overflow:ellipsis;
          }
        
      }
  }
  #item_address{
              width: 160px;
              white-space:normal;
             word-wrap:break-word;
              max-height: 130px
  }
  .modal-footer {
    display: flex;
    flex-direction: row;
    height: 43px;
    border-top: 1px solid #dedede;
    font-size: 17px;
    line-height: 43px;
}
.btn-cancel {
  width: 50%;
  color: #666;
  text-align: center;
  border-right: 1px solid #dedede;
}

.btn-confirm {
  width: 50%;
  color: #4ed248;
  text-align: center;
}
</style>

