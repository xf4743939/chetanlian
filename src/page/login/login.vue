<template>
    <div class="login_wrap page page_Wrap">    
       <show-modal v-if="isShow" :isSHow="isShow" v-on:hideModal="hideModal"></show-modal>
        <div class="login_logo">
           <div class="logo">
               <img src="../../../static/images/logo.png" alt="">
           </div>
        </div>
        <div class="login_main">
            <div class="btn_type">
                <span class="btnLogin" :class="loginOrRegister ? 'active' : '' "  @click="btnclick(true)">登录</span>
                <span class="btnLogin" :class="!loginOrRegister ? 'active' : '' "  @click="btnclick(false)">注册</span>
            </div>     
            <div  v-if="loginOrRegister" class="login_group">
                <group>
                    <x-input type="tel" placeholder="输入手机号码" @on-change="isDisable"  maxlength="11" :show-clear="false" v-model="loginForm.phoneNumber"  class="input_number"></x-input>               
                    <x-input placeholder="输入登录密码" type="password" @on-change="isDisable" :show-clear="false" class="input_password" v-model="loginForm.password"></x-input>
                    <div class="line"></div>
                        <div class="btn_wrap">
                            <button class="btn1" v-bind:disabled="disableLoginBtn" :class="disableLoginBtn ? 'disBtn' : 'activeCode' "  @click="login">登录</button>
                        </div>   
                </group>
            
            </div>  
            <div class="weui-cells_form" v-else>
                <div class="weui-cell">
                        <input class="weui-input" type="tel" maxlength="11" @on-change="disable" v-model="register.phoneNumber" placeholder="输入手机号码"/>
                </div>
                <div class="weui-cell">
                        <input type="password" class="weui-input"  @on-change="disable" v-model="register.password" placeholder="输入注册密码"/>  
                </div>
                <div class="weui-cell code_wrap">
                   <input type="text" class="weui-input"  @on-change="disable" v-model="register.code" placeholder="输入验证码"/>
                   <button class="btn1" :class="currentTime==61 ? 'activeCode': 'disBtn' "  id="codeBtn"  @click="getVerificationCode" v-bind:disabled="currentTime<61">{{time}}</button>
                </div>
                <div class="weui-cell">
                </div>
                 <div class="register_server">
        
                  <check-icon :value.sync="checked"></check-icon>
                  <div class="rules"><span>同意《</span><a style="color:#4eb248;" href="/pages/terms/terms">使用条款及隐私</a><span>》</span></div>
                </div>        
                 <div class="btn_wrap">
                    <button  class="btn1" v-bind:disabled="disableRegisterBtn" :class="disableRegisterBtn ? 'disBtn' : 'activeCode' "  @click="login">注册</button>
                 </div>   
            </div>          
        </div>
    </div>
</template>
<script>
import { reqister,smsSend,authenticate,getCurrentLoginInfo} from '../../libs/api'
import { SAVEUSERINFO,LOGINSTATUS } from '../../store/index'
import showModal from '../../components/showModal'
import {getStore,setStore} from '../../libs/util'
import { Group,XInput,CheckIcon } from 'vux'


const md5=require('md5')

