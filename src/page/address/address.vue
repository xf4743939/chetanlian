<template>
    <div class="page address page_Wrap">
        <div class="address_text">
            <x-textarea placeholder="设备邮寄地址" :max="50" :min="5" v-model="address"></x-textarea>
            <!-- <textarea class="weui-textarea"  maxlength="50" minlength="5" v-model="address" placeholder="设备邮寄地址"></textarea> -->
        </div>
        <div class="btn_wrap">
             <button class="btn" @click="bind">下一步</button>
        </div>  
     
    </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex'
import {setStore} from '../../libs/util'
import {Group,XTextarea } from 'vux'
export default {
    data(){
        return {
           address:""
        }
    },
    components:{
      Group,
      XTextarea
    },
   methods: {
       ...mapMutations(['SAVEADDRESS']),
       bind(){
           if(!this.address || this.address.length<5 || this.address.length>50){
               this.$vux.toast.text('请输入5-50个字符的地址','middle')
               return;
           }
           this.$store.commit('SAVEADDRESS',this.address)
           setStore('address',this.address)
           this.$router.push({path:'/choicetype'})
       }
   }
}
</script>
<style lang="less" scoped>
  .address{
      height:100%; 
    padding-left: 0;
    padding-right: 0;
      background:#ecedef;
      .address_text{
          background: #fff;
       
        
      }
      .btn_wrap{
          margin-top: 60px;
          text-align: center;
        
          .btn{
              color: #fff;
          }
      }

  }
</style>

