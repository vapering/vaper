<template>
<div class="chart-container">
  <el-row style="height:100%;">

    <el-col :md="4" :sm=24 style="position:absolute;z-index:1000;background-color:#FFFFFF;">
      <el-collapse v-model="activeNames" v-if="mainNode != undefined" style="padding-left:12px;">
        <el-collapse-item :title="$t('link.CentralNode')" name="1">
          <div class="text item">
            {{$t('host.hostname')}}: {{mainNode.properties.hostname}}
          </div>
          <div class="text item">
            {{$t('host.ips')}}: {{mainNode.properties.ips}}
          </div>
          <div class="text item">
            {{$t('host.tag')}}: {{mainNode.properties.tags}}
          </div>
        </el-collapse-item>
        <el-collapse-item :title="$t('link.setting')" name="2">
          <div>
            <el-form label-width="120px">
              <el-form-item :label="$t('link.deepth')">
                <el-input-number v-model="deepth" @change="handleChange" :min="1" :max="10" style="width:120px;"></el-input-number>
              </el-form-item>
              <el-form-item :label="$t('link.Dimension')">
                <el-radio-group v-model="dimension" @change="dimensionChange">
                  <el-radio :label="2">2D</el-radio>
                  <el-radio :label="3">3D</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('link.TextonNode')" v-if="dimension==2">
                <el-select v-model="pointText" placeholder="choose" @change="pointChange">
                  <el-option
                    v-for="item in pointTextOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-collapse-item>

      </el-collapse>

    </el-col>
    <el-col :md="24" :sm=24 style="height:100%;position:absolute;">
      <div id="nodes-graph" ></div>
    </el-col>
  </el-row>
</div>
</template>

<script>

import { fetchListByIdNDeepth } from '@/api/host'
import { fetchListByUids } from '@/api/host'
import { searchLinksByNodes } from '@/api/link'

import * as echarts from 'echarts'
import $ from 'jquery'

