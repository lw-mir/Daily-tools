// 酒桌骰子游戏页面

// 数据接口
interface DiceData {
  diceValue: number      // 当前骰子点数
  isRolling: boolean     // 是否正在摇骰子
  rollCount: number      // 摇骰次数
}

// 方法接口
interface DiceMethods {
  initGame(): void
  rollDice(): void
  finishRoll(): void
}

Page<DiceData, DiceMethods>({
  data: {
    diceValue: 1,
    isRolling: false,
    rollCount: 0
  },

  /**
   * 页面加载
   */
  onLoad() {
    console.log('酒桌骰子页面加载')
    this.initGame()
  },

  /**
   * 初始化游戏
   */
  initGame() {
    this.setData({
      diceValue: 1,
      isRolling: false,
      rollCount: 0
    })
  },

  /**
   * 摇骰子
   */
  rollDice() {
    if (this.data.isRolling) {
      return
    }

    console.log('开始摇骰子')
    
    // 开始摇骰动画
    this.setData({
      isRolling: true
    })

    // 添加触觉反馈
    wx.vibrateShort({
      type: 'heavy'
    })

    // 模拟摇骰过程 - 快速变换点数
    let rollAnimation = 0
    const rollInterval = setInterval(() => {
      this.setData({
        diceValue: Math.floor(Math.random() * 6) + 1
      })
      rollAnimation++
      
      if (rollAnimation >= 10) { // 摇骰动画持续时间
        clearInterval(rollInterval)
        this.finishRoll()
      }
    }, 100)
  },

  /**
   * 完成摇骰
   */
  finishRoll() {
    // 生成最终结果
    const finalValue = Math.floor(Math.random() * 6) + 1
    
    this.setData({
      diceValue: finalValue,
      isRolling: false,
      rollCount: this.data.rollCount + 1
    })

    console.log(`摇骰结果: ${finalValue}点`)

    // 结果震动反馈
    setTimeout(() => {
      wx.vibrateShort({
        type: 'medium'
      })
    }, 200)
  },

  /**
   * 页面分享
   */
  onShareAppMessage() {
    return {
      title: '酒桌骰子 - 简单好玩的摇骰游戏',
      path: '/pages/games/dice/dice',
      imageUrl: '/images/dice-game.png'
    }
  }
}) 