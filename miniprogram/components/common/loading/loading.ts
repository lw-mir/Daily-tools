Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否显示加载
    show: {
      type: Boolean,
      value: false
    },
    // 加载文本
    text: {
      type: String,
      value: '加载中...'
    },
    // 加载类型
    type: {
      type: String,
      value: 'default' // default, dots, spinner
    },
    // 遮罩层透明度
    opacity: {
      type: Number,
      value: 0.7
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击遮罩层
     */
    onMaskTap() {
      // 阻止事件冒泡
    }
  }
}) 