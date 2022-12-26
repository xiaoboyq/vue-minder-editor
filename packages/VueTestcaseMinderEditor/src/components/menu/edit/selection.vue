<template lang="">
<div class="selection-group">

  <el-button class="tab-icons selection" @click="selectAll"></el-button>
  <el-row class="block-col-1">
    <el-col :span="24">
      <el-dropdown trigger="click" :hide-on-click="true" class="dropdown-toggle menu-btn" @command="handleCommand">
        <span class="el-dropdown-link ">
          全选
          <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="selection-dropdown-list">
          <el-dropdown-item class="selection-1 dropdown-item" command="1">反选</el-dropdown-item>
          <el-dropdown-item class="selection-2 dropdown-item" command="2">选择兄弟节点</el-dropdown-item>
          <el-dropdown-item class="selection-3 dropdown-item" command="3">选择同级节点</el-dropdown-item>
          <el-dropdown-item class="selection-4 dropdown-item" command="4">选择路径</el-dropdown-item>
          <el-dropdown-item class="selection-5 dropdown-item" command="5">选择子树</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

export default {
  name: 'selection',
  computed: {
    ...mapGetters("caseEditorStore", ["config"]),
  },
  methods: {
    ...mapMutations("caseEditorStore", ["setConfig"]),
    selectAll() {
      var selection = [];
      minder.getRoot().traverse(function (node) {
        selection.push(node);
      });
      this.setConfig({ allowOperate: false });
      minder.select(selection, true);
      minder.fire('receiverfocus');
    },

    selectRevert() {
      var selected = minder.getSelectedNodes();
      var selection = [];
      minder.getRoot().traverse(function (node) {
        if (selected.indexOf(node) == -1) {
          selection.push(node);
        }
      });
      minder.select(selection, true);
      minder.fire('receiverfocus');
    },

    selectSiblings() {
      var selected = minder.getSelectedNodes();
      var selection = [];
      selected.forEach(function (node) {
        if (!node.parent) return;
        node.parent.children.forEach(function (sibling) {
          if (selection.indexOf(sibling) == -1) selection.push(sibling);
        });
      });
      minder.select(selection, true);
      minder.fire('receiverfocus');
    },

    selectLevel: function () {
      var selectedLevel = minder.getSelectedNodes().map(function (node) {
        return node.getLevel();
      });
      var selection = [];
      minder.getRoot().traverse(function (node) {
        if (selectedLevel.indexOf(node.getLevel()) != -1) {
          selection.push(node);
        }
      });
      minder.select(selection, true);
      minder.fire('receiverfocus');
    },

    selectPath: function () {
      var selected = minder.getSelectedNodes();
      var selection = [];
      selected.forEach(function (node) {
        while (node && selection.indexOf(node) == -1) {
          selection.push(node);
          node = node.parent;
        }
      });
      minder.select(selection, true);
      minder.fire('receiverfocus');
    },

    selectTree: function () {
      var selected = minder.getSelectedNodes();
      var selection = [];
      selected.forEach(function (parent) {
        parent.traverse(function (node) {
          if (selection.indexOf(node) == -1) selection.push(node);
        });
      });
      minder.select(selection, true);
      minder.fire('receiverfocus');
    },
    hasRootNode(selectedNodes) {
      console.log(!!selectedNodes.filter(v => v.type === 'root').length)
      return !!selectedNodes.filter(v => v.type === 'root').length
    },

    handleCommand(command) {
      var selected = minder.getSelectedNodes();
      switch (~~command) {
        case 1:
          if (selected && selected.length) {
            this.setConfig({ allowOperate: true });
          } else {
            this.setConfig({ allowOperate: false });
          }
          this.selectRevert()
          break;
        case 2:
          this.setConfig({ allowOperate: true });
          this.selectSiblings()
          break;
        case 3:
          // this.setConfig({ allowOperate: true });
          this.selectLevel()
          break;
        case 4:
          // this.setConfig({ allowOperate: true });
          this.selectPath()
          break;
        case 5:
          console.log('selected', selected)
         
          if (selected && selected.length && this.hasRootNode(selected)) {
            this.setConfig({ allowOperate: false });
          } else {
            this.setConfig({ allowOperate: true });
          }
          this.selectTree()
          break;
      }
    }
  }
}
</script>
<style scoped>
  .dropdown-item {
    cursor: pointer;
  }
</style>
