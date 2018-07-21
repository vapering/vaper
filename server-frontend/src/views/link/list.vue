<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
        <div style="margin-bottom:10px;">
        </div>
        <el-table :data="tableData" style="width: 100%" :stripe="true" :border="false" >
          <el-table-column prop="identity" label="identity"></el-table-column>
           <el-table-column prop="clientIp" label="client ip"></el-table-column>
          <el-table-column prop="serverIp" label="server ip"></el-table-column>
          <el-table-column prop="server_port" label="port"></el-table-column>
          <el-table-column prop="process_name" label="process name"></el-table-column>
          
          <el-table-column prop="pps" label="Packages per second"></el-table-column>
          <el-table-column prop="time" label="Update" :formatter="timeUnixToHuman"></el-table-column>
          
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
  </div>
</template>


<script>
import { fetchLinks } from '@/api/link'
import { getLinksCount } from '@/api/link'
import { dateFormat } from '@/filters/'

export default {
  name: 'hostlist',
  data() {
    return {
      form: {
        name: '',
        ips: ''
      },
      tableData: [],
      fetchSuccess: true,
      tableSelections: [],
      dialogVisible: false,
      hostInEdit: {},
      tagInputVisible: false,
      tagInputValue: '',
      page: {
        currentPage: 1,
        size: 10,
        total: 5
      }
    }
  },
  methods: {
    loadData: function() {
      var param = {}
      param['skip'] = this.page.size * (this.page.currentPage - 1)
      param['limit'] = this.page.size * this.page.currentPage
      fetchLinks(param)
        .then(response => {
          console.log(response)
          var data = response['data']
          this.tableData = data['links']
        })
        .catch(err => {
          this.fetchSuccess = false
          console.log(err)
        })
    },
    handleCurrentChange: function(val) {
      this.page.currentPage = val
      this.loadData()
    },
    handleSizeChange: function(val) {
      this.page.size = val
      this.loadData()
    },
    timeUnixToHuman: function(row, column, unixStamp, index) {
      var date = new Date(unixStamp * 1000)
      var text = dateFormat(date, 'yyyy-MM-dd hh:mm')
      return text
    }
  },
  mounted() {
    var self = this
    getLinksCount()
      .then(response => {
        console.log(response)
        var data = response['data']
        self.page.total = parseInt(data['linksCount'])
      })
      .catch(err => {
        this.fetchSuccess = false
        console.log(err)
      })
  },
  created() {
    this.loadData()
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

