// 酒桌骰子游戏页面
interface Player {
  id: string;
  name: string;
  score: number;
  avatar: string;
}

interface DiceResult {
  value: number;
  timestamp: number;
}

interface GameState {
  isPlaying: boolean;
  currentPlayer: number;
  round: number;
  maxRounds: number;
  winner: Player | null;
}

Page({
  data: {
    gameState: {
      isPlaying: false,
      currentPlayer: 0,
      round: 1,
      maxRounds: 10,
      winner: null
    },
    
    players: [
      {
        id: 'player1',
        name: '玩家1',
        score: 0,
        avatar: '🧑'
      },
      {
        id: 'player2',
        name: '玩家2',
        score: 0,
        avatar: '👩'
      }
    ],
    
    diceResult: null,
    isRolling: false,
    
    showRules: false,
    rules: [
      '1. 每位玩家轮流掷骰子',
      '2. 根据骰子点数执行相应动作',
      '3. 1点：喝一杯',
      '4. 2-3点：指定他人喝酒',
      '5. 4-5点：大家一起喝',
      '6. 6点：再掷一次',
      '7. 游戏进行指定轮数或达成条件结束'
    ],
    
    isDeveloping: true,
    developingMessage: '🚧 功能开发中，敬请期待！'
  },

  onLoad() {
    console.log('酒桌骰子游戏页面加载');
    this.initGame();
  },

  // 初始化游戏
  initGame() {
    this.setData({
      gameState: {
        isPlaying: false,
        currentPlayer: 0,
        round: 1,
        maxRounds: 10,
        winner: null
      },
      players: this.data.players.map(player => ({
        ...player,
        score: 0
      })),
      diceResult: null,
      isRolling: false
    });
  },

  // 开始游戏
  startGame() {
    if (this.data.isDeveloping) {
      wx.showToast({
        title: this.data.developingMessage,
        icon: 'none',
        duration: 2000
      });
      return;
    }

    this.setData({
      'gameState.isPlaying': true,
      'gameState.currentPlayer': 0,
      'gameState.round': 1
    });

    wx.showToast({
      title: '游戏开始！',
      icon: 'success'
    });
  },

  // 掷骰子
  rollDice() {
    if (this.data.isDeveloping) {
      wx.showToast({
        title: this.data.developingMessage,
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (!this.data.gameState.isPlaying || this.data.isRolling) {
      return;
    }

    this.setData({
      isRolling: true
    });

    // 模拟掷骰子动画
    setTimeout(() => {
      const diceValue = Math.floor(Math.random() * 6) + 1;
      const result: DiceResult = {
        value: diceValue,
        timestamp: Date.now()
      };

      this.setData({
        diceResult: result,
        isRolling: false
      });

      this.handleDiceResult(diceValue);
    }, 1000);
  },

  // 处理骰子结果
  handleDiceResult(value: number) {
    const currentPlayer = this.data.players[this.data.gameState.currentPlayer];
    let message = '';

    switch (value) {
      case 1:
        message = `${currentPlayer.name} 掷出1点，喝一杯！`;
        break;
      case 2:
      case 3:
        message = `${currentPlayer.name} 掷出${value}点，可以指定他人喝酒！`;
        break;
      case 4:
      case 5:
        message = `${currentPlayer.name} 掷出${value}点，大家一起喝！`;
        break;
      case 6:
        message = `${currentPlayer.name} 掷出6点，再来一次！`;
        break;
    }

    wx.showModal({
      title: '骰子结果',
      content: message,
      showCancel: false,
      complete: () => {
        if (value !== 6) {
          this.nextPlayer();
        }
      }
    });
  },

  // 下一个玩家
  nextPlayer() {
    const nextPlayerIndex = (this.data.gameState.currentPlayer + 1) % this.data.players.length;
    let nextRound = this.data.gameState.round;

    if (nextPlayerIndex === 0) {
      nextRound++;
    }

    this.setData({
      'gameState.currentPlayer': nextPlayerIndex,
      'gameState.round': nextRound
    });

    if (nextRound > this.data.gameState.maxRounds) {
      this.endGame();
    }
  },

  // 结束游戏
  endGame() {
    this.setData({
      'gameState.isPlaying': false
    });

    wx.showModal({
      title: '游戏结束',
      content: '感谢游戏！',
      showCancel: false
    });
  },

  // 重置游戏
  resetGame() {
    wx.showModal({
      title: '重置游戏',
      content: '确定要重置游戏吗？',
      success: (res) => {
        if (res.confirm) {
          this.initGame();
          wx.showToast({
            title: '游戏已重置',
            icon: 'success'
          });
        }
      }
    });
  },

  // 显示/隐藏规则
  toggleRules() {
    this.setData({
      showRules: !this.data.showRules
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  }
}); 