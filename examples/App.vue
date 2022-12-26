<template>
  <div id="app">
    <VueTestcaseMinderEditor
      :initJson="initJson"
      ref="minderEditor"
      :allowEditPriority="editMode"
      :allowEditLabel="editMode"
      :allowEditResult="!editMode"
      :tags="tags"
      :customArr="customArr"
      :editNodeFn="editNodeFn"
      :allowEditNode="editMode">
    </VueTestcaseMinderEditor>

    <button :style="{left: '0px'}" v-on:click="logCurrentData">打印当前用例 json 至 console 日志</button>
    <button :style="{left: '0px'}" v-on:click="toggleEditMode">{{ buttonText }} 123123</button>
  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      customArr: [
        {
          key: 'name1', 
          options: [
            {value: 1, text: '测试啊'},
            {value: 2, text: 2},
            {value: 3, text: 3},
            {value: 31, text: 3},
            {value: 32, text: 4},
            {value: 33, text: 5},
            {value: 34, text: 6},
            {value: 35, text: 7},
            {value: 36, text: 8},
            {value: 36, text: 9},
          ]
        },
        {
          key: 'name2',
          options: [
            {value: 1, text: 1},
            {value: 2, text: 2},
            {value: 3, text: 3},
          ]
        },
      ],
      initJson: {
        root: {
          data: {
            text: '百度产品',
            id: '0'
          },
          children: [
            { data: { text: '新闻', id: '1', resource: ['自定义标签'] } },
            { data: { text: '网页', id: '2', priority: 1 } },
            { data: { text: '贴吧', id: '3', priority: 2 } },
            { data: { text: '知道', id: '4', priority: 2 } },
            { data: { text: '音乐', id: '5', priority: 3 } },
            { data: { text: '图片', id: '6', priority: 3 } },
            { data: { text: '视频', id: '7', priority: 3 } },
            { data: { text: '地图', id: '8', priority: 3, note: 34 } },
            { data: { text: '百科', id: '9', priority: 3, note: '' } },
            { data: { text: '更多', id: '10', hyperlink: 'http://www.baidu.com/more' } }
          ]
        },
        template: 'right'

      },
      tags: ['模块1', '用例', '前置条件', '测试步骤', '预期结果', '备注'],
      editMode: false
    }
  },
  computed: {
    buttonText: function() {
      return this.editMode === false ? '进入编辑模式，允许修改脑图内容及登记结果' : '退出编辑模式'
    }
  },
  // mounted () {
  //   this.$nextTick(() => {
  //     if (window.minder) {
  //       window.minder.on && window.minder.on('click', function (e) {
  //         console.log('e', e)
  //       })
  //     }
  //   })
  // },
  methods: {
    editNodeFn: function(node) {
      console.log('node', node)
      // alert(123)
    },
    logCurrentData: function(event) {
      const caseJson = this.$refs.minderEditor.getJsonData();
      console.log('编辑器中的最新用例内容：', caseJson)
      const nodeDatas = {}
      this.checkJsonHasDuplicateId(caseJson.root, nodeDatas)
      let hasDuplicateId = false;
      Object.keys(nodeDatas).forEach(function(key) {
        const nodeData = nodeDatas[key]
        if (nodeData.length > 1) {
          console.log('重复id内容: ', nodeData)
          hasDuplicateId = true;
        }
      })
      if (hasDuplicateId) {
        this.$message.error('存在重复 id ，详情请看日志')
      } else {
        this.$message('未发现重复 id ')
      }
    },
    toggleEditMode: function(event) {
      this.editMode = !this.editMode
    },
    checkJsonHasDuplicateId: function(jsonData, nodeDatas) {
      // console.log("checkJsonHasDuplicateId", jsonData, nodeDatas)
      let id;
      if (jsonData && jsonData.data && jsonData.data.id) {
        id = jsonData.data.id;
      }
      if (id !== undefined) {
        if (!Object.keys(nodeDatas).includes(id)) {
          nodeDatas[id] = [jsonData.data]
        } else {
          nodeDatas[id].push(jsonData.data)
        }
      }
      if (jsonData.children && jsonData.children.length > 0) {
        jsonData.children.forEach(element => {
          this.checkJsonHasDuplicateId(element, nodeDatas);
        });
      }
    }
  }
}

</script>
