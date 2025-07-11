// 酒桌骰子游戏页面
Page({
    data: {
        diceValue: 1,
        isRolling: false,
        rollCount: 0
    },
    /**
     * 页面加载
     */
    onLoad: function () {
        console.log('酒桌骰子页面加载');
        this.initGame();
    },
    /**
     * 初始化游戏
     */
    initGame: function () {
        this.setData({
            diceValue: 1,
            isRolling: false,
            rollCount: 0
        });
    },
    /**
     * 摇骰子
     */
    rollDice: function () {
        var _this = this;
        if (this.data.isRolling) {
            return;
        }
        console.log('开始摇骰子');
        // 开始摇骰动画
        this.setData({
            isRolling: true
        });
        // 添加触觉反馈
        wx.vibrateShort({
            type: 'heavy'
        });
        // 模拟摇骰过程 - 快速变换点数
        var rollAnimation = 0;
        var rollInterval = setInterval(function () {
            _this.setData({
                diceValue: Math.floor(Math.random() * 6) + 1
            });
            rollAnimation++;
            if (rollAnimation >= 10) { // 摇骰动画持续时间
                clearInterval(rollInterval);
                _this.finishRoll();
            }
        }, 100);
    },
    /**
     * 完成摇骰
     */
    finishRoll: function () {
        // 生成最终结果
        var finalValue = Math.floor(Math.random() * 6) + 1;
        this.setData({
            diceValue: finalValue,
            isRolling: false,
            rollCount: this.data.rollCount + 1
        });
        console.log("\u6447\u9AB0\u7ED3\u679C: " + finalValue + "\u70B9");
        // 结果震动反馈
        setTimeout(function () {
            wx.vibrateShort({
                type: 'medium'
            });
        }, 200);
    },
    /**
     * 页面分享
     */
    onShareAppMessage: function () {
        return {
            title: '酒桌骰子 - 简单好玩的摇骰游戏',
            path: '/pages/games/dice/dice',
            imageUrl: '/images/dice-game.png'
        };
    }
});
