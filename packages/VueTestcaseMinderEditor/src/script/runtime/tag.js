
define(function (require, exports, module) {

  function TagRuntime() {
    var minder = this.minder;
    var hotbox = this.hotbox;
    var main = hotbox.state('main');
    

    main.button({
      position: 'top',
      label: '标签',
      key: 'H',
      next: 'tag',
      enable: function () {
        return minder.queryCommandState('tag') != -1;
      }
    });

    let tag = hotbox.state('tag');

    //   // 直接加到 main 中，会导致无法显示，但可以保证快捷键可以直接在界面使用
    //   "09151114".replace(/./g, function(p) {
    //     main.button({
    //         position: "bottom",
    //         label: p,
    //         key: p,
    //         action: function() {
    //             minder.execCommand("Tag", p);
    //         }
    //     });
    // });

    tag.button({
      position: 'center',
      label: '移除',
      key: 'Del',
      action: function () {
        minder.execCommand('Tag', 0);
      }
    });

    tag.button({
      position: 'top',
      label: '返回',
      key: 'esc',
      next: 'back'
    });
  }

  return module.exports = TagRuntime;
});
