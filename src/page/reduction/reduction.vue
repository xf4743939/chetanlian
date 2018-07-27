<template>
    <div class="activity page_Wrap">
         <div class="activity_rules">      
           <div class="rule1 rules" @click="choice(1)">
                <!-- <h3>活动规则</h3> -->
            按照每个月1000公里的基数进行核算(用户开车大于1000公里则过去的一个月未能进行碳减排,不予奖励),(1000-X)则属于此用户减排的里程数,每少开一公里奖励现金:0.01元,碳积分:1个.
           </div>
         </div>
        <div class="activity_rules ">      
           <div class="rule2 rules" @click="choice(2)">
                <!-- <h3>活动规则</h3> -->
            每停驶一天,奖励现金:0.4元,碳积分:40个。
           </div>
       </div>

    </div>
</template>
<script>
 import {mapMutations} from 'vuex'
 import{ setStore} from '../../libs/util.js'
export default {
    data(){
        return {
          
        }
    },
    methods: {
        ...mapMutations(['SAVESCHEM']),
        choice(index){
            this.$router.push({path:'/address'})
            this.$store.commit('SAVESCHEM',index)
            setStore('schem',index)
        }
    }
}
</script>
<style lang="less" scoped>
    .activity{
      
        margin-top: 45px;
        .activity_rules{
             position: relative;
              margin-top: 30px;
              margin-bottom:35px;
              padding-left: 15px;
              padding-right: 15px;
            .rules{
                border: 1px solid #4eb248;
                border-radius: 8px;
                padding: 24px 15px 25px 15px;
                margin-bottom: 10px;  
                   height:80px;
            }
            .rule1:before{
                content: '按里程计算';
                width:78px;      
                padding-left:4px;
                padding-right:4px;
                position: absolute;
                top: -10px;
                color: #4eb248;
                background: #fff;
                font-size: 15px;     
            }
             .rule2:before{
                content: '按停驶天数';
                width:78px;      
                padding-left: 4px;
                padding-right:4px;
                color: #4eb248;
                position: absolute;
                top: -10px;
                background: #fff;
                font-size: 15px;     
            }
          
        }
    }

</style>
