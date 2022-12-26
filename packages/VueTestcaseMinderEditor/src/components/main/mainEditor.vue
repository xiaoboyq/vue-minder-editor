<template lang="html">
  <div class="mind-editor" ref="editor"></div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import { markChangeNode } from "../../script/tool/utils";

export default {
  data() {
    return {
      previewTimer: null,
    };
  },
  props: {
    tags: Array,
    editNodeFn: Function
  },
  // 父组件中通过provide来提供变量，然后在子组件中通过inject来注入变量
  inject: ["main"],
  mounted() {
    var Editor = require("../../script/editor");
    var el = this.$el;
    var editor = (window.editor = new Editor(el));
    this.setEditor(editor);

    window.minder = window.km = editor.minder;
    this.setMinder(editor.minder);
    this.executeCallback();


    // 显示 note 浮层 kityminder-core 源码src/module/note.js NoteIconRenderer
    window.minder.on("shownoterequest", this.shownoterequest);

    // 对操作进行监听 node有变化时候 调用markChangeNode 对node属性进行修改 change: true
    window.minder.on('preExecCommand', function (env) {
      let selectNodes = env.minder.getSelectedNodes();
      let notChangeCommands = new Set(['camera', 'copy', 'expand', 'expandToLevel', 'hand',
        'layout', 'template', 'theme', 'zoom', 'zoomIn', 'zoomOut', 'append', 'appendchildnode', 'appendsiblingnode'])
      if (selectNodes && !notChangeCommands.has(env.commandName.toLocaleLowerCase())) {
        selectNodes.forEach((node) => {
          markChangeNode(node);
        })
      } 
      // if (env.commandName === 'paste') {
      //   selectNodes.forEach((node) => {
      //     node.data.contextChanged = false
      //   })
      // }
      console.log('env.commandName ', env.commandName )
      // if(env.commandName === 'movetoparent')
      if (env.commandName === 'movetoparent') {
        setTimeout(() => {
          let targetNode = minder.getSelectedNode();
          targetNode.parent.renderTree();
        }, 100);
      }
    });
    this.$emit("afterMount");
    // note 浮层隐藏
    document.addEventListener("wheel", this.main.hidePreviewer);
    document.addEventListener("mousedown", this.main.hidePreviewer);
    document.addEventListener("mousewheel", this.main.hidePreviewer);

    this.$once("hook:beforeDestroy", () => {
      document.removeEventListener("wheel", this.main.hidePreviewer);
      document.removeEventListener("mousedown", this.main.hidePreviewer);
      document.removeEventListener("mousewheel", this.main.hidePreviewer);
    });
    const that = this;
    if (this.$refs.editor) {
      this.$refs.editor.addEventListener('keydown', function (event) {
        const key = window.event.keyCode;
        if (key === 65 && event.ctrlKey) {
          // 监听ctrl+A组合键
          that.setConfig({ allowOperate: false });
          window.event.preventDefault(); // 关闭浏览器默认快捷键
          console.log('crtl+ a组合键')
        }
      })

      this.$refs.editor.addEventListener('click', function (event) {
        that.setConfig({ allowOperate: true });
        window.event.preventDefault(); // 关闭浏览器默认快捷键
      })
    }

    // 注册 tags
    // this.handleTagButton();
  },
  computed: {
    ...mapGetters("caseEditorStore", ["minder"]),
  },
  methods: {
    ...mapActions("caseEditorStore", ["executeCallback"]),
    ...mapMutations("caseEditorStore", ["setMinder", "setEditor", "setConfig"]),
    // 展示 note 的浮层
    shownoterequest(e) {
      // e.node.data 数据
      this.editNodeFn(e.node.data)

      // this.previewTimer = setTimeout(() => {
      //   this.main.preview(e.node, e.keyword);
      // }, 300);
    },
    hidenoterequest() {
      clearTimeout(this.previewTimer);
    },
  },
};
</script>

<style lang="scss">
@import "../../style/editor.scss";
</style>
