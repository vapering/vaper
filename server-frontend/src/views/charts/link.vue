<template>
<div class="chart-container">
  <el-row style="height:100%;">
    <el-col :md="6" :sm=24 >
      <div class="box-card" v-if="mainNode != undefined">
        <h3>{{$t('link.CentralNode')}}</h3>
        <div class="text item">
          {{$t('host.hostname')}}: {{mainNode.properties.hostname}}
        </div>
        <div class="text item">
          {{$t('host.ips')}}: {{mainNode.properties.ips}}
        </div>
        <div class="text item">
          {{$t('host.tag')}}: {{mainNode.properties.tags}}
        </div>
      </div>
      <div class="box-card" v-if="node_hover.identity != ''">
        <div class="text item">
          <h3>{{$t('link.SelectedNode')}} </h3>
        </div>
        <div class="text item">
          {{$t('host.hostname')}}: {{node_hover.properties.hostname}}
        </div>
        <div class="text item">
          {{$t('host.ips')}}: {{node_hover.properties.ips}}
        </div>
        <div class="text item">
          {{$t('host.tag')}}: {{node_hover.properties.tags}}
        </div>
      </div>
      <div class="box-card" >
        <el-form label-width="90px">
          <el-form-item :label="$t('link.deepth')">
            <el-input-number v-model="deepth" @change="handleChange" :min="1" :max="10" style="width:120px;"></el-input-number>
          </el-form-item>
          <!-- <el-form-item :label="$t('link.Dimension')">
            <el-radio-group v-model="dimension" @change="dimensionChange">
              <el-radio :label="2">2D</el-radio>
              <el-radio :label="3">3D</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item :label="$t('link.TextonNode')" >
            <el-select v-model="pointText" placeholder="choose" @change="pointChange">
              <el-option
                v-for="item in pointTextOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('link.ClusterK')">
            <el-input-number v-model="clusterK" :min="2" :max="100" style="width:120px;"></el-input-number>
          </el-form-item>
          <el-form-item v-if="isClusterReady">
            <el-button type="primary" @click="cluster">{{$t('link.Cluster')}}</el-button>
          </el-form-item>
        </el-form>

      </div>
      <div class="box-card" v-if="cluster_groups.length > 0">
        <div v-for="(item, key) in cluster_groups" :key="key">
          <br>
          Group {{key+1}}:
          <li v-for="(v, k) in item" :key="k" >
            {{v.id}};
            {{v.properties.hostname}};
            {{v.properties.ips}};
            {{v.properties.tags}};
          </li>
        </div>
      </div>
    </el-col>
    <el-col style="height:100%;" :md="18" :sm=24  >
      <div id="nodes-graph" >
        
      </div>
    </el-col>
  </el-row>
</div>
</template>

<script>
// import ForceGraph3D from '3d-force-graph'
// import * as echarts from 'echarts'
// import * as d3 from 'd3'

// import axios from 'axios'

import { fetchListByIdNDeepth } from '@/api/host'
import { fetchListByUids } from '@/api/host'
import { netflowSearch } from '@/api/link'
// import $ from 'jquery'

const kmeans = require('node-kmeans')

export default {
  name: 'HelloWorld',
  data() {
    return {
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
      isClusterReady: false,
      clusterK: 3,
      graph: {},
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
      pointTextDefault: 'hostname',
      cluster_groups: []
    }
  },
  methods: {
    /**
     * @augments id array
     */
    getLinks: function(uids) {
      var self = this
      netflowSearch({ uids: uids })
        .then(response => {
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
          self.initGraphByD3(this.nodes_rich, this.links)
          // for test
          // d3.json('/static/lib/miserables.with-ids.json', function(error, graph) {
          //   if (!error) {
          //     // console.log('graph', graph);
          //     self.initGraphByD3(graph.nodes, graph.links)
          //   } else {
          //     console.error(error)
          //   }
          // })// end of json
        })
        .catch(err => {
          this.fetchSuccess = false
          console.log(err)
        })
    },
    initGraphByD3: function(nodes, links) {
      var dom = document.getElementById('nodes-graph')
      // var width = $('#nodes-graph').width()
      var self = this
      dom.innerHTML = '<svg id="link-svg" />'
      // eslint-disable-next-line
      var svg = d3.select('#nodes-graph')
      var count = 0

      // eslint-disable-next-line
      var graph = createV4SelectableForceDirectedGraph(svg, { 'nodes': nodes, 'links': links }, function(graph) {
        if (graph.count >= (count + 300)) {
          count = graph.count
          self.graph = graph
          self.isClusterReady = true
          // 启动聚类
          // debugger
        }
        console.log(graph.nodes[0]['x'])
      })
    },
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
            node['id'] = node.identity
            node['group'] = 1
            // node['color'] = '#CCFFFF'
            node['name'] = node.properties[self.pointText]
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
    search_node_rich: function(uid) {
      for (var i = 0; i < this.nodes_rich.length; i++) {
        var node = this.nodes_rich[i]
        if (node['identity'] === uid) {
          return node
        }
      }
      return false
    },
    getNodesByIdNDeepth: function(identity, deepth) {
      var self = this
      self.isClusterReady = false
      var uids = [identity]
      fetchListByIdNDeepth({ identity: identity, deepth: deepth })
        .then(response => {
          console.log(response)
          var data = response['data']
          for (var i = 0; i < data['nodes'].length; i++) {
            var node = data['nodes'][i]
            uids.push(node['properties']['uid'])
          }
          self.getNodesByUids(uids)
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
    cluster: function() {
      // Create the data 2D-array (vectors) describing the data
      this.cluster_groups = []
      var nodes = this.graph.nodes
      const vectors = []
      for (let i = 0; i < nodes.length; i++) {
        vectors[i] = [nodes[i]['x'], nodes[i]['y']]
      }
      var res = kmeans.clusterize(vectors, { k: this.clusterK }, (err, res) => {
        if (err) console.error(err)
        else console.log('%o', res)
      })
      var groups = res.groups
      for (let i = 0; i < groups.length; i++) {
        const item = groups[i]
        var clusterInds = item.clusterInd
        for (let j = 0; j < clusterInds.length; j++) {
          const ind = clusterInds[j]
          nodes[ind]['group'] = i + 1
          if (!(i in this.cluster_groups)) {
            this.cluster_groups[i] = []
          }
          this.cluster_groups[i].push(nodes[ind])
        }
      }
      this.graph.nodes = nodes
      this.initGraphByD3(this.graph.nodes, this.graph.links)
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
  padding: 6px;
  width: 100%;
  height: 100%;
}
#nodes-graph {
  width: 100%;
  height: 100%;
}
.box-card{
  margin: 6px;
  padding:12px 6px;
  box-shadow: 0px 0px 6px 1px rgba(200,200,200,0.5)
}

#nodes-graph svg {
    border: 1px solid;
    font: 6px sans-serif;
    text-anchor: end;
}

#nodes-graph .node {
  stroke-width: 1px;
}

.node .selected {
  stroke: black;
}

line {
  stroke: #999;
}


</style>

