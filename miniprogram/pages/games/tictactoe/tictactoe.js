"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    onLoad: function () {
        console.log('酒桌骰子游戏页面加载');
        this.initGame();
    },
    // 初始化游戏
    initGame: function () {
        this.setData({
            gameState: {
                isPlaying: false,
                currentPlayer: 0,
                round: 1,
                maxRounds: 10,
                winner: null
            },
            players: this.data.players.map(function (player) { return (__assign(__assign({}, player), { score: 0 })); }),
            diceResult: null,
            isRolling: false
        });
    },
    // 开始游戏
    startGame: function () {
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
    rollDice: function () {
        var _this = this;
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
        setTimeout(function () {
            var diceValue = Math.floor(Math.random() * 6) + 1;
            var result = {
                value: diceValue,
                timestamp: Date.now()
            };
            _this.setData({
                diceResult: result,
                isRolling: false
            });
            _this.handleDiceResult(diceValue);
        }, 1000);
    },
    // 处理骰子结果
    handleDiceResult: function (value) {
        var _this = this;
        var currentPlayer = this.data.players[this.data.gameState.currentPlayer];
        var message = '';
        switch (value) {
            case 1:
                message = currentPlayer.name + " \u63B7\u51FA1\u70B9\uFF0C\u559D\u4E00\u676F\uFF01";
                break;
            case 2:
            case 3:
                message = currentPlayer.name + " \u63B7\u51FA" + value + "\u70B9\uFF0C\u53EF\u4EE5\u6307\u5B9A\u4ED6\u4EBA\u559D\u9152\uFF01";
                break;
            case 4:
            case 5:
                message = currentPlayer.name + " \u63B7\u51FA" + value + "\u70B9\uFF0C\u5927\u5BB6\u4E00\u8D77\u559D\uFF01";
                break;
            case 6:
                message = currentPlayer.name + " \u63B7\u51FA6\u70B9\uFF0C\u518D\u6765\u4E00\u6B21\uFF01";
                break;
        }
        wx.showModal({
            title: '骰子结果',
            content: message,
            showCancel: false,
            complete: function () {
                if (value !== 6) {
                    _this.nextPlayer();
                }
            }
        });
    },
    // 下一个玩家
    nextPlayer: function () {
        var nextPlayerIndex = (this.data.gameState.currentPlayer + 1) % this.data.players.length;
        var nextRound = this.data.gameState.round;
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
    endGame: function () {
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
    resetGame: function () {
        var _this = this;
        wx.showModal({
            title: '重置游戏',
            content: '确定要重置游戏吗？',
            success: function (res) {
                if (res.confirm) {
                    _this.initGame();
                    wx.showToast({
                        title: '游戏已重置',
                        icon: 'success'
                    });
                }
            }
        });
    },
    // 显示/隐藏规则
    toggleRules: function () {
        this.setData({
            showRules: !this.data.showRules
        });
    },
    // 返回上一页
    goBack: function () {
        wx.navigateBack();
    }
});
