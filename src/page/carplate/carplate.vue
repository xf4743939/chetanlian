<template>
    <div class="carplate_container ">
      <group class="group">
          <router-link to="/province">{{ city }}</router-link>
          <input type="text" maxlength="6" v-model="cardNo">
       
      </group>
    
        <div class="btn_wrap">
            <button class="btn"  @click="upDateBrand">确认</button>
        </div>   
    </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex'
import {updateCarBLInfoByMe} from '../../libs/api'
import {setStore} from '../../libs/util'
import {Group,XInput} from 'vux'

export default {
    data(){
        return {     
             cardNo:''
        }
    },
    components:{
        Group,
        XInput
    },
    computed: {
        ...mapState(['city','userInfo','type'])
    },
    methods:{
        ...mapMutations(['SAVECARNO','SAVEUSERINFO','GETCITY']),
        async upDateBrand(){
        
           if(!this.cardNo || this.cardNo.length==0){
               this.$vux.toast.text('请输入车牌','middle')
               return;
           }       
            let carNoText=(this.city + this.cardNo).toUpperCase();           
            let data={
                carNo:carNoText
            }
            if(this.type==1) {
                  let res= await updateCarBLInfoByMe(data)
                    if(res && res.success){
                           this.$router.replace({path:'/detail'})
                    
                    }else{
                       this.$vux.toast.text(res.error.message,'middle')
                    }     
            }else{
                 this.$store.commit('SAVECARNO',carNoText)
                 setStore('carNo',carNoText)
                 this.$router.push({path:'/reduction'}) 
            }
        },
        initData(){
           
          if(this.userInfo && this.userInfo.carNo){
              let city=this.userInfo.carNo.substring(0,2)
              this.$store.commit('GETCITY',city)
              this.cardNo=this.userInfo.carNo.substring(2)
          }
        },
      
    },
    mounted () {
        this.initData()
      
    }
    
}
</script>
<style lang="less">
   .carplate_container{
       background:#ecedef;
       position: fixed;
       width: 100%;
       height: 100%;
    
        box-sizing: border-box;
    
       .weui-cells{
           padding-left: 10px;
           padding-bottom: 10px;
           height:200px;
           display: flex;
           display: -webkit-flex;
           justify-content: flex-start;
           align-items: flex-end;
           a{
               color: #4eb248;
               height: 30px;
               line-height: 30px;
           }
         input{
           height: 18px;
            margin-bottom: 5px;
            width: 200px;
            outline: 0;
            border: 0;
            padding-left: 5px;
            font-size: 15px;
         }
       }
       .btn_wrap{
           margin-top: 80px;
           text-align: center;
           .btn{
               color: #fff;
           }
       }
   }
</style>
