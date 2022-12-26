const getters = {
  getTags: state => {
    return state.tags
  }
  // getTestCaseNodePath(state, nodeId) {
  //   for (const index in state.moduleOptions) {
  //     let item = state.moduleOptions[index];
  //     if (nodeId === item.id) {
  //       return item.path;
  //     }
  //   }
  // }
}

export default getters
