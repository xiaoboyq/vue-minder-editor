export const state = {
  count: 2,
  minder: {},
  editor: {},
  working: {
    editing: false,
    saving: false,
    draging: false
  },
  callbackQueue: [],
  config: {
    // 右侧面板最小宽度
    ctrlPanelMin: 250,

    // 右侧面板宽度
    ctrlPanelWidth: parseInt(window.localStorage.__dev_minder_ctrlPanelWidth) || 250,

    // 分割线宽度
    dividerWidth: 3,

    // 默认语言
    defaultLang: 'zh-cn',

    // 放大缩小比例
    zoom: [
      10,
      20,
      30,
      50,
      80,
      100,
      120,
      150,
      200
    ],
    // 允许编辑优先级
    allowEditPriority: true,

    // 允许编辑标签
    allowEditLabel: true,

    // 允许编辑测试结果
    allowEditResult: true,

    // 允许编辑节点
    allowEditNode: true,
    allowOperate: true,

    // 是否全屏
    isFullScreen: false,
    customArr: [],
    tags: ['用例', '前置条件', '备注', '模块'],
    distinctTags: ['用例', '模块', '前置条件', '备注'],
    questionTags: ['从此处开始', '此处有疑问', '此处需修改', '此处需补充'],
    distinctQuestionTags: ['从此处开始', '此处有疑问', '此处需修改', '此处需补充']
    // resultTags: ['通过', '失败', '阻塞', '跳过'],
    // resultDistinctTags: ['用例', '模块', '前置条件', '备注']
  }
}
