<template>
    <div class="reward_container page_Wrap">
        <div class="reward_head" v-if="carbon">
            <div style="margin-bottom:15px;">
                  <span class="cur">{{carbon.points}}</span>个
            </div>
        </div>
        <div>
                <div id="point" @touchstart='touchStart'            
                     @touchend='touchEnd'  style="width:330px;height:190px;"></div>
                 <img  src="../../../static/images/bd_point.png" >      
                 <div class="tip" v-if="!draw || draw.items.length==0">还没有数据...</div>
        </div>
             

        <div class="reward_list" v-if="detail">
            <h3 style="text-align:left;">碳积分明细</h3>
            <ul>
                <li v-if="detail.items.length>0" class="item_li" v-for="(item,index) in detail.items" :key="index">
                    <div class="item">
                        <div class="item1" v-if="item.type==21">碳积分--注册</div>
                        <div class="item1" v-if="item.type==22">碳积分--签到</div>
                        <div class="item1" v-if="item.type==23">碳积分--拍照</div>
                        <div class="item1" v-if="item.type==24">碳积分--里程</div>
                        <div class="item1" v-if="item.type==25">碳积分--停驶</div>
                        <div class="item2">{{ item.date}}</div>
                    </div>
                    <div class="item3">
                       碳积分 {{item.points}}
                    </div>
                </li>
                <li v-if="detail.items.length==0">还没有数据...</li>
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
import {getAllWithCarbon,getDrawWithCarbon,getDetailwithCarBon} from '../../libs/api'
import axios from 'axios'
import {carbonSpecificType} from '../../libs/constants'

export default {
    data(){
        return{
            echarts:null,
            carbonSpecificType:carbonSpecificType,
            carbon:null,//奖励
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
            allRraw:[] //总的图表数据
          
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
                            this.$vux.toast.text('以经是最新数据了...')
                        }
                    }else{
                       this.drawPage--
                       if(this.detail.items.length){
                         this.getDrawWithCarbon(this.drawPage,this.drawNum)         
                       }    
                    }              
                    
                }else{
                      this.drawPage++;                 
                      if(this.detail.items.length){
                         this.getDrawWithCarbon(this.drawPage,this.drawNum)         
                       }          
                }  
         
    },
     async getDrawWithCarbon(page,num){
         const that=this;
         let data={
            page:this.drawPage,
            rows:num 
         }
         let items=[];
         let drawData=[];
         let res=await getDrawWithCarbon(data);
         if(res && res.success){
              items=res.result.items; 
              if(items && items.length){
                 this.initChart(items)
              }           
         }else{
             this.$vux.toast.text(res.error.message)
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
        
         axios.all([getAllWithCarbon(),getDrawWithCarbon(data2),getDetailwithCarBon(data)])
         .then(axios.spread(function(a,b,c){
              that.carbon=a.result;
              that.draw=b.result;
              that.detail=c.result;             
              that.initChart(that.draw.items)
         }))
      },
      initChart(arr){
       
          let x=[];
          let y=[]; 
           let title=arr[arr.length-1].date.substring(0,4) || 2018        
          arr.forEach(((item,index)=>{
              x[index]=item.date.substring(5,10).replace(/-/g,'/');
              y[index]=item.totalPoints   
          })) 
       
         let  myChart=echarts.init(document.getElementById('point'))
         this.echarts=myChart
        myChart.setOption({    
            title:{
             text:`2018年`,
             textStyle:{
                 color:'#fff',
                 fontSize:14
             },
             left:30,
             top:15         
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
                offset:8
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
                                          offset: 0, color: 'rgba(255,154,82,1)' // 0% 处的颜色
                                        }, 
                                        {
                                          offset:0.6,color:'rgba(254,153,99,0.8)'
                                        },
                                        {
                                          offset: 1, color: 'rgba(254,153,99,0.2)' // 100% 处的颜色
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
                     color:'#FD7F42',
                     borderWidth:1,            
                     label:{
                         show:true,
                         color:'#fff'
                     }
                   }
                }
            }]
       });
      
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
    left:35px;
 }
.wrap{
    width: 100%;
    position: relative;
    // height: 300px;
    img{
        height: 183px;
        position: absolute;
        width: 100%;
    }

}
   .reward_container{
       padding: 30px 20px 0 20px;
       text-align: center;
      .reward_head{
          display: flex;
          display: -webkit-flex;
          justify-content: flex-start;
          align-items: center;
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
      .reward_main{
          width: 100%;
          height: 183px;
          margin-top: 20px;
            .tip{
              position:absolute;
                top:50%;
                left:50%;
                margin-left:-38px;
                margin-top:-17px;

          }
      } 
   }
   .reward_list{
       margin-top: 20px;
       h3{
           font-size:15px;
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
              text-align: left ;
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

