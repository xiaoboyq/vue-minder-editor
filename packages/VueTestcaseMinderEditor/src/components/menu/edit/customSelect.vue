<template>
  <div>
    <el-select
      v-model="sourceSelectedData"
      filterable
      clearable
      :popper-append-to-body="true"
      collapse-tags
      default-first-option
      :placeholder="`请选择${sourceData.key}`"
      :disabled="commandDisabled||isDisableSelect"
      @change="handleChange"
    >
      <el-option
        v-for="(item, index) in sourceData.options"
        :key="index.text"
        :value="item.text"
        :label="item.text"
      />
    </el-select>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "CustomSelect",
  props: {
    data: Object
  },
  computed: {
    ...mapGetters("caseEditorStore", {
      minder: "getMinder",
      editor: "getEditor",
    }),
    commandDisabled() {
      let minder = this.minder;
      minder.on && minder.on("interactchange", this.handleInteractChange);
      return (
        this.minder.queryCommandState &&
        this.minder.queryCommandState("custom") === -1
      );
    },
  },
  data() {
    return {
      sourceData: {},
      isDisableSelect: false,
      sourceSelectedData: '',
      isInteracting: false
    };
  },
  mounted () {
    if (this.data) {
      this.sourceData = this.data
    }
  },
  watch: {
    sourceSelectedData: {
      // immediate: true,
      deep: true,
      handler: function (val, oVal) {
        const originKey = this.sourceData.key
        if (val || val === 0) {
          let selected = this.minder.queryCommandValue('custom')
          selected = selected.filter(v => v.split('：')[0] !== originKey)
          let custom = [`${this.sourceData.key}：${val}`]
          custom = [...custom, ...selected]
          this.minder.execCommand('custom', custom)
        } else {
          let selected = this.minder.queryCommandValue('custom')
          selected = selected.filter(v => v.split('：')[0] !== originKey)
          this.minder.execCommand('custom', selected)
        }
      }
    }
  },
  methods: {
    // 限制标签 只能在用例下才可以添加
    tagEditCheck () {
      const minder = window.minder
      if (!minder) return false
      const selectNodes = minder.getSelectedNodes()
      if (selectNodes && selectNodes.length > 0) {
        for (let index = 0; index < selectNodes.length; index++) {
          const element = selectNodes[index]
          if (!element.data.resource || !element.data.resource.includes('用例')) {
            // this.$message.warning('只能在用例中添加')
            return false
          }
        }
      }
      return true
    },

    handleChange (currentVal) {
      this.sourceSelectedData = currentVal
    },
    handleInteractChange () {
      if (this.tagEditCheck) {
        if (!this.tagEditCheck()) {
          this.isDisableSelect = true;
          return;
        } else {
          this.isDisableSelect = false;
        }
      }
      const selected = this.minder.queryCommandValue('custom')
      // console.log('this.sourceData', this.sourceData)
      // console.log('selected', selected)
      if (!this.sourceData) {
        return
      }
      // 修复当 CustomCommand 被禁用时，selected 为 null 导致下面的 selected.indexOf 报错，
      // 引起整个 handleInteractChange 后续都不会被触发的问题
      if (selected === null) {
        return
      }
      let flag = false // 记录是否有选择的标签
      if (selected.length > 0) {
        selected.forEach(element => {
          const currentSelect = element.split('：')
          if (this.sourceData.key === currentSelect[0]) {
            flag = true
            this.sourceSelectedData = currentSelect[1]
          }
        })
        if (!flag) {
          this.sourceSelectedData = ''
        }
      } else {
        this.sourceSelectedData = ''
      }
      this.isInteracting = true
      this.$nextTick(() => {
        this.isInteracting = false
      });
    },
  },
};
</script>
