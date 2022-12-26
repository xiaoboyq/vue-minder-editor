import Vue from 'vue'
import Vuex from 'vuex'

import App from './App'

import '../lib/VueTestcaseMinderEditor.css'
import getters from './getters'
// import VueTestcaseMinderEditor from '../lib/VueTestcaseMinderEditor.umd.min.js'
import VueTestcaseMinderEditor from '../packages/VueTestcaseMinderEditor/index'

Vue.use(VueTestcaseMinderEditor)
console.log('using VueTestcaseMinderEditor', VueTestcaseMinderEditor)

const state = {
  tags: ['3123']
}

Vue.use(Vuex)
const store = new Vuex.Store({
  state,
  getters,
  modules: {
    caseEditorStore: VueTestcaseMinderEditor.caseEditorStore
  }
})

new Vue({
  el: '#app',
  store,
  render: h => h(App),
  components: {
    App
  }
}).$mount('#app')
