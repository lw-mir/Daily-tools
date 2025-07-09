// tictactoe.ts
Component({
  data: {
    board: ['', '', '', '', '', '', '', '', ''] as string[],
    currentPlayer: 'X',
    winner: '',
    statusText: '当前回合: X'
  },

  methods: {
    onCellTap(e: any) {
      const index: number = e.currentTarget.dataset.index
      const { board, winner } = this.data
      if (board[index] || winner) return

      board[index] = this.data.currentPlayer
      this.setData({ board })

      const newWinner = this.checkWinner(board)
      if (newWinner) {
        this.setData({ winner: newWinner, statusText: `${newWinner} 获胜!` })
        return
      }

      // 检查平局
      if (board.every(cell => cell)) {
        this.setData({ winner: 'draw', statusText: '平局!' })
        return
      }

      // 切换玩家
      const next = this.data.currentPlayer === 'X' ? 'O' : 'X'
      this.setData({ currentPlayer: next, statusText: `当前回合: ${next}` })
    },

    checkWinner(board: string[]): string {
      const lines = [
        [0,1,2],[3,4,5],[6,7,8], // rows
        [0,3,6],[1,4,7],[2,5,8], // cols
        [0,4,8],[2,4,6]          // diag
      ]
      for (const line of lines) {
        const [a,b,c] = line
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a]
        }
      }
      return ''
    },

    onReset() {
      this.setData({
        board: ['', '', '', '', '', '', '', '', ''],
        currentPlayer: 'X',
        winner: '',
        statusText: '当前回合: X'
      })
    }
  }
}) 