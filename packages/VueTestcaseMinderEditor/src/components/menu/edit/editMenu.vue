<template lang="html">
<div class="menu-container">
<!--  撤销回退、重做-->
  <back-and-right></back-and-right>
  <expand></expand>
  <selection></selection>
  <insert-box v-if="allowEditNode"/>
  <move-box v-if="allowEditNode"/>
  <edit-del v-if="allowEditNode"/>
  <div :class="!allowOperate ? 'menu-limitOperate' : 'menu-operator'" :disabled="!allowOperate">
    <sequence-box v-if="allowEditNode"/>
    <tag-box :tag-edit-check="tagEditCheck" v-if="allowEditNode" :tags="tags" :distinctTags="distinctTags"/>
      <!--  自定义标签-->
      <template v-if="allowEditLabel" >
        <custom-select v-for="item in customArr" :data="item" :key="item.key"></custom-select>
    </template>
    <result-box v-if="allowEditResult"/>
  </div>
  <!-- <progress-box></progress-box> -->

   <!--    超链接-->
  <!-- <hyberlink v-if="allowEditNode"></hyberlink> -->
  <!-- <picture-box v-if="allowEditNode"></picture-box> -->
<!--  查询、过滤-->
  <!-- <search></search> -->
  <!-- <node-box v-if="allowEditNode"></node-box> -->
  <!-- <question-tag-box v-if="allowEditNode" :tags="questionTags" :distinctTags="distinctQuestionTags"/> -->
  <!-- :tag-edit-check="tagEditCheck" -->

  <!-- <resource-edit v-if="allowEditLabel"></resource-edit>
  <resource-edit v-if="allowEditLabel"></resource-edit> -->
  <!--测试结果登记-->
</div>
</template>

<script>
import insertBox from './insertBox'
import moveBox from './moveBox'
import editDel from './editDel'
import sequenceBox from './sequenceBox'
import pictureBox from './picture'
import tagBox from "./tagBox";
import questionTagBox from "./questionTagBox";
import expand from './expand'
import selection from './selection'
import NodeBox from "./noteBox";
import customSelect from "./customSelect";
import Search from "./search/search";
import hyberlink from "./hyberlink";
import backAndRight from "./backAndRight";
import resultBox from './resultBox';

import { mapMutations, mapGetters } from "vuex";

export default {
  name: 'editMenu',
  props: {
    tagEditCheck: Function,
  },
  data () {
    return {
      // customArr: [
      //   {
      //     key: 'name1', 
      //     options: [
      //       {value: 1, name: 1123123123123123},
      //       {value: 2, name: 2},
      //       {value: 3, name: 3},
      //     ]
      //   },
      //   {
      //     key: 'name2',
      //     options: [
      //       {value: 1, name: 1},
      //       {value: 2, name: 2},
      //       {value: 3, name: 3},
      //     ]
      //   },
      // ]
      // questionTags: ['从此处开始', '此处有疑问', '此处需修改', '此处需补充'],
      // distinctQuestionTags: ['从此处开始', '此处有疑问', '此处需修改', '此处需补充']
    }
  },
  components: {
    Search,
    NodeBox,
    insertBox,
    moveBox,
    editDel,
    sequenceBox,
    // progressBox,
    expand,
    selection,
    customSelect,
    hyberlink,
    backAndRight,
    resultBox,
    tagBox,
    questionTagBox,
    pictureBox
  },
  computed: {
    ...mapGetters('caseEditorStore', {
      count: 'count',
      config: 'config'
    }),
    // allowEditPriority() {
    //   return this.config.allowEditPriority
    // },
    allowEditLabel() {
      return this.config.allowEditLabel
    },
    allowEditResult() {
      return this.config.allowEditResult
    },
    allowEditNode() {
      return this.config.allowEditNode
    },
    allowOperate() {
      return this.config.allowOperate
    },
    tags() {
      return this.config.tags
    },
    customArr() {
      return this.config.customArr
    },
    tags() {
      return this.config.tags
    },
    questionTags() {
      return this.config.questionTags
    },
    distinctQuestionTags() {
      return this.config.distinctQuestionTags
    },
    distinctTags() {
      return this.config.distinctTags
    },
  }
}
</script>
