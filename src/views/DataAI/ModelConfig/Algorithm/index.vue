<template>
  <NormalPanel title="模型算法各（学习和检测）设置" :can-save="canSave" @requireSave="requireSave">
    <el-col :span="12">
      <el-form class="normal-form" label-width="8rem">
        <el-tooltip content="仅此而已，将跟踪这么多主机标识符">
          <el-form-item label="主机最大追踪数">
            <el-input-number
              v-model="data.HostLimit"
              controls-position="right"
              :step="config.step"
              :min="0"
              :precision="0"
              @change="(cur,prev)=>handleChange(cur,prev,config)"
            />
          </el-form-item>
        </el-tooltip>
        <el-tooltip content="不再需要跟踪每个主机的这么多传出通道（定期清除）">
          <el-form-item label="单台最大追踪数">
            <el-input-number
              v-model="data.HostSimplexLimit"
              controls-position="right"
              :step="config.step"
              :min="0"
              :precision="0"
              @change="(cur,prev)=>handleChange(cur,prev,config)"
            />
          </el-form-item>
        </el-tooltip>
        <el-tooltip content="KitNET实例中所有自动编码器的默认随机梯度下降学习率。">
          <el-form-item label="梯度下降学习率">
            <el-slider
              v-model="data.learning_rate"
              :min="0"
              :max="1"
              :step="0.001"
              :format-tooltip="(v)=>`${Math.floor(v*1000)/10}%`"
            />
          </el-form-item>
        </el-tooltip>
        <el-tooltip content="隐藏神经元与可见神经元的默认比例。例如0.75将在隐藏层中造成大约25％的压缩。">
          <el-form-item label="隐含层">
            <el-slider
              v-model="data.hidden_ratio"
              :min="0"
              :max="1"
              :step="0.001"
              :format-tooltip="(v)=>`${Math.floor(v*1000)/10}%`"
            />
          </el-form-item>
        </el-tooltip>
      </el-form>
    </el-col>
    <el-col :span="12">
      <el-form class="normal-form" label-width="8rem">
        <el-tooltip content="集成层中任何自动编码器的最大大小">
          <el-form-item label="最大编码层数">
            <el-input-number
              v-model="data.AE"
              controls-position="right"
              :step="config.step"
              :min="0"
              :precision="0"
              @change="(cur,prev)=>handleChange(cur,prev,config)"
            />
          </el-form-item>
        </el-tooltip>
        <el-tooltip content="学习特征映射所用实例的数量（集成的体系结构）">
          <el-form-item label="学习样本">
            <el-input-number
              v-model="data.item_learn"
              controls-position="right"
              :step="config.step"
              :min="0"
              :precision="0"
              @change="(cur,prev)=>handleChange(cur,prev,config)"
            />
          </el-form-item>
        </el-tooltip>
        <el-tooltip content="用于训练异常检测器的实例数（整体本身）">
          <el-form-item label="测试样本">
            <el-input-number
              v-model="data.item_test"
              controls-position="right"
              :step="config.step"
              :min="0"
              :precision="0"
              @change="(cur,prev)=>handleChange(cur,prev,config)"
            />
          </el-form-item>
        </el-tooltip>
        <el-tooltip content="选择已关联训练过的结果集直接用于测试">
          <el-form-item label="大脑选取">
            <el-select v-model="data.Brain" default-first-option placeholder="选择大脑">
              <el-option v-for="item in config.Brains" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-tooltip>
        <el-tooltip content="跟踪每个流的“窗口大小”（衰减因子）列表。 nan解析为默认值[5,3,1，.1，.01]">
          <el-form-item label="拉姆达系数">
            <el-select v-model="data.Lambdas" multiple allow-create placeholder="选择或输入系数">
              <el-option v-for="item in config.Lambdas" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-tooltip>
      </el-form>
    </el-col>
  </NormalPanel>
</template>

<script>
import NormalPanel from '../../components/NormalPanel'
import { debounce } from '@/utils'
export default {
  name: 'Algorithm',
  components: { NormalPanel },
  data: () => ({
    canSave: false,
    data: {
      Lambdas: [5, 3, 1, 0.1, 0.01],
      HostLimit: 65535,
      HostSimplexLimit: 65535,
      learning_rate: 0.1,
      hidden_ratio: 0.75,
      AE: 10,
      item_learn: 5000,
      item_test: 50000,
      feature_map: null,
      Brain: 'Default'
    },
    config: {
      step: 1,
      Lambdas: [5, 3, 1, 0.1, 0.01],
      Brains: ['Default', '20201103测试', '50亿数据包测试', 'nsfocus扫描预警测试']
    }
  }),
  computed: {
    requireToStep1() {
      return debounce(() => {
        this.reset()
      }, 300)
    }
  },
  watch: {
    data: {
      handler(val) {
        this.canSave = true
      }, deep: true
    }
  },
  methods: {
    requireSave(cb) {
      this.canSave = false
      cb('完成')
    },
    reset() {
      this.config.step = 1
    },
    handleChange(cur, prev, config) {
      this.requireToStep1()
      config.step = Math.floor(config.step * 1.1 + 1)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../style';
</style>
