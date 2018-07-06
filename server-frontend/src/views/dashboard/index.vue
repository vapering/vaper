<template>
  <div class="dashboard-container">
    <el-row :gutter="20" style="height:100%;margin-left:0px;margin-right:0px;">
      <el-col :md="8" :sm=24 >
        <div class="dash-card">
          <div style="width:100%;text-align:center;font-size:60px;" >
            Vaper
          </div>
        </div>
        <div class="dash-card" @click="hostclick">
          <svg-icon icon-class="host" class-name="card-panel-icon" />
          <div class="icon-count">
            {{hostCount}}
            <span class="icon-title">Host</span>
          </div>
        </div>
        <div class="dash-card" @click="linksclick">
          <svg-icon icon-class="wang" class-name="card-panel-icon" />
          <div class="icon-count">
            {{linksCount}}
            <span class="icon-title">Links</span>
          </div>
        </div>
      </el-col>

    </el-row>
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
    return {
      dashboard_bg: dashboard_bg + '?' + +new Date(),
      hostCount: 0,
      linksCount: 0
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
      background: rgba(230, 255, 255, 0.1);
      box-shadow: 0px 15px 30px -20px #888888;
      }
    to {
      background: rgba(230, 255, 255, 0.6);
      box-shadow: 0px 30px 30px -20px #888888;
    }
  }
  @keyframes bcaniback
  {
    from {  
      background: rgba(230, 255, 255, 0.6);
      box-shadow: 0px 30px 30px -20px #888888;
      }
    to {  
      background: rgba(230, 255, 255, 0.1);
      box-shadow: 0px 15px 30px -20px #888888;
      }
  }
  .dashboard-container{
    height:100%;
    background: #ffffff;
    background-image:url(/static/imgs/dashboard-bg.png);
    background-size: auto 100% ;
    background-repeat:no-repeat;
  }
  .dash-card:hover{
    animation: bcani 0.6s;
    animation-fill-mode : forwards;
  }
  .dash-card {
    animation: bcaniback 3s;
    animation-fill-mode : forwards;
    background: rgba(51, 255, 255, 0.6);
    border-width: 0px;
    margin: 20% 10px;
    padding: 16px;
    cursor: pointer;
    height:auto;
    @include clearfix;
  }
  .dash-card .icon-count {
    margin: 10px 0px 0px 0px;
    float: right;
    font-size: 60px;
  }
  .dash-card .icon-count .icon-title {
    font-size: 36px;
    color:#aaaaaa;
  }
  .card-panel-icon {
    width: 90px;
    height: 90px;
    float: left;
    margin: 0px 0px 10px 0px;
  }
</style>

