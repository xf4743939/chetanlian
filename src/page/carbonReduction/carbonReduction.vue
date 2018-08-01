<template>
    <div class="reward_container page_Wrap">
        <div class="reward_head" v-if="reduction">
            <div>
                减排碳<span class="cur">{{reduction.totalCarbon| convertVal }}</span>&nbsp;,&nbsp;&nbsp;减排污染物<span class="sum ">{{ reduction.totalPollute | convertVal }}</span>
            </div>
        </div>
        <div >
                      <div id="point" @touchstart='touchStart'            
                     @touchend='touchEnd'  style="width:335px;height:180px;"></div>
             <img src="../../../static/images/bd_reduction.png">
           
            <div class="tip" v-if="!draw || draw.items.length==0">还没有数据...</div>
        </div>
        <div class="reward_list" v-if="detail">
            <h3>减排明细</h3>
            <ul>
                <li v-if="detail.items.length>0" class="item_li" v-for="(item,index) in detail.items" :key="index">
                    <div class="item">
                        <div class="item1" v-if="item.type==carbonSpecificType.carbonRedction_photograph">碳减排--拍照</div>
                        <div class="item1" v-if="item.type==carbonSpecificType.carbonRedction_mileage">碳减排--里程</div>
                        <div class="item1" v-if="item.type==carbonSpecificType.carbonRedction_startStop">碳减排--停驶</div>
                        <div class="item2">{{ item.date}}</div>
                    </div>
                    <div class="item3">
                        <div class="item1">碳 {{item.carbon}}</div>
                        <div class="item2">污染物{{ item.pollute}}</div>
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
import {getAllWithReduction,getDetailWithReduction} from '../../libs/api'
import axios from 'axios'
import {carbonSpecificType} from '../../libs/constants'

export default {
    data(){
        return{ 
            carbonSpecificType:carbonSpecificType,  
            reduction:null,//奖励
            draw:null,//图数据
            detail:null, //明细数据
            page:1,
            num:5,
            options:{}, //图标option
            dates:[],//图的横坐标
            carbons:[],//碳的
            pollutes:[],//污染物     
             startX:0,//开始触摸的位置，       
            moveX:0,//滑动时的位置
            disX:0,
            endX:0,
            drawPage:1,
            drawNum:5,
        }
    },
     filters:{
      convertVal(item){
          
            if(parseInt(item)==0){
                return '0g'
            }else {   
                let arr=item.toFixed(2).split('.')
                let a=arr[0],b=arr[1];
                let num
                if(a && a.length>3 && a.length<7){
                    num=(a/1000).toFixed(2) + "kg"
                }else if(a && a.length>=7){
                num=(a/1000).toFixed(2) + "t"
                }else{
                    num=a.toFixed(2) + 'g'
                }
                return  num
        }
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
                         this.getDetailWithReduction(this.drawPage,this.drawNum)    
                       }
                           
                    }                  
                   
                }else{
                     this.drawPage++; 
                       if(this.detail.items.length){
                         this.getDetailWithReduction(this.drawPage,this.drawNum)    
                       }
                }  
         
    },
 async getDetailWithReduction(page,num){
         const that=this;
         let data={
            page:this.drawPage,
            rows:num 
         }
         let items=[];
         let drawData=[];
         let res=await getDetailWithReduction(data);
         if(res && res.success){
              items=res.result.items;
                this.initChart(items)
              
         }else{
             that.$vux.toast.text(res.error.message)
         }
    },
      getData(){
          const that=this;
          let data={
              page:this.page,
              rows:this.num,

          }
          axios.all([getAllWithReduction(),getDetailWithReduction(data)])
          .then(axios.spread(function(a,b){
              that.reduction=a.result
              that.detail=b.result    
            
             that.initChart(that.detail.items)
          }))
          .catch(function(error){
            that.$vux.toast.text(error.message)
          })
      },
      initChart(arr){
        
          let x=[];
          let y1=[];
          let y2=[]; 
          let title='2018'
          if(arr.length>0){
            title=arr[arr.length-1].date.substring(0,4)
          }  
          arr.forEach(((item,index)=>{
              x[index]=item.date.substring(5,10).replace(/-/g,'/');
              y1[index]=item.carbon;
              y2[index]=item.pollute;   
          })) 
       let  myChart=echarts.init(document.getElementById('point'))
        let option = {    
            title:{
             text:`${title}年-${parseInt(title)+1}年`,
             textStyle:{
                 color:'#fff',
                 fontSize:14
             },
             left:8,
           
            },
            legend:{
               left:114, 
                top:1,    
               data:[
              {
                 name:'碳',
                 textStyle:{
                     color:'#5A6147'
                 },

               },{
                   name:'污染物',
                   textStyle:{
                       color:'#EFF304'
                   }
               }
               ]
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
                offset:0
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
                symbolSize:5,
                symbol:'circle',
                smooth: true,
                name:'碳',
                stack:'总量',
                data:y1,     
                lineStyle: {            
                        normal: {
                            color: '#5A6147',
                            width:1             
                        }  
                },
                itemStyle:{
                   normal:{
                     borderColor:'#5A6147',
                     color:'#ddd',
                     borderWidth:1,            
                     label:{
                         show:true,
                         color:'#5A6147'
                     }
                   }
                }
            },
            {
                type: 'line',
                name:'污染物',
                smooth: true,
                stack:'总量',
                symbol:'circle',
                data:y2,     
                lineStyle: {            
                        normal: {
                            color: '#EFF304',
                            width:1               
                        }  
                },
                itemStyle:{
                   normal:{
                     borderColor:'#EFF304',
                     color:'rgba(239,243,4,.2)',
                     borderWidth:1,            
                     label:{
                         show:true,
                         color:'#EFF304'
                     }
                   }
                }
            }
            ]
       }
        
       myChart.setOption(option)     
    
     },
      
    },
 
    mounted() {
       
                 this.getData()
                
    },
}
</script>
<style lang="less" scoped>
#point{
   position: absolute;
    z-index: 999;
    left: 19px;
    top: 114px;
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
          margin-bottom: 16px;
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
                top: 191px;
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

