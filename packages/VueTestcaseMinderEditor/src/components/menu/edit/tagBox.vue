<template lang="">
  <div class="tags-group" :disabled="commandDisabled">
    <el-tag v-for="(item, index) in tags"
            :key="item"
            size="small"
            :color="getResourceColor(item)"
            @click="editResource(item)">{{item}}</el-tag>
  </div>
  </template>
<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "TagBox",
  props: {
    tags: {
      type: Array,
      default: []
    },
    tagEditCheck: Function,
    distinctTags: {
      type: Array,
      default: []
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("caseEditorStore", {
      minder: "getMinder",
      editor: "getEditor",
    }),
    commandDisabled() {
      let minder = this.minder;
      if (!minder) return true;
      let that = this;
      minder.on && minder.on('interactchange', function () {
        this.commandValue = minder.queryCommandValue('resource');
      });
      return minder.queryCommandState && minder.queryCommandState('resource') === -1;
    },
  },
  methods: {
    editResource(resourceName) {
      if (this.commandDisabled) {
        return;
      }
      if (this.tagEditCheck) {
        if (!this.tagEditCheck(resourceName)) {
          return;
        }
      }

      let origin = this.minder.queryCommandValue('resource');
      if (!resourceName || !/\S/.test(resourceName)) return;
      let index = origin.indexOf(resourceName);
      // 先删除排他的标签
      if (this.distinctTags.indexOf(resourceName) > -1) {
        for (let i = 0; i < origin.length; i++) {
          if (this.distinctTags.indexOf(origin[i]) > -1) {
            origin.splice(i, 1);
            i--;
          }
        }
      }
      if (index != -1) {
        this.minder.execCommand('custom', [])
        this.minder.execCommand("note", '');
        origin.splice(index, 1);
        this.minder.execCommand('resource', origin);
      } else {
        origin.push(resourceName);
        this.minder.execCommand('resource', origin);
        if (origin.includes('用例')) {
          this.minder.execCommand("note", '0');
        } else {
          this.minder.execCommand("note", '');
        }
      }
      // this.minder.execCommand("", 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png', '测试');
    },
    getResourceColor(resource) {
      if (this.minder && this.minder.getResourceColor) {
        return this.minder.getResourceColor(resource).toHEX();
      }
    },

    isActive(index) {
      return (
        this.minder.queryCommandValue &&
        this.minder.queryCommandValue("resource") == index
      );
    },
    title(index) {
      switch (index) {
        case 0:
          return "移除结果：Alt+D";
        case 1:
          return "成功：Alt+G";
        case 2:
          return "失败：Alt+F";
        case 3:
          return "跳过：Alt+S";
        default:
          return "";
      }
    },
  },
  created() {},
};
</script>

<style scoped>

 .el-tag {
   margin-right: 4px;
   border: 0px;
   color: black;
 }

 .el-tag:hover {
   cursor: pointer;
 }

 .el-tag:first-child {
   margin-left: 4px;
 }
</style>
