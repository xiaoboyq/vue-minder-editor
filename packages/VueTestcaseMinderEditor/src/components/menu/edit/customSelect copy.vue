<template>
  <div>
    <el-select
      v-model="sourceSelectedData"
      filterable
      :popper-append-to-body="true"
      collapse-tags
      default-first-option
      placeholder="请选择自定义标签"
      :disabled="commandDisabled"
      @change="handleChange"
    >
    <!-- @change="handleChange" -->

      <el-option
        v-for="(item, index) in sourceData.options"
        :key="index.name"
        :value="item.name"
        :label="item.name"
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
      sourceSelectedData: [],
      isInteracting: false,
    };
  },
  mounted () {
    if (this.data) {
      this.sourceData = this.data
    }
  },
  watch: {
    // sourceData: {
    //   immediate: true,
    //   handler: function (val, oVal) {
    //     if (!val.options) return
    //     if (
    //       this.minder.queryCommandState("custom") != -1 &&
    //       this.sourceData&& this.sourceData.options
    //     ) {
    //       let custom = this.sourceData.options
    //         .filter(function (custom) {
    //           return custom.selected;
    //         })
    //         .map(function (custom) {
    //           return `${val.key}：${custom.name}`;
    //         });

    //         let custom = [`${val.}：${sourceSelectedData}`]
    //       if (this.isInteracting) {
    //         return;
    //       }
    //       const selected = this.minder.queryCommandValue('custom')
    //       custom = [...selected, ...custom]
    //       this.minder.execCommand("custom", custom);
    //     }
    //   },
    //   deep: true,
    // },
    sourceSelectedData: {
      // immediate: true,
      deep: true,
      handler: function (val, oVal) {
        const selected = this.minder.queryCommandValue('custom')
        let custom = [`${this.sourceData.key}：${val}`]
        custom = [...selected, ...custom]
        console.log('custom', custom)

        this.minder.execCommand('custom', custom)
      }
    }
  },
  methods: {
    handleChange (currentVal) {
      this.sourceSelectedData = currentVal
      // const custom = this.sourceData.options.
      //   filter(function (custom) {
      //     return custom.selected;
      //   })
      //   .map(function (custom) {
      //     return custom.name;
      //   });
      // if (!!currentVal && custom.indexOf(currentVal) === -1) {
      //   this.sourceData.options = this.sourceData.options.map(v => ({ ...v, selected: v.name === currentVal }))
      // }
    },
    handleInteractChange () {
      const selected = this.minder.queryCommandValue('custom')
      if (!this.sourceData) {
        return
      }
      // 修复当 CustomCommand 被禁用时，selected 为 null 导致下面的 selected.indexOf 报错，
      // 引起整个 handleInteractChange 后续都不会被触发的问题
      if (selected === null) {
        return
      }
      if (selected.length > 0) {
        const currentSelect = selected[0].split('：')
        if (this.sourceData.key === currentSelect[0]) {
          this.sourceSelectedData = currentSelect[1]
        }
      }
      // const used = this.sourceData.options.map(v => {
      //   return {
      //     ...v,
      //     selected: selected.indexOf(v.name) > -1
      //   }
      // })

      // this.sourceData = { ...this.sourceData, options: used }
      this.isInteracting = true
      this.$nextTick(() => {
        this.isInteracting = false
      });
    },
  },
};
</script>
