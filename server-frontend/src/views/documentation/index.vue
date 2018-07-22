<template>
  <div class="container">
    <el-row>
      <el-col  :md="24" :sm=24  class="doc-col">
        <a class="link-button" target='_blank' href="https://vapering.github.io/vaper/">
          <svg-icon icon-class="documentation" />
          Documentation
        </a>
      </el-col>
    </el-row>
    <el-row>
      <el-col  :md="24" :sm=24 class="doc-col">
        <a class="link-button" target='_blank' href="https://github.com/vapering/vaper">
          <svg-icon icon-class="github" />
          Github
        </a>
      </el-col>
    </el-row>
  </div>
</template>
<style scoped>
.link-button{
  height:90px;
  font-size:24px;
  border-style:solid;
  border-width:0px;
  border-color:#ffffff;
  background-color: #ffffff;
}
.link-button:hover{
  border-style:solid;
  border-width:0px 0px 2px 0px;
  border-color:#ffaaaa;
  background-color: #fafafa;
}
.doc-col{
  margin-top:30px;
  min-height:120px;
  text-align: center;
}
.container {
  position: relative;
  padding: 0px;
  width: 100%;
  height: 100%;
}
</style>

<script>
export default {
  name: 'documentation',
  data() {
    return {}
  }
}
</script>

