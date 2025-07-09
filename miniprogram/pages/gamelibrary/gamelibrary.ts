// gameLibrary.ts
Component({
  data: {
    games: [
      {
        id: '2048',
        name: '2048',
        description: '经典数字合并小游戏',
        icon: '🔢'
      },
      {
        id: 'tic-tac-toe',
        name: '井字棋',
        description: '双人对战井字棋',
        icon: '⭕️'
      }
    ] as GameItem[]
  },

  methods: {
    onGameTap(e: any) {
      const game: GameItem = e.currentTarget.dataset.game
      const routeMap: Record<string, string> = {
        'tic-tac-toe': '/pages/games/tictactoe/tictactoe',
        '2048': '/pages/games/2048/2048'
      }
      const target = routeMap[game.id]
      if (target) {
        wx.navigateTo({ url: target })
      } else {
        wx.showToast({ title: `${game.name} 敬请期待`, icon: 'none' })
      }
    }
  }
})

interface GameItem {
  id: string
  name: string
  description: string
  icon: string
} 