export default {
  name: 'HelloWorld',
  data() {
    return {
      activeNames: [],
      nodes: [],
      nodes_rich: [],
      node_hover: {
        identity: '',
        properties: { uid: '', hostname: '', ips: [] }
      },
      link: [],
      link_rich: [],
      deepth: 2,
      mainUid: 0,
      mainNode: undefined,
      myGraph: {},
      dimension: 2,
      pointTextOptions: [
        {
          value: 'hostname',
          label: 'hostname'
        },
        {
          value: 'ips',
          label: 'ip'
        },
        {
          value: 'tags',
          label: 'Tags'
        }
      ],
      pointText: 'hostname',
      pointTextDefault: 'hostname'
    }
  },
  methods: {
    dimensionChange: function(value) {
      if (this.dimension === 2) {
        this.myGraph.resetProps()
        this.myGraph = {}
        $('#nodes-graph').html()
      } else if (this.dimension === 3) {
        this.myGraph.dispose()
      }
      this.dimension = value
      this.getNodesByIdNDeepth(this.mainUid, this.deepth)
    },
    /**
     * @augments id array
     */
    getLinks: function(uids) {
      var self = this
      searchLinksByNodes({ uids: uids })
        .then(function(response) {
          var links = response.data.links
          var links_ = []
          var links_rich = []
          for (let i = 0; i < links.length; i++) {
            const link = links[i]
            links_rich.push(link)
            links_.push({
              source: link.source,
              target: link.target,
              value: link.value,
              color: '#ffffff'
            })
          }
          self.links = links_
          self.links_rich = links_rich
          var dom = document.getElementById('nodes-graph')
          var width = $('#nodes-graph').width()
          if (self.dimension === 2) {
            self.initGraphByEcharts(dom, width)
          } else if (self.dimension === 3) {
            self.initGraphByForceGraph3D(dom, width)
          }
        })
        .catch(function(error) {
          console.error(error)
        })
    },

    initGraphByEcharts: function(dom, width) {
      var nodes = []
      var self = this
      // 处理node数据
      for (var i = 0; i < this.nodes_rich.length; i++) {
        var node = this.nodes_rich[i]
        var nodeColor, shadowColor
        if (node.properties.uid === self.mainNode.properties.uid) {
          nodeColor = 'rgba(255,100,100, 1)'
          shadowColor = 'rgba(100, 100, 255, 1)'
        } else {
          nodeColor = 'rgba(255,255,255,1)'
          shadowColor = 'rgba(255, 255, 255, 1)'
        }
        nodes.push({
          name: node.identity,
          x: null,
          y: null,
          label: {
            position: 'top',
            formatter: function(params) {
              var uid = params.data.name
              var node_t = self.search_node_rich(uid)
              if (node_t !== false) {
                var labels = node_t.properties[self.pointText]
                if (labels === undefined || labels.length === 0) {
                  return node_t.properties[self.pointTextDefault]
                } else {
                  return labels
                }
              } else {
                return 'Unknown'
              }
            }
          },
          symbolSize: 18,
          itemStyle: {
            color: nodeColor,
            shadowColor: shadowColor,
            shadowBlur: 18
          }
        })
      }
      // 处理link数据
      var links = []
      for (i = 0; i < this.links_rich.length; i++) {
        var link = this.links_rich[i]
        links.push({
          source: link.source,
          target: link.target
        })
      }
      this.myGraph = echarts.init(dom)
      var option = {
        title: {
          text: ''
        },
        backgroundColor: {
          type: 'linear',
          x: 0,
          y: 1,
          x2: 0.6,
          y2: 0,
          colorStops: [{
            offset: 0, color: 'rgba(21,19,27,0.9)' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(21,19,27,1)' // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        tooltip: {
          trigger: 'item',
          formatter: function(params, ticket, callback) {
            if (params.dataType === 'edge' && params.seriesType === 'graph') {
              var data = params.data
              var link_rich = self.search_rich_link(data)
              var sourceNode = self.search_node_rich(data.source)
              var targetNode = self.search_node_rich(data.target)
              var html = '<div>' + sourceNode.properties.hostname + ' -> ' + targetNode.properties.hostname + ' : ' + link_rich.properties.serverPort + '</div>'
              return html
            } else {
              return ''
            }
          }
        },
        series: [
          {
            type: 'graph',
            layout: 'force',
            roam: true,
            symbol: 'circle',
            symbolSize: 30,
            cursor: 'pointer',
            focusNodeAdjacency: false,
            label: {
              position: 'middle',
              normal: {
                fontSize: 12,
                show: true
              }
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [1, 6],
            draggable: true,
            data: nodes,
            links: links,
            force: {
              initLayout: 'circle',
              repulsion: 1000
            },
            effect: {
              show: true,
              period: 6,
              trailLength: 0.7,
              color: '#fff',
              symbolSize: 3
            },
            lineStyle: {
              color: 'rgba(255,255,255,1)',
              width: 1,
              shadowColor: 'rgba(255, 255, 255, 1)',
              shadowBlur: 2
            }
          }
        ]
      } // end of option
      this.myGraph.setOption(option)
      this.myGraph.on('click', function(params) {
        var name = params.data.name
        var node = self.search_node_rich(name)
        if (node !== false) {
          self.node_hover = node
        }
        self.clickNodeHandle()
      })
    }, // end of initGraphByEcharts
    getNodesByUids: function(uids) {
      var self = this
      fetchListByUids({ uids: uids })
        .then(response => {
          var data = response.data.nodes
          var uids = []
          var nodes = []
          var nodes_rich = []
          for (let i = 0; i < data.length; i++) {
            const node = data[i]
            nodes_rich.push(node)
            uids.push(node.properties.uid)
            nodes.push({
              id: node.identity,
              group: 1,
              color: '#CCFFFF'
            })
          }
          self.nodes = nodes
          self.nodes_rich = nodes_rich
          self.mainNode = self.search_node_rich_by_uid(self.mainUid)
          self.getLinks(uids)
        })
        .catch(err => {
          this.fetchSuccess = false
          console.log(err)
        })
    },
    search_node_rich_by_uid: function(uid) {
      for (var i = 0; i < this.nodes_rich.length; i++) {
        var node = this.nodes_rich[i]
        if (node.properties.uid === uid) {
          return node
        }
      }
      return false
    },
    search_node_rich: function(identity) {
      for (var i = 0; i < this.nodes_rich.length; i++) {
        var node = this.nodes_rich[i]
        if (node['identity'] === identity) {
          return node
        }
      }
      return false
    },
    search_rich_link: function(link) {
      for (var i = 0; i < this.links_rich.length; i++) {
        var link_rich = this.links_rich[i]
        if (link['source'] === link_rich['source'] && link['target'] === link_rich['target']) {
          return link_rich
        }
      }
      return false
    },
    getNodesByIdNDeepth: function(identity, deepth) {
      var self = this
      var uids = [identity]
      fetchListByIdNDeepth({ identity: identity, deepth: deepth })
        .then(response => {
          var data = response['data']
          for (var i = 0; i < data['nodes'].length; i++) {
            var node = data['nodes'][i]
            uids.push(node['properties']['uid'])
          }
          self.getNodesByUids(uids)
          // var data = response['data']
          // this.tableData = data['nodes']
        })
        .catch(err => {
          this.fetchSuccess = false
          console.log(err)
        })
    }, // end of fetchListByIdNDeepth
    handleChange: function(value) {
      this.getNodesByIdNDeepth(this.mainUid, value)
    },
    pointChange: function() {
      this.getNodesByIdNDeepth(this.mainUid, this.deepth)
    },
    clickNodeHandle() {
      var message = '<div>' + this.node_hover.properties.hostname + '</div>'
      message += '<div>' + this.node_hover.properties.ips + '</div>'
      if (this.node_hover.properties.tags) {
        message += '<div>' + this.node_hover.properties.tags + '</div>'
      }

      this.$message({
        duration: 12000,
        type: 'success',
        dangerouslyUseHTMLString: true,
        message: message
      })
    }
  },
  mounted() {
    var params = this.$route.params
    this.mainUid = params.identity
    this.getNodesByIdNDeepth(this.mainUid, this.deepth)

    // this.getGraphData()
  },
  created() {}
}
</script>

<style scoped>
.chart-container {
  position: relative;
  padding: 0px;
  width: 100%;
  height: 100%;
}
#nodes-graph {
  width: 100%;
  height: 100%;
}
</style>