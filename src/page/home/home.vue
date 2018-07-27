<template>    
           <div class="home ">
                 <div class="home_title">
                     <img src="../../../static/images/banner1.png" >
                     <p>
选择“绿色出行”,是在选择一种生活方式,选择一种生活态度——节约能源、提高能效、减少污染、有益健康、兼顾效率.文明行驶绿色出行、主动停驶可兑换碳积分奖励;体现的是一种负责的生活态度,一种高尚的公民道德,一种新兴的时尚趋势,一种先进的文明形态.                     </p>
                 </div>
                 <div class="home_part1">
                     <h3>活动一: 拍照参与减排</h3>
                     <router-link to="/one">
                         <img src="../../../static/images/banner2.png" >  
                     </router-link>          
                 </div>
                 <div class="home_part2">
                     <h3>活动二：租赁车载wifi设备参与减排</h3>
                     <router-link to="/two">
                        <img src="../../../static/images/banner3.png" >
                     </router-link>               
                 </div>
             </div>      
           
</template>
<script>

export default {
 
}
</script>
<style lang="less" scoped>
  .home{
      margin-top: 20px;
    
       img{
           width: 100%;
           height:150px;
       }
      .home_title{
         p{
             width: 90%;
             margin: 10px auto;
             color: #333;
             font-size: 26rpx;
         }
      }
        h3{
              margin-left: 10px;
              margin-bottom: 5px;
              font-size: 14rpx;;
              color: #4eb248;
              font-weight: bold;
          }
      .home_part1,.home_part2 {
        padding-left: 15px;
        padding-right: 15px;
         margin: 10px auto;
         img{
             height:165px;
         }    
      }
  }
</style>


