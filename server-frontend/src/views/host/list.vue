<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
          <el-form ref="form" :model="form" :inline="true">
            <el-form-item :label="$t('host.hostname')">
              <el-input v-model="form.hostname"></el-input>
            </el-form-item>      
            <el-form-item :label="$t('host.ips')">
              <el-input v-model="form.ip"></el-input>
            </el-form-item>      
            <el-form-item :label="$t('host.tag')">
              <el-input v-model="form.tag"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="fetchHostList">{{$t('host.search')}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="reset">{{$t('host.reset')}}</el-button>
            </el-form-item>
          </el-form>

      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
          <div style="margin-bottom:10px;">
            <el-button-group>
              <!-- <el-button type="primary" icon="el-icon-edit">Edit Nickname</el-button>-->
              <el-button :disabled="!(tableSelections.length > 0)" type="primary" icon="el-icon-delete" @click="deleteHosts">{{$t('table.delete')}}</el-button> 
            </el-button-group>
          </div>
          <el-table :data="tableData" style="width: 100%" :stripe="true" :border="false" @selection-change="selectionChange" v-loading="tableLoading">
            <el-table-column
              type="selection"
              width="30">
            </el-table-column>
            <el-table-column prop="identity" :label="$t('host.chart')" width="90px">
              <template slot-scope="scope">
                <router-link :to="'/charts/link/' + scope.row.properties.uid + '/0/0/1'"><svg-icon icon-class="wang" class="links-icon"/></router-link>
              </template>
            </el-table-column>
            <el-table-column prop="properties.hostname" :label="$t('host.hostname')"></el-table-column>
            <!-- <el-table-column prop="properties.uid" label="Unique Id"></el-table-column> -->
            <el-table-column :label="$t('host.ips')">
              <template slot-scope="scope">
                <div v-for="ip in scope.row.properties.ips" :key="ip">
                  {{ip}}
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('host.tag')" >
              <template slot-scope="scope">
                <el-tag
                  :key="tag"
                  v-for="tag in scope.row.properties.tags"
                  :disable-transitions="false"
                  v-if="scope.row.properties.tags">
                  {{tag}}
                </el-tag>

              </template>
            </el-table-column>
            <el-table-column :label="$t('host.action')">
              <template slot-scope="scope">
                <el-button type="default" size="mini" icon="el-icon-edit" @click="editHost(scope.row)"></el-button>
                <!-- <el-button type="default" size="mini" icon="el-icon-delete"></el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.currenPage"
            :page-sizes="[5, 10, 30, 50]"
            :page-size="page.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total">
          </el-pagination>
      </el-col>
    </el-row>
    <el-dialog
      title="EDIT"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleEditClose">
      <div v-if="hostInEdit.identity">
        <p>hostname: {{hostInEdit.properties.hostname}}</p>
        <p>ip:<span v-for="ip in hostInEdit.properties.ips" :key="ip">{{ip}};</span></p>
        <div>
          <el-tag
            :key="tag"
            v-for="tag in hostInEdit.properties.tags"
            closable
            :disable-transitions="false"
            @close="tagHandleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="tagInputVisible"
            v-model="tagInputValue"
            ref="saveTagInput"
            size="mini"
            @keyup.enter.native="tagHandleInputConfirm"
            @blur="tagHandleInputConfirm"
            >
          </el-input>
          <el-button v-else class="button-new-tag" size="mini" @click="tagShowInput">+ New Tag</el-button>
        </div>
        <div slot="footer" class="dialog-footer">

        </div>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { fetchList, updateTags, getHostCount } from '@/api/host'
import { remove as hostRemove } from '@/api/host'

export default {
  name: 'hostlist',
  data() {
    return {
      form: {
        hostname: '',
        ip: '',
        tag: ''
      },
      tableData: [],
      fetchSuccess: true,
      tableSelections: [],
      dialogVisible: false,
      hostInEdit: {},
      tagInputVisible: false,
      tagInputValue: '',
      search_hostname: '',
      page: {
        currentPage: 1,
        size: 10,
        total: 5
      },
      tableLoading: false
    }
  },
  methods: {
    editHost: function(host) {
      this.dialogVisible = true
      this.hostInEdit = host
    },
    deleteHosts: function() {
      var uids = []
      var self = this
      for (let index = 0; index < this.tableSelections.length; index++) {
        const element = this.tableSelections[index]
        uids.push(element['properties']['uid'])
      }

      hostRemove({ uids })
        .then(response => {
          self.fetchHostList()
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleEditClose: function() {
      this.dialogVisible = false
      this.hostInEdit = {}
    },
    tagHandleClose: function(tag) {
      // 删除这个节点的tag
      this.hostInEdit.properties.tags.splice(
        this.hostInEdit.properties.tags.indexOf(tag),
        1
      )
      this.updateHostTags()
    },
    tagHandleInputConfirm: function() {
      // 新增tag
      var newTag = this.tagInputValue
      this.tagInputVisible = false
      this.tagInputValue = ''
      if (this.hostInEdit.properties.tags === undefined) {
        this.hostInEdit.properties.tags = []
      }
      if (newTag === '') {
        return
      }
      this.hostInEdit.properties.tags.push(newTag)
      this.updateHostTags()
    },
    updateHostTags: function() {
      var param = {
        uid: this.hostInEdit.properties.uid,
        tags: this.hostInEdit.properties.tags
      }
      var self = this
      updateTags(param)
        .then(response => {
          console.log(response)
          self.fetchHostList()
        })
        .catch(err => {
          this.fetchSuccess = false
          console.log(err)
        })
    },
    tagShowInput() {
      this.tagInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    reset: function() {
      this.form = {
        hostname: '',
        ip: '',
        tag: ''
      }
      this.fetchHostList()
    },
    fetchHostList: function() {
      this.freshHostCount()
      this.tableLoading = true
      this.form['skip'] = this.page.size * (this.page.currentPage - 1)
      this.form['limit'] = this.page.size * this.page.currentPage
      fetchList(this.form)
        .then(response => {
          console.log(response)
          var data = response['data']
          this.tableData = data['nodes']
          this.tableLoading = false
        })
        .catch(err => {
          this.fetchSuccess = false
          this.tableLoading = false
          console.log(err)
        })
    },
    freshHostCount: function() {
      var self = this
      getHostCount()
        .then(response => {
          var data = response['data']
          self.page.total = parseInt(data['node_count'])
        })
        .catch(err => {
          console.log(err)
        })
    },

    handleCurrentChange: function(val) {
      this.page.currentPage = val
      this.fetchHostList()
    },
    handleSizeChange: function(val) {
      this.page.size = val
      this.fetchHostList()
    },
    selectionChange: function(selection) {
      this.tableSelections = selection
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  mounted() {},
  created() {
    this.fetchHostList()
  }
}
</script>

<style scoped>
.content-container {
  position: relative;
  padding: 20px;
  width: 100%;
  height: 85vh;
}
.box-card {
  margin: 0px 5px;
}
.links-icon {
  width: 24px;
  height: 24px;
}
.input-new-tag {
  width: 100px;
}
</style>