export default {
    data(){
        return{
            checked:false,
            loginOrRegister:true,
            register:{},
            isShow:false,
            time:'验证码',//倒计时
            currentTime:61,
            loginForm:{},
            disableLoginBtn:true,
            disableRegisterBtn:true,
            interval:null, //定时器 
         }
        
    },
    components: {
      Group,
      XInput,
      showModal,
      CheckIcon  
    },
    watch:{
        checked(curval,oldval){
          this.disable()
        }
    },
    methods: {

        hideModal(){
          this.isShow=false;
          this.refreshData() 
        },
        refreshData(){
            Object.assign(this.$data,this.$options.data())
        },
        isRegister(){  
          const myreg=/^[1][3,4,5,7,8][0-9]{9}$/; 
        //   if(!this.register.phoneNumber || this.register.phoneNumber.length===0){ 
        //       this.$vux.toast.text('请输入手机号码', 'middle')
        //       return false;
        //   }
          if(!myreg.test(this.register.phoneNumber)){
             this.$vux.toast.text('您输入的手机号码格式不正确请重新输入', 'middle')    
               return false;
          }
          if(!this.register.password || this.register.password.length<6 || this.register.password.length>18){
               this.$mptoast('密码长度为6~18位','none',2000)
               return false;
          }
         
        //   if(!this.register.code || this.register.password.code===0){
        //       this.$vux.toast.text('请输入验证码', 'middle')
           
        //       return false;
        //   }
        //   if(!this.checked){
        //      this.$vux.toast.text('请勾选使用条款', 'middle')
        //      return false;
        //   }
          return true
        },
        checkboxChange(){
            this.checked=!this.checked
        },
        btnclick(login){
           this.loginOrRegister=login
           if(login){
               this.register={}
               this.time="验证码"
               this.currentTime="61"
               clearInterval(this.interval)
           }else{
              this.loginForm={}       
           }
        },
        async getUserInfo(){
            let res = await getCurrentLoginInfo()
            if(res && res.success){
                let userInfo=res.result;       
                this.$store.commit('SAVEUSERINFO',userInfo)
                setStore('userInfo',userInfo)
                this.goToUrl(userInfo)    
            }else {
                let mes=res.error.message;
               this.$vux.toast.text(mes, 'middle')   
            }
     },
    goToUrl(info){
        if(info.gameListType==2 || info.gameListType==1){
            this.$router.replace({path:'/detail'})
         
        }else{
            this.$router.replace({path:'/carplate'})
        }
     },
       async login(){
           const that=this;
              if(!this.loginOrRegister){
                  //注册逻辑
                        if(this.isRegister())
                        {
                              
                        let data={
                            phoneNumber:this.register.phoneNumber,
                            code:this.register.code,
                            password:this.register.password
                        }
                         let res=await reqister(data)
                        if(res.success){
                            this.isShow=true;
                         
                        }else{
                            this.$vux.toast.text(res.error.message, 'top') 
                        }        
                 }
              }else{             
                  //登陆逻辑
                          
                       let str=md5(that.loginForm.password)
                       let password=str.toUpperCase()
                         let data={
                            phoneNumber:this.loginForm.phoneNumber,
                            password:password,
                            loginType:10  //web登录
                        } 
                        let ret = await authenticate(data)           
                        if(ret && ret.success){
                           try{
                               setStore("authToken",ret.result);
                               this.$store.commit('LOGINSTATUS',true)
                               this.getUserInfo()
                            
                           }catch(e){
                              console.log(e,'eee')
                           }                        
                        }else{
                          
                           this.$vux.toast.text(ret.error.message, 'middle') 
                        }               
                 
            }        
      },
      async getCode(){
          const myreg=/^[1][3,4,5,7,8][0-9]{9}$/;    
          if(!this.register.phoneNumber || this.register.phoneNumber.length===0){ 
                this.$vux.toast.text('请输入手机号码', 'middle')        
              return false;
          }
          if(!myreg.test(this.register.phoneNumber)){
                 this.$vux.toast.text('请输入正确的手机格式', 'middle')       
               return false;
          }
     
         const that=this;
       
       
        this.interval=setInterval( ()=>{
             this.currentTime--;
            if(this.currentTime>0){
               that.time= this.currentTime + '秒'
            }else{
                clearInterval(this.interval)
                this.time='重新发送'
                this.currentTime=61
            }        
         },1000)
          let data={
              phoneNumber:this.register.phoneNumber,
              smsType:0
         }
         let res= await smsSend(data)
         if(res && res.success){
              console.log(res.result)
         }else{
             this.$vux.toast.text(res.error.message, 'middle') 
         }

      },
      getVerificationCode(){
          this.getCode() 
      },
      //登录
      isDisable(){  
      
          if( Object.keys(this.loginForm).length==0){
              this.disableLoginBtn=true
              
          }else{
              if(this.loginForm.phoneNumber && this.loginForm.phoneNumber.length>0 && this.loginForm.password && this.loginForm.password.length>0){
                  this.disableLoginBtn=false
                
              }else{
               
                  this.disableLoginBtn=true
              }
          }   
      },
      //注册按钮
      disable(){
        if(Object.keys(this.register).length){
             debugger
           if(this.register.phoneNumber && this.register.phoneNumber.length>0 && this.register.password && this.register.password.length>0 && this.register.code && this.register.code.length>0 && this.checked){
               this.disableRegisterBtn=false
            
           }else{
           
               this.disableRegisterBtn=true
           }
        }else{
           
            this.disableRegisterBtn=true
        }       
      }
    },
    mounted () {
        //  this.refreshData(); 
    } 
}
</script>
<style lang="less" >
.activeCode{
      background-image: linear-gradient(90deg, 
		rgba(104, 169, 2, 0.54) 0%, 
		rgba(178, 217, 75, 0.9) 100%), 
	linear-gradient(
		#61c000, 
    #61c000);
    background-blend-mode: normal,ormal;
}
    .login_wrap{
        padding-left: 15px;
        padding-right: 15px;
        box-sizing: border-box;
        .disBtn[disabled]{
            background: #999;
            color: #fff;
        }
        .login_logo{
            margin-top:10px;
            .logo{
                img{
                  width: 139px;
                  height:50px;
                }
            }
        }
        .login_main{
            margin-top: 50px;
            .login_group{
                margin-top: 40px;
            }
            .weui-input{
                font-size: 15px;
            }
            .input_password{
                height:50px ;
            }
           .input_number:before{
                border-top: 0; 
                border-bottom:1px solid #d9d9d9;
            }
            .input_password:before{
                border-top: 0;
                border-bottom:1px solid #d9d9d9;
                bottom: 0;
            }
            .line:before{
                    content: " ";
                    position: absolute;
                    left: 0;
                     top: 101px;
                    right: 0;
                    height: 1px;
                    width: 100%;
                    border-bottom: 1px solid #D9D9D9;
                    color: #D9D9D9;
                    -webkit-transform-origin: 0 0;
                    transform-origin: 0 0;
                    -webkit-transform: scaleY(0.5);
                    transform: scaleY(0.5);
                    left: 15px;
            }
            .weui-cells:before{
               border:0;
            }
            .weui-cells:after{
                border: 0;
            }
            .weui-cells_form{
                margin-top: 40px;
                .weui-cell{
                    padding: 15px;
                }
            }
            .register_server{
                margin-top: -18px;
                padding-left:10px;
                display: flex;
                display: -webkit-flex;
                justify-content: flex-start;
                align-items: center;
                .weui-check__hd_in-checkbox{
                    padding-right: 0;
                }
                .label_server:active{
                    background-color: #fff;
                }
                .label_server{
                    padding: 0;
                    .icon1{
                        margin: 0;
                        border-radius: 50%;
                    }
                }
            }
            .btn_type{
                margin-left: 10px;
                .btnLogin{
                    font-size: 21px;
                    color: #999;
                    display: inline-flex;
                    margin-right: 15px;            
                }
                .active{
                    color: #4eb248;
                }
            }
        
              
                .btn_wrap{
                    margin-top: 40px;
                    .btn{
                           width:310px;
                            height: 45px;
                            border-radius: 22px;
                            background-image: linear-gradient(90deg, 
                            rgba(104, 169, 2, 0.54) 0%, 
                            rgba(178, 217, 75, 0.9) 100%), 
                            linear-gradient(
                                #61c000, 
                                #61c000);
                            background-blend-mode: normal,normal;
                    }
                }
            
        }
        .login_footer{
            width: 100%;
            .delivder{
                display: flex;
                display:-webkit-flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;     
                .line{
                   background: #999;
                   height:2px;
                   width: 115px;            
                }
            }
        }
        .code_wrap{
            padding-right: 0;
        }
       
        .btn_wrap{
            margin-top: 15px;
            text-align: center;
            button{
                color: #fff;
            }
        
        }
        .rules{
            display: flex;
            display: -webkit-flex;
            justify-content: flex-start;
            align-items: center;
            margin-left: 10px;
            span{
               margin-top: 3px;
            }
            a{
               margin-top: 3px;
            }
        }
    }
</style>


