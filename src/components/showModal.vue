<template>
    <div>
    <div class="modal-mask" @click="hideModal" v-if="isSHow" @catchtouchmove="preventTouchMove" ></div>
        <div class="modal-dialog" v-if="isSHow">
            <div class="modal-title">{{title}}</div>
            <div class="modal-content">
                <div>
                   恭喜您注册成功，同时赠送您<span style="color:#4ed248;">200</span>个碳积分 
                </div>       
            </div>
            <div class="modal-footer">
                <!-- <div class="btn-cancel" @click="onCancel" data-status="cancel">取消</div> -->
                <div class="btn-confirm" @click="onConfirm" data-status='confirm'>前往登录>></div> 
            </div>
        </div>
    </div>
    
</template>
<script>
export default {
    data(){
        return{
            showModal:false,
            title:"注册成功",
        }
    },
    props: ['isSHow'],
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
            this.hideModal(); 
            this.$router.go(0)
         }    
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
      width: 270px;
      overflow: hidden;
      position: fixed;
      top:50%;
      left:0;
      z-index: 9999;
      background: #f9f9f9;
      margin: -90px 53px;
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
  }
  .modal-footer {
    display: flex;
    flex-direction: row;
    height: 43px;
    border-top: 1px solid #dedede;
    font-size: 17px;
    line-height: 43px;
}
// .btn-cancel {
//   width: 50%;
//   color: #666;
//   text-align: center;
//   border-right: 1px solid #dedede;
// }

.btn-confirm {
  width: 100%;
  color: #4ed248;
  text-align: center;
}
</style>

