<template>
  <div class="frame-container center-letter">
    <el-row :gutter="20">
      <el-col :span="5">
        <Config />
      </el-col>
      <el-col :span="19" style="height:100%">
        <Statistics />
        <el-row>
          <el-col>
            <Algorithm />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <Log title="系统日志" res="system" />
      </el-col>
      <el-col :span="12">
        <Log title="用户操作日志" res="user" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Statistics from './Statistics'
import Config from './Config'
import Algorithm from './Algorithm'
import Log from './Log'
export default {
  name: 'ModelConfig',
  components: { Config, Statistics, Algorithm, Log }
}
</script>
<style lang="scss" scoped>
@import '../style';
.center-letter {
  letter-spacing: 1rem;
  text-align: center;
}
@import '../style';
</style>
