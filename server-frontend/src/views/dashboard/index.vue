<template>
  <div class="dashboard-container" :style="{backgroundImage:dashboard_bg}">
    <el-row :gutter="20" style="height:100%;margin-left:0px;margin-right:0px;">
      <el-col :md="6" :sm=24 >
        <div class="dash-card">
          <div style="width:100%;text-align:center;font-size:60px;" >
            Vaper
          </div>
        </div>
      </el-col>
      <el-col :md="6" :sm=24 >
        <div class="dash-card" @click="hostclick">
          <svg-icon icon-class="host" class-name="card-panel-icon" />
          <div class="icon-count">
            {{hostCount}}
            <span class="icon-title">{{$t('node')}}</span>
          </div>
        </div>
      </el-col>
      <el-col :md="6" :sm=24 >
        <div class="dash-card" @click="linksclick">
          <svg-icon icon-class="wang" class-name="card-panel-icon" />
          <div class="icon-count">
            {{linksCount}}
            <span class="icon-title">{{$t('link')}}</span>
          </div>
        </div>
      </el-col>

    </el-row>
    <span class="star-flick" v-for="star in stars" :key="star.index" :style="{animationDuration:star.animationDuration, left:star.left, top:star.top}">
    </span>
    <span class="star-fly" v-for="star in flyStars" :key="star.index" :style="{animationDuration:star.animationDuration, left:star.left, top:star.top}">
    </span>
  </div>
</template>

<script>
import { getHostCount } from '@/api/host'
import { getLinksCount } from '@/api/link'
import dashboard_bg from '@/assets/images/dashboard-bg.png'
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  components: {},
  data() {
    console.log(dashboard_bg)

    const stars_count = 120
    const stars = []
    for (let index = 0; index < stars_count; index++) {
      const animationDuration = Math.random() * 9
      stars.push({
        'index': index,
        'left': Math.random() * 100 + '%',
        'top': Math.random() * 100 + '%',
        'animationDuration': (animationDuration < 2 ? 2.4 : animationDuration) + 's'
      })
    }
    const fly_stars_count = 6
    const fly_stars = []
    for (let index = 0; index < fly_stars_count; index++) {
      const animationDuration = Math.random() * 36
      let left = Math.random() * 100
      left = left > 80 ? 80 : left
      left = left < 30 ? 30 : left
      let top = Math.random() * 100
      top = top > 80 ? 80 : top
      top = top < 30 ? 30 : top
      fly_stars.push({
        'index': index,
        'left': left + '%',
        'top': top + '%',
        'animationDuration': (animationDuration < 12 ? 12 : animationDuration) + 's'
      })
    }

    return {
      dashboard_bg: 'url(' + dashboard_bg + '?' + +new Date() + ')',
      hostCount: 0,
      linksCount: 0,
      stars: stars,
      flyStars: fly_stars
      // currentRole: 'adminDashboard'
    }
  },
  methods: {
    hostclick: function() {
      this.$router.push({ name: 'host' })
    },
    linksclick: function() {
      this.$router.push({ name: 'link-list' })
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  created() {
    getHostCount()
      .then(response => {
        console.log(response)
        var data = response['data']
        this.hostCount = data['node_count']
      })
      .catch(err => {
        this.fetchSuccess = false
        console.log(err)
      })
    getLinksCount()
      .then(response => {
        console.log(response)
        var data = response['data']
        this.linksCount = data['linksCount']
      })
      .catch(err => {
        this.fetchSuccess = false
        console.log(err)
      })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  @keyframes bcani
  {
    from {  
      box-shadow: 0px 0px 0px 1px rgb(11, 234, 235) inset;
      }
    to {
      filter: blur(0.6px);
      box-shadow: 0px 0px 36px 1px rgb(11, 234, 235) inset;
    }
  }
  @keyframes bcaniback
  {
    from { 
      filter: blur(0.6px);
      box-shadow: 0px 0px 36px 1px rgb(11, 234, 235) inset;
      }
    to {  
      box-shadow: 0px 0px 0px 1px rgb(11, 234, 235) inset;
      }
  }
  .dashboard-container{
    overflow: hidden;
    height:100%;
    background: #ffffff;
    // background-image:url(/static/imgs/dashboard-bg.png);
    background-size: 100% 100%;
    background-repeat:no-repeat;
    margin-left:-3px;
    position: static;
  }
  .dash-card:hover{
    // box-shadow: 0px 0px 24px 6px rgb(11, 234, 235) inset;
    animation: bcaniback 0.6s;
    animation-fill-mode : forwards;
  }
  .dash-card {
    animation: bcani 1.8s;
    animation-fill-mode : forwards;
    background: linear-gradient(#244cc4, #3769d3);
    color: #ffffff;
    border-width: 0px;
    // border-radius: 6px;
    margin: 30px 10px;
    padding: 16px 36px;
    cursor: pointer;
    height:120px;
    @include clearfix;
  }
  .dash-card .icon-count {
    margin: 10px 0px 0px 0px;
    float: right;
    font-size: 60px;
    font-weight:100;
  }
  .dash-card .icon-count .icon-title {
    font-size: 36px;
  }
  .card-panel-icon {
    width: 90px;
    height: 90px;
    float: left;
    margin: 0px 0px 10px 0px;
  }
  
  @keyframes starFlick {
      from {
          opacity: 0;
          filter:blur(3px);
      }
      to {
          opacity: 1;
      }
  }

  .star-flick {
      opacity: 0;
      position: absolute;
      right:100px;
      bottom:100px;
      width: 2px;
      height: 2px;
      border-radius: 1px;
      background-color: #ffffff;
      animation: starFlick 3s ease-out infinite alternate;
  }

  @keyframes star-ani {
      0% {
          opacity: 0;
          transform: scale(0) rotate(0) translate3d(0, 0, 0);
      }
      50% {
          opacity: 1;
          transform: scale(1) rotate(0) translate3d(-25%, 20%, 0);
      }
      100% {
          opacity: 0;
          transform: scale(1) rotate(0) translate3d(-30%, 30%, 0);
      }
  }

  .star-fly {
      display: block;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #FFF;
      top: 100px;
      left: 400px;
      position: absolute;
      transform-origin: 100% 0;
      animation: star-ani 6s infinite ease-out;
      box-shadow: 0 0 5px 5px rgba(255, 255, 255, .3);
      opacity: 0;
      z-index: 2;
  }
  .star-fly:after {
      content: '';
      display: block;
      top: 0px;
      left: 4px;
      border: 0px solid #fff;
      border-width: 0px 90px 2px 90px;
      border-color: transparent transparent transparent rgba(255, 255, 255, .3);
      transform: rotate(-45deg) translate3d(1px, 3px, 0);
      box-shadow: 0 0 1px 0 rgba(255, 255, 255, .1);
      transform-origin: 0% 100%;
      animation: shooting-ani 3s infinite ease-out;
  }

</style>

