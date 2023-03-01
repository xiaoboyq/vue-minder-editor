/* eslint-disable no-undef */
define(function (require, exports, module) {
  var kity = require('../core/kity')
  // var utils = require('../core/utils')

  var Minder = require('../core/minder')
  // var MinderNode = require('../core/node')
  var Command = require('../core/command')
  var Module = require('../core/module')
  var Renderer = require('../core/render')

  Module.register('Custom', function () {
    // String Hash
    // https://github.com/drostie/sha3-js/edit/master/blake32.min.js
    var blake32 = (function () {
      var iv; var g; var r; var block; var constants; var sigma; var circ; var state; var message; var output; var two32
      two32 = 4 * (1 << 30)
      iv = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
      ]
      constants = [
        0x243F6A88, 0x85A308D3, 0x13198A2E, 0x03707344,
        0xA4093822, 0x299F31D0, 0x082EFA98, 0xEC4E6C89,
        0x452821E6, 0x38D01377, 0xBE5466CF, 0x34E90C6C,
        0xC0AC29B7, 0xC97C50DD, 0x3F84D5B5, 0xB5470917
      ]
      output = function (i) {
        if (i < 0) {
          i += two32
        }
        return ('00000000' + i.toString(16)).slice(-8)
      }
      /* The spec calls for the sigma values at 2i and 2i + 1 to be passed into
               * the g function simultaneously. This implementation uses a byte array to
               * perform this task.
               */
      sigma = [
        [16, 50, 84, 118, 152, 186, 220, 254], [174, 132, 249, 109, 193, 32, 123, 53],
        [139, 12, 37, 223, 234, 99, 23, 73], [151, 19, 205, 235, 98, 165, 4, 143],
        [9, 117, 66, 250, 30, 203, 134, 211], [194, 166, 176, 56, 212, 87, 239, 145],
        [92, 241, 222, 164, 112, 54, 41, 184], [189, 231, 28, 147, 5, 79, 104, 162],
        [246, 158, 59, 128, 44, 125, 65, 90], [42, 72, 103, 81, 191, 233, 195, 13]
      ]
      circ = function (a, b, n) {
        var s = state[a] ^ state[b]
        state[a] = (s >>> n) | (s << (32 - n))
      }
      g = function (i, a, b, c, d) {
        var u = block + sigma[r][i] % 16; var v = block + (sigma[r][i] >> 4)
        a %= 4
        b = 4 + b % 4
        c = 8 + c % 4
        d = 12 + d % 4
        state[a] += state[b] + (message[u] ^ constants[v % 16])
        circ(d, a, 16)
        state[c] += state[d]
        circ(b, c, 12)
        state[a] += state[b] + (message[v] ^ constants[u % 16])
        circ(d, a, 8)
        state[c] += state[d]
        circ(b, c, 7)
      }
      return function (msg, salt) {
        if (!(salt instanceof Array && salt.length === 4)) {
          salt = [0, 0, 0, 0]
        }
        var pad; var chain; var len; var L; var lastL; var last; var total; var i
        chain = iv.slice(0)
        pad = constants.slice(0, 8)
        for (r = 0; r < 4; r += 1) {
          pad[r] ^= salt[r]
        }
        // pre-padding bit length of the string.
        len = msg.length * 16
        lastL = (len % 512 > 446 || len % 512 === 0) ? 0 : len
        // padding step: append a 1, then a bunch of 0's until we're at 447 bits,
        // then another 1 (note: 448/16 = 28), then len as a 64-bit integer.
        if (len % 512 === 432) {
          msg += '\u8001'
        } else {
          msg += '\u8000'
          while (msg.length % 32 !== 27) {
            msg += '\u0000'
          }
          msg += '\u0001'
        }
        message = []
        for (i = 0; i < msg.length; i += 2) {
          message.push(msg.charCodeAt(i) * 65536 + msg.charCodeAt(i + 1))
        }
        message.push(0)
        message.push(len)
        last = message.length - 16
        total = 0
        for (block = 0; block < message.length; block += 16) {
          total += 512
          L = (block === last) ? lastL : Math.min(len, total)
          state = chain.concat(pad)
          state[12] ^= L
          state[13] ^= L
          for (r = 0; r < 10; r += 1) {
            for (i = 0; i < 8; i += 1) {
              if (i < 4) {
                g(i, i, i, i, i)
              } else {
                g(i, i, i + 1, i + 2, i + 3)
              }
            }
          }
          for (i = 0; i < 8; i += 1) {
            chain[i] ^= salt[i % 4] ^ state[i] ^ state[i + 8]
          }
        }
        return chain.map(output).join('')
      }
    }())

    /**
             * 自动使用的颜色序列
             * 250
             */
    //  303  190 137
    // var RESOURCE_COLOR_SERIES = [51, 303, 190, 137, 0, 92].map(function(h) {
    //     return kity.Color.createHSL(h, 200, 205);
    // });

    // HSLA(100, 60%, 80%, .5)
    // H Hue 色调 就是区分其本质颜色的 （红橙黄绿蓝靛紫） 选值是：0度~360度 , 0是红色、120是绿色、240是蓝色、360也是红色
    // S Saturation 饱和度  就是其纯度（通俗一点儿就是这个红色是纯红还是灰蒙蒙的红） 选值是：0%~100%, 0%饱和度最低，100%饱和度最高
    // LLightness 亮度 就是说此颜色亮不亮 选值是：0%~100%， 0%最暗，100%最亮
    // Alpha 不透明度
    var RESOURCE_COLOR_SERIES = [0, 18, 36, 54, 72, 90, 108, 126, 144, 162, 180, 198, 216, 234, 252, 254, 270, 288, 306, 324, 342].map(function (h, i) {
      var Saturation = [0, 50, 100, 75, 25] // 饱和度
      // var Saturation = [35, 65, 45, 75, 55] // 饱和度
      var LLightness = [45, 75, 55, 85, 65] // 亮度 【0时黑色】
      var Alpha = [1, 0.65, 0.9, 0.75] // 不透明度
      // 20个 分4组  5 0-100
      //  Color.createHSLA 中已经对s, l 进行%处理 s = s + '%'
      //  return Color.createHSLA(h, s, l, 1);
      return kity.Color.createHSLA(h, Saturation[i % 5], LLightness[i % 5], Alpha[i % 4])
    })

    /**
             * 在 Minder 上拓展一些关于资源的支持接口
             */
    kity.extendClass(Minder, {

      /**
                   * 获取字符串的哈希值
                   *
                   * @param {String} str
                   * @return {Number} hashCode
                   */
      getHashCode: function (str) {
        str = blake32(str)
        var hash = 1315423911; var i; var ch
        for (i = str.length - 1; i >= 0; i--) {
          ch = str.charCodeAt(i)
          hash ^= ((hash << 5) + ch + (hash >> 2))
        }
        return (hash & 0x7ABFFFFF)
      },

      /**
                   * 获取脑图中某个资源对应的颜色
                   *
                   * 如果存在同名资源，则返回已经分配给该资源的颜色，否则分配给该资源一个颜色，并且返回
                   *
                   * 如果资源数超过颜色序列数量，返回哈希颜色
                   *
                   * @param {String} custom 资源名称
                   * @return {Color}
                   */
      getCustomColor: function (custom) {
        const customName = custom.split('：')[1] || 'xx'

        var colorMapping = this._getCustomColorIndexMapping()
        var nextIndex

        if (!Object.prototype.hasOwnProperty.call(colorMapping, customName)) {
          // 找不到找下个可用索引
          nextIndex = this._getNextCustomColorIndex()
          colorMapping[customName] = nextIndex
        }
        // 资源过多，找不到可用索引颜色，统一返回哈希函数得到的颜色
        //  RESOURCE_COLOR_SERIES[colorMapping[customName]] ||
        return RESOURCE_COLOR_SERIES[colorMapping[customName]] || kity.Color.createHSL(Math.floor(this.getHashCode(customName) / 0x7FFFFFFF * 359), 200, 185)
        // return '#';
      },

      /**
                   * 获得已使用的资源的列表
                   *
                   * @return {Array}
                   */
      getUsedCustom: function () {
        var mapping = this._getCustomColorIndexMapping()
        var used = []
        var custom

        for (custom in mapping) {
          if (Object.prototype.hasOwnProperty.call(mapping, custom)) {
            used.push(custom)
          }
        }

        return used
      },

      /**
                   * 获取脑图下一个可用的资源颜色索引
                   *
                   * @return {int}
                   */
      _getNextCustomColorIndex: function () {
        // 获取现有颜色映射
        //     custom => color_index
        var colorMapping = this._getCustomColorIndexMapping()

        var custom, used, i

        used = []

        // 抽取已经使用的值到 used 数组
        for (custom in colorMapping) {
          if (Object.prototype.hasOwnProperty.call(colorMapping, custom)) {
            used.push(colorMapping[custom])
          }
        }

        // 枚举所有的可用值，如果还没被使用，返回
        for (i = 0; i < RESOURCE_COLOR_SERIES.length; i++) {
          if (!~used.indexOf(i)) return i
        }

        // 没有可用的颜色了
        return -1
      },

      // 获取现有颜色映射
      //     custom => color_index
      _getCustomColorIndexMapping: function () {
        return this._customColorMapping || (this._customColorMapping = {})
      }

    })

    /**
             * @class 设置资源的命令
             *
             * @example
             *
             * // 设置选中节点资源为 "张三"
             * minder.execCommand('custom', ['张三']);
             *
             * // 添加资源 "李四" 到选中节点
             * var custom = minder.queryCommandValue();
             * custom.push('李四');
             * minder.execCommand('custom', custom);
             *
             * // 清除选中节点的资源
             * minder.execCommand('custom', null);
             */
    var CustomCommand = kity.createClass('CustomCommand', {

      base: Command,

      execute: function (minder, custom) {
        var nodes = minder.getSelectedNodes()

        if (typeof (custom) === 'string') {
          custom = [custom]
        }

        nodes.forEach(function (node) {
          node.setData('custom', custom).render()
        })

        minder.layout(200)
      },

      queryValue: function (minder) {
        var nodes = minder.getSelectedNodes()
        var custom = []

        nodes.forEach(function (node) {
          var nodeCustom = node.getData('custom')

          if (!nodeCustom) return

          nodeCustom.forEach(function (name) {
            if (!~custom.indexOf(name)) {
              custom.push(name)
            }
          })
        })

        return custom
      },

      queryState: function (km) {
        return km.getSelectedNode() ? 0 : -1
      }
    })

    /**
             * @class 资源的覆盖图形
             *
             * 该类为一个资源以指定的颜色渲染一个动态的覆盖图形
             */
    var CustomOverlay = kity.createClass('CustomOverlay', {
      base: kity.Group,

      constructor: function () {
        this.callBase()

        var text, rect

        rect = this.rect = new kity.Rect().setRadius(4)

        text = this.text = new kity.Text()
          .setFontSize(12)
          .setVerticalAlign('middle')

        this.addShapes([rect, text])
      },

      setValue: function (customName, color) {
        var paddingX = 8
        var paddingY = 4
        // var borderRadius = 4
        var text, box, rect

        text = this.text

        if (customName == this.lastCustomName) {
          box = this.lastBox
        } else {
          var contentText = customName ? customName.split('：')[1] : ''
          text.setContent(contentText)

          box = text.getBoundaryBox()
          this.lastCustomName = customName
          this.lastBox = box
        }

        text.setX(paddingX).fill(color.dec('l', 70))

        rect = this.rect
        rect.setPosition(0, box.y - paddingY)
        this.width = Math.round(box.width + paddingX * 2)
        this.height = Math.round(box.height + paddingY * 2)
        rect.setSize(this.width, this.height)
        rect.fill(color)
      }
    })

    /**
             * @class 资源渲染器
             */
    var CustomRenderer = kity.createClass('CustomRenderer', {
      base: Renderer,

      create: function (node) {
        this.overlays = []
        return new kity.Group()
      },

      shouldRender: function (node) {
        return node.getData('custom') && node.getData('custom').length
      },

      update: function (container, node, box) {
        var spaceRight = node.getStyle('space-right')

        var overlays = this.overlays

        /*  修复 custom 数组中出现 null 的 bug
                         *  @Author zhangbobell
                         *  @date 2016-01-15
                         */
        var custom = node.getData('custom').filter(function (ele) {
          return ele !== null
        })
        if (custom.length === 0) {
          return
        }
        var minder = node.getMinder()
        var i, overlay, x

        x = 0
        for (i = 0; i < custom.length; i++) {
          x += spaceRight

          overlay = overlays[i]
          if (!overlay) {
            overlay = new CustomOverlay()
            overlays.push(overlay)
            container.addShape(overlay)
          }
          overlay.setVisible(true)
          overlay.setValue(custom[i], minder.getCustomColor(custom[i]))
          overlay.setTranslate(x, -1)

          x += overlay.width
        }

        while ((overlay = overlays[i++])) overlay.setVisible(false)

        container.setTranslate(box.right, 0)

        return new kity.Box({
          x: box.right,
          y: Math.round(-overlays[0].height / 2),
          width: x,
          height: overlays[0].height
        })
      }
    })

    return {
      commands: {
        'custom': CustomCommand
      },

      renderers: {
        right: CustomRenderer
      }
    }
  })
})
