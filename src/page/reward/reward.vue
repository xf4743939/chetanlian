<template>
    <div class="reward_container page_Wrap">

        <div class="reward_head" v-if="award">
            <div>
                当前<span class="cur" >{{award.money.toFixed(2)}}</span>元,&nbsp;&nbsp;累计<span class="sum">{{ award.totalMoney.toFixed(2) }}</span>元
            </div>
        </div>
        <div >
              <div id="point" @touchstart='touchStart'            
                     @touchend='touchEnd'  style="width:335px;height:190px;"></div>
             <img src="../../../static/images/bd_reward.png" >     
             <div class="tip" v-if="!draw || draw.items.length==0">还没有数据...</div>
        </div>
        <div class="reward_list" v-if="detail">
            <h3>获得奖励明细</h3>
            <ul>
                <li v-if="detail.items && detail.items.length>0 " class="item_li" v-for="(item,index) in detail.items" :key="index">
                    <div class="item">
                        <div class="item1" v-if="item.type==carbonSpecificType.awardMoney_regist">奖励金--注册</div>
                        <div class="item1" v-if="item.type==carbonSpecificType.awardMoney_sign">奖励金--签到</div>
                        <div class="item1" v-if="item.type==carbonSpecificType.awardMoney_photograph">奖励金--拍照</div>
                        <div class="item1" v-if="item.type==carbonSpecificType.awardMoney_mileage">奖励金--里程</div>
                        <div class="item1" v-if="item.type==carbonSpecificType.awardMoney_startStop">奖励金--停驶</div>
                        <div class="item2">{{ item.date}}</div>
                    </div>
                    <div class="item3">
                        {{ item.money}}
                    </div>
                </li>
               <li v-if="!detail || detail.items.length==0">还没有数据...</li>
            </ul>
        </div>
    </div>
</template>
<script>

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import {getStatistics,getDrawData,getDetaildata} from '../../libs/api'
import {carbonSpecificType} from '../../libs/constants'
import axios from 'axios'


export default {
    data(){
        return{
            echarts:null,
            carbonSpecificType:carbonSpecificType,
            award:null,//奖励
            draw:null,//图数据
            detail:null, //明细数据
            page:1,
            num:10,
            drawPage:1,//画图数据的页
            drawNum:5,//画图数据的大小
            options:{},//图表选项
            startX:0,//开始触摸的位置，       
            moveX:0,//滑动时的位置
            disX:0,
            endX:0,
        }
    },

    methods:{
      touchStart(ev){
         ev=ev || event;
         ev.preventDefault();
      
         if(ev.touches.length == 1){
           this.startX = ev.touches[0].clientX
         }
     },
    touchEnd(ev){
          ev = ev || event;
          ev.preventDefault();
        
             this.endX = ev.changedTouches[0].clientX
             this.disX=this.endX-this.startX;
                if(this.disX>0){
                      if(this.drawPage<=1){
                        this.drawPage=1
                        if(this.detail.items.length){
                            this.$vux.toast.text('已是最新数据了...')
                        }
                    }else{
                       this.drawPage--
                       if(this.detail.items.length){
                           this.getDrawData(this.drawPage,this.drawNum)         
                       }
                   
                    }                  
                   
                }else{
                     this.drawPage++; 
                     if( this.detail.items.length){
                         this.getDrawData(this.drawPage,this.drawNum)
                     }                
                   
                }  
         
    },
      async getDrawData(page,num){
         const that=this;
         let data={
            page:this.drawPage,
            rows:this.drawNum 
         }
         let items=[];
         let drawData=[];
         let res=await getDrawData(data);
         if(res && res.success){
             items=res.result.items;
             if(items && items.length){
                  this.initChart(items)
             }        
         }else{
               that.$vux.toast.text(res.error.message)
         }
    },
      getData(){
          const that=this;
          let data={
              page:this.page,
              rows:this.num
          }
         let data2={
            page:this.drawPage,
            rows:this.drawNum 
         }
      
          axios.all([getStatistics(),getDrawData(data2),getDetaildata(data)])
          .then(axios.spread(function(a,b,c){
              that.award=a.result  
              that.draw=b.result   
              that.detail=c.result
              that.initChart(that.draw.items)        
          }))
          .catch(function(error){
              that.$vux.toast.text(error.message)
          })
      },
      initChart(arr){
           let x=[];
          let y=[]; 
          let title='2018'
          if(arr.length>0){
            title=arr[arr.length-1].date.substring(0,4)
          }
          arr.forEach(((item,index)=>{
              x[index]=item.date.substring(5,10).replace(/-/g,'/');
              y[index]=item.totalMoney   
          })) 
         
         let  myChart=echarts.init(document.getElementById('point'))
          let option = {    
            title:{
             text:`${title}年-${parseInt(title)+1}年`, 
             textStyle:{
                 color:'#fff',
                 fontSize:14
             },
             left:18,
             top:11         
            },
            grid: {
              show:false
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data:x,
                show:true,
                axisLine:{
                            show:false,       
                        },
                axisTick:{
                    show:false
                },
                position:'bottom',
                offset:9
            },
            yAxis: {
                   type: 'value',
                    show:false,
                    axisLine:{
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
            },
            series: [{
                type: 'line',
                smooth: true,
                symbolSize:4,
                symbol:'circle',
                data:y,     
                areaStyle: {
                            normal: {
                                color:{
                                    type:'linear',
                                    x:0,
                                    y:0,
                                    x2:0,
                                    y2:1,
                                    colorStops: [
                                        {
                                          offset: 0, color: 'rgba(247,212,142,1)' // 0% 处的颜色
                                        }, 
                                        {
                                          offset:0.6,color:'rgba(247,212,142,0.8)'
                                        },
                                        {
                                          offset: 1, color: 'rgba(247,212,142,0.1)' // 100% 处的颜色
                                        }
                                    ],
                                    globalCoord: false // 缺省为 false
                                }                                   
                            },            
                          
                         },
                lineStyle: {            
                        normal: {
                            color: '#fff',
                            width:1               
                        }  
                },
                itemStyle:{
                   normal:{
                     borderColor:'#fff',
                     color:'#E8A332',
                     borderWidth:1,            
                     label:{
                         show:true,
                         color:'#fff'
                     }
                   }
                }
            }]
       }
         myChart.setOption(option)       
      }
    },
    mounted() {
        
       this.getData()
                 
    },
}
</script>
<style lang="less" scoped>
#point{
    position: absolute;
    z-index:999;
    left:25px;
 }

.wrap{
 
    img{
        height: 183px;
        position: absolute;
        width: 100%;
    }

}
   .reward_container{
       padding: 30px 15px 0 15px;
      .reward_head{
          display: flex;
          display: -webkit-flex;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 30px;
          div{
            font-size: #999;
          }
          .cur{
              font-size: 18px;
              font-weight: bold;
              color: #333;
          }
          .sum{
             font-size: 18px;
             color: #999;
          }
      }
     
          .tip{
               display: inline-flex;
                position: absolute;
                /* top: -114px; */
                top: 171px;
                left: 125px;

          }
      
   }
   .reward_list{
       margin-top: 20px;
       ul{
           list-style: none;
       }
       h3{
           font-size: 15px;
           margin-bottom: 20px;
       }
       .item_li{
           display: flex;
           display: -webkit-flex;
           justify-content:space-between;
           align-items: center; 
           margin-bottom: 8px;
           .item1{
              margin-bottom: 8px;
           }
           .item2{
               color: #999;
           }
           .item3{
               color:#4eb248;
               font-size: 16px;
           }
       }
   }
</style>

