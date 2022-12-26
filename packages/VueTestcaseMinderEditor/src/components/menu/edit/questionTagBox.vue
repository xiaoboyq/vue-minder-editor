<template lang="">
  <div class="question-tags-group" :disabled="commandDisabled">
    <button title="移除" @click="editResource()"  style="padding: 4px; margin-right: 10px; height: 28px; border: none; cursor: pointer">
      <i aria-label="图标: minus-circle" class="anticon anticon-minus-circle" style="font-size: 18px; color: rgba(0, 0, 0, 0.6);"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="minus-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm192 472c0 4.4-3.6 8-8 8H328c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h368c4.4 0 8 3.6 8 8v48z"></path></svg></i>
    </button>
    <el-tag v-for="item in tags"
      :key="item"
      size="small"
      :color="getQuestionColor(item)"
      @click="editResource(item)">{{item}}</el-tag>
  </div>
  </template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "TagBox",
  props: {
    tags: {
      type: Array,
      default: [],
    },
    // tagEditCheck: Function,
    distinctTags: {
      type: Array,
      default: [],
    },
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
      minder.on &&
        minder.on("interactchange", function () {
          this.commandValue = minder.queryCommandValue("question");
        });
      return (
        minder.queryCommandState && minder.queryCommandState("question") === -1
      );
    },
  },
  methods: {
    editResource(questionName) {
      if (!questionName) {
        this.minder.execCommand("question", []);
        return;
      }
      if (this.commandDisabled) {
        return;
      }
      if (this.tagEditCheck) {
        if (!this.tagEditCheck(questionName)) {
          return;
        }
      }

      let origin = this.minder.queryCommandValue("question");
      if (!questionName || !/\S/.test(questionName)) return;
      let index = origin.indexOf(questionName);
      // 先删除排他的标签
      if (this.distinctTags.indexOf(questionName) > -1) {
        for (let i = 0; i < origin.length; i++) {
          if (this.distinctTags.indexOf(origin[i]) > -1) {
            origin.splice(i, 1);
            i--;
          }
        }
      }
      if (index != -1) {
        origin.splice(index, 1);
      } else {
        origin.push(questionName);
      }
      this.minder.execCommand("question", origin);
    },
    getQuestionColor(question) {
      if (this.minder && this.minder.getQuestionColor) {
        return this.minder.getQuestionColor(question).toHEX();
      }
    },

    isActive(index) {
      return (
        this.minder.queryCommandValue &&
        this.minder.queryCommandValue("question") === index
      );
    },
    // 限制标签 只能在用例下才可以添加
    tagEditCheck () {
      const minder = window.minder
      if (!minder) return false
      const selectNodes = minder.getSelectedNodes()
      if (selectNodes && selectNodes.length > 0) {
        for (let index = 0; index < selectNodes.length; index++) {
          const element = selectNodes[index]
          console.log('element.data', element.data)
          if (!element.data.resource || !element.data.resource.includes('用例')) {
            this.$message.warning('只能在用例中添加')
            return false
          }
        }
      }
      return true
    },

    title(index) {
      switch (index) {
        case 0:
          return "移除";
        default:
          return "";
      }
    },
  },
};
</script>

<style scoped>
.question-tags-group {
  padding: 0 10px;
}

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
