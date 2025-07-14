// 3D多骰子游戏页面

interface DiceGameData {
  id: number
  value: number
  isRolling: boolean
}

Page({
  data: {
    diceCount: 2,
    diceResults: [] as DiceGameData[],
    isRolling: false,
    rollCount: 0,
    totalPoints: 0
  },

  onLoad() {
    console.log('3D多骰子游戏页面加载')
    this.loadFromStorage()
    this.initGame()
  },

  onHide() {
    this.saveToStorage()
  },

  initGame() {
    const diceResults: DiceGameData[] = []
    for (let i = 0; i < this.data.diceCount; i++) {
      diceResults.push({
        id: i + 1,
        value: Math.floor(Math.random() * 6) + 1,
        isRolling: false
      })
    }
    
    const totalPoints = diceResults.reduce((sum, dice) => sum + dice.value, 0)
    
    this.setData({
      diceResults,
      totalPoints,
      isRolling: false
    })
  },

  setDiceCount(e: any) {
    const count = parseInt(e.detail.value)
    if (count >= 1 && count <= 10) {
      this.setData({
        diceCount: count
      })
      this.initGame()
    }
  },

  adjustDiceCount(e: any) {
    const type = e.currentTarget.dataset.type
    let newCount = this.data.diceCount
    
    if (type === 'increase' && newCount < 10) {
      newCount++
    } else if (type === 'decrease' && newCount > 1) {
      newCount--
    }
    
    this.setData({
      diceCount: newCount
    })
    this.initGame()
  },

  rollDice() {
    if (this.data.isRolling) {
      return
    }

    console.log('开始摇骰子')
    
    const rollingDice = this.data.diceResults.map(dice => ({
      ...dice,
      isRolling: true
    }))
    
    this.setData({
      diceResults: rollingDice,
      isRolling: true
    })

    wx.vibrateShort({
      type: 'heavy'
    })

    let rollAnimation = 0
    const rollInterval = setInterval(() => {
      const animatingDice = this.data.diceResults.map(dice => ({
        ...dice,
        value: Math.floor(Math.random() * 6) + 1
      }))
      
      this.setData({
        diceResults: animatingDice
      })
      
      rollAnimation++
      
      if (rollAnimation >= 20) {
        clearInterval(rollInterval)
        this.finishRoll()
      }
    }, 100)
  },

  finishRoll() {
    const finalResults = this.data.diceResults.map(dice => ({
      ...dice,
      value: Math.floor(Math.random() * 6) + 1,
      isRolling: false
    }))
    
    const totalPoints = finalResults.reduce((sum, dice) => sum + dice.value, 0)
    
    this.setData({
      diceResults: finalResults,
      totalPoints,
      isRolling: false,
      rollCount: this.data.rollCount + 1
    })

    console.log(`摇骰结果: ${finalResults.map(d => d.value).join(', ')}, 总点数: ${totalPoints}`)

    setTimeout(() => {
      wx.vibrateShort({
        type: 'medium'
      })
    }, 200)
    
    this.saveToStorage()
  },

  resetGame() {
    this.setData({
      rollCount: 0
    })
    this.initGame()
    this.saveToStorage()
    
    wx.showToast({
      title: '游戏已重置',
      icon: 'success'
    })
  },

  saveToStorage() {
    try {
      wx.setStorageSync('dice_game_data', {
        diceCount: this.data.diceCount,
        rollCount: this.data.rollCount
      })
    } catch (error) {
      console.error('保存数据失败:', error)
    }
  },

  loadFromStorage() {
    try {
      const data = wx.getStorageSync('dice_game_data')
      if (data) {
        this.setData({
          diceCount: data.diceCount || 2,
          rollCount: data.rollCount || 0
        })
      }
    } catch (error) {
      console.error('加载数据失败:', error)
    }
  },

  onShareAppMessage() {
    return {
      title: '3D多骰子游戏 - 支持1-10个骰子',
      path: '/pages/games/dice/dice',
      imageUrl: '/images/dice-game.png'
    }
  }
}) 