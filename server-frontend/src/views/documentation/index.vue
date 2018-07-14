<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col  :md="8" :sm=24 style="margin-top:200px;">
      <a class="link-button" target='_blank' href="https://vapering.github.io/vaper/">
        <svg-icon icon-class="documentation" />
        Documentation
      </a>
      <a class="link-button" target='_blank' href="https://github.com/vapering/vaper">
        <svg-icon icon-class="github" />
        Github
      </a>
    </el-col>
  </el-row>
</template>
<style scoped>
.link-button{
  width:100%;
  height:180px;
  font-size:36px;
  padding:20px;
  margin:50px;
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
</style>

<script>
export default {
  name: 'documentation',
  data() {
    return {}
  }
}
</script>

