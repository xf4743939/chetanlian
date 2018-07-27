<template>
    <div class="province_container page_Wrap">
        <div class="grids">
            <router-link :to=" '/city?id=' + item.id" v-for="(item,index) in provinces" :key="item.id">
                <p >{{item.s_name}}</p>
                <p >{{item.name}}</p>
           </router-link>
        </div>
    </div>
</template>
<script>
import {provinces} from '../../libs/province'
export default {
    data(){
        return{
            provinces:[]
        }
    },
    mounted () {
        this.provinces=provinces
    }
}
</script>
<style lang="less" scoped>
  .province_container{
      padding-left: 15px;
       padding-right: 15px;
       .grids{
           display: flex;
           display: -webkit-flex;
           flex-wrap: wrap;
           justify-content:  space-between;
           padding-top: 10px;
           margin-top: 20px;
           a{
              display: flex;
              display: -webkit-flex;
               width: 28%;
               justify-content: center;
               align-items: center;
               white-space: nowrap;
               text-overflow: ellipsis;
               padding: 10px 5px;
               margin-bottom: 15px;
               box-shadow: 0px -2px 2px 0px #efefef,   /*上边阴影  红色*/
                -2px 0px 2px 0px #efefef,   /*左边阴影  绿色*/
                2px 0px 2px 0px #efefef,    /*右边阴影  蓝色*/
                0px 2px 2px 0px #efefef;    /*下边阴影  黄色*/
               p:nth-child(1){
                   color: #4eb248;
                   margin-right: 9px;
                   width: 15px;
                   white-space: nowrap;
                   text-overflow: ellipsis;
                   overflow: hidden;
               }
               p:nth-child(2){
                   color: #999;
                   width: 43px;
                   white-space: nowrap;
                   text-overflow: ellipsis;
                   overflow: hidden;
               }
           }
       }
  }
</style>

