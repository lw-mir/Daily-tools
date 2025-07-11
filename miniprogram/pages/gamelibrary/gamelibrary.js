"use strict";
Page({
  data: {
    // 分类展开状态
    categoryExpanded: {
      drinking: true,
      casual: true,
      couple: true,
      card: true
    },
    // 酒桌游戏
    drinkingGames: [{
        id: 'truth-or-dare',
        name: '真心话大冒险',
        description: '经典聚会游戏，增进友谊',
        icon: '🎭',
        isPlaceholder: true
      },
      {
        id: 'who-is-undercover',
        name: '谁是卧底',
        description: '推理游戏，考验智慧',
        icon: '🕵️',
        isPlaceholder: true
      },
      {
        id: 'drinking-dice',
        name: '酒桌骰子',
        description: '简洁有趣的摇骰游戏',
        icon: '🎲',
        isPlaceholder: false
      },
      {
        id: 'drinking-ludo',
        name: '酒桌飞行棋',
        description: '趣味酒桌飞行棋游戏',
        icon: '🎮',
        isPlaceholder: true
      },
      {
        id: 'king-game',
        name: '国王游戏',
        description: '抽签游戏，刺激有趣',
        icon: '👑',
        isPlaceholder: true
      }
    ],
    // 摸鱼游戏
    casualGames: [{
        id: '2048',
        name: '2048',
        description: '经典数字合并小游戏',
        icon: '🔢',
        isPlaceholder: false
      },
      {
        id: 'tic-tac-toe',
        name: '井字棋',
        description: '双人对战井字棋',
        icon: '⭕️',
        isPlaceholder: false
      },
      {
        id: 'snake-game',
        name: '贪吃蛇',
        description: '经典街机游戏',
        icon: '🐍',
        isPlaceholder: true
      },
      {
        id: 'tetris',
        name: '俄罗斯方块',
        description: '经典消除游戏',
        icon: '🧩',
        isPlaceholder: true
      },
      {
        id: 'bubble-shooter',
        name: '泡泡射击',
        description: '休闲消除游戏',
        icon: '🫧',
        isPlaceholder: true
      }
    ],
    // 情侣游戏
    coupleGames: [{
        id: 'love-test',
        name: '爱情测试',
        description: '测试你们的默契度',
        icon: '💖',
        isPlaceholder: true
      },
      {
        id: 'couple-quiz',
        name: '情侣问答',
        description: '看看你们有多了解对方',
        icon: '💌',
        isPlaceholder: true
      },
      {
        id: 'memory-game',
        name: '记忆游戏',
        description: '考验记忆力的甜蜜游戏',
        icon: '🧠',
        isPlaceholder: true
      },
      {
        id: 'couple-draw',
        name: '情侣画画',
        description: '一起创作美好回忆',
        icon: '🎨',
        isPlaceholder: true
      }
    ],
    // 扑克游戏
    cardGames: [{
        id: 'poker-24',
        name: '24点',
        description: '四张牌算出24',
        icon: '🃏',
        isPlaceholder: true
      },
      {
        id: 'blackjack',
        name: '21点',
        description: '经典赌场游戏',
        icon: '🂡',
        isPlaceholder: true
      },
      {
        id: 'poker-solitaire',
        name: '纸牌接龙',
        description: '单人纸牌游戏',
        icon: '🃁',
        isPlaceholder: true
      },
      {
        id: 'poker-memory',
        name: '翻牌记忆',
        description: '记忆力挑战游戏',
        icon: '🂠',
        isPlaceholder: true
      }
    ]
  },
  // 页面加载
  onLoad: function () {
    console.log('游戏库页面加载');
  },
  // 切换分类展开状态
  toggleCategory: function (e) {
    var _a;
    var category = e.currentTarget.dataset.category;
    var key = "categoryExpanded." + category;
    this.setData((_a = {},
      _a[key] = !this.data.categoryExpanded[category],
      _a));
  },
  // 游戏点击事件
  onGameTap: function (e) {
    var game = e.currentTarget.dataset.game;
    // 如果是占位符游戏，显示提示
    if (game.isPlaceholder) {
      wx.showToast({
        title: game.name + " \u656C\u8BF7\u671F\u5F85",
        icon: 'none',
        duration: 2000
      });
      return;
    }
    // 已实现的游戏路由
    var routeMap = {
      'tic-tac-toe': '/pages/games/tictactoe/tictactoe',
      '2048': '/pages/games/2048/2048'
    };
    var target = routeMap[game.id];
    if (target) {
      wx.navigateTo({
        url: target
      });
    } else {
      wx.showToast({
        title: game.name + " \u656C\u8BF7\u671F\u5F85",
        icon: 'none',
        duration: 2000
      });
    }
  }
});