"use strict";
// index.ts
// import { formatTime } from '../../utils/index'
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
// 获取应用实例
const app = getApp();
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
Component({
    data: {
        // 搜索相关
        searchKeyword: '',
        // 加载状态
        isLoading: false,
        loadingText: '加载中...',
        // 当前标签页
        currentTab: 'tools',
        // 标签列表
        tabList: [
            { id: 'tools', name: '工具' },
            { id: 'recommend', name: '推荐' },
            { id: 'hot', name: '热门' },
            { id: 'mine', name: '我的' }
        ],
        // 底部功能区域
        bottomFunctions: [
            {
                id: 'category',
                name: '分类',
                icon: '📂'
            },
            {
                id: 'collect',
                name: '收藏',
                icon: '⭐'
            },
            {
                id: 'history',
                name: '历史记录',
                icon: '📋'
            },
            {
                id: 'help',
                name: '帮助',
                icon: '❓'
            }
        ],
        // 工具精选
        featuredTools: [
            {
                id: 'eat-what',
                name: '吃什么？',
                description: '用于数打和定制神奇的工具',
                image: '/images/eat-what.jpg',
                icon: '🍽️'
            },
            {
                id: 'image-convert',
                name: '图片转化',
                description: '用于处理或升级有关图像转换的工',
                image: '/images/image-convert.jpg',
                icon: '🖼️'
            },
            {
                id: 'calculator-tool',
                name: '计算工具',
                description: '用于任何数学以及设或转换物理',
                image: '/images/calculator.jpg',
                icon: '🔢'
            },
            {
                id: 'ruler',
                name: '卷尺',
                description: '用于测量长度的工具',
                image: '/images/ruler.jpg',
                icon: '📏'
            },
            {
                id: 'pliers',
                name: '钳子',
                description: '用于夹持、弯曲或切断物体的工',
                image: '/images/pliers.jpg',
                icon: '🔧'
            }
        ],
        // 最近使用工具
        recentTools: [],
        // 工具分类
        toolCategories: [
            {
                id: 'calculator',
                name: '计算器',
                icon: '🔢',
                toolCount: 3,
                description: '基础计算、科学计算等'
            },
            {
                id: 'converter',
                name: '单位转换',
                icon: '📏',
                toolCount: 5,
                description: '长度、重量、温度转换等'
            },
            {
                id: 'qrcode',
                name: '二维码',
                icon: '📱',
                toolCount: 2,
                description: '生成和扫描二维码'
            },
            {
                id: 'color',
                name: '颜色工具',
                icon: '🎨',
                toolCount: 3,
                description: '颜色选择、格式转换等'
            },
            {
                id: 'text',
                name: '文本工具',
                icon: '📝',
                toolCount: 4,
                description: '字数统计、格式转换等'
            },
            {
                id: 'time',
                name: '时间工具',
                icon: '⏰',
                toolCount: 4,
                description: '世界时钟、倒计时等'
            }
        ],
        // 推荐工具
        recommendTools: [
            {
                id: 'basic-calculator',
                name: '基础计算器',
                description: '支持基本的四则运算',
                icon: '🔢',
                tags: ['计算', '数学'],
                isFavorite: false,
                category: 'calculator'
            },
            {
                id: 'unit-converter',
                name: '长度转换',
                description: '米、厘米、英寸等单位转换',
                icon: '📏',
                tags: ['转换', '长度'],
                isFavorite: false,
                category: 'converter'
            },
            {
                id: 'qr-generator',
                name: '二维码生成',
                description: '快速生成各种二维码',
                icon: '📱',
                tags: ['二维码', '生成'],
                isFavorite: true,
                category: 'qrcode'
            },
            {
                id: 'color-picker',
                name: '颜色选择器',
                description: '选择和转换颜色格式',
                icon: '🎨',
                tags: ['颜色', '设计'],
                isFavorite: false,
                category: 'color'
            }
        ],
        // 热门工具
        hotTools: [
            {
                id: 'hot-calculator',
                name: '科学计算器',
                description: '支持复杂数学运算',
                icon: '🔬',
                category: 'calculator'
            },
            {
                id: 'hot-converter',
                name: '货币转换',
                description: '实时汇率转换',
                icon: '💱',
                category: 'converter'
            },
            {
                id: 'hot-qr',
                name: 'WiFi二维码',
                description: '生成WiFi连接二维码',
                icon: '📶',
                category: 'qrcode'
            }
        ],
        // 我的工具（收藏的工具）
        myTools: [
            {
                id: 'my-calculator',
                name: '我的计算器',
                description: '常用的计算器工具',
                icon: '🔢',
                category: 'calculator'
            },
            {
                id: 'my-converter',
                name: '我的转换器',
                description: '常用的单位转换',
                icon: '📏',
                category: 'converter'
            }
        ],
        // 快捷入口
        quickActions: [
            {
                id: 'scan',
                name: '扫一扫',
                icon: '📷',
                action: 'scan'
            },
            {
                id: 'favorites',
                name: '我的收藏',
                icon: '❤️',
                action: 'favorites'
            },
            {
                id: 'history',
                name: '使用历史',
                icon: '📋',
                action: 'history'
            },
            {
                id: 'profile',
                name: '个人中心',
                icon: '👤',
                action: 'profile'
            }
        ],
        motto: 'Hello World',
        userInfo: {
            avatarUrl: defaultAvatarUrl,
            nickName: '',
        },
        hasUserInfo: false,
        canIUseGetUserProfile: wx.canIUse('getUserProfile'),
        canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    },
    lifetimes: {
        attached() {
            this.initPage();
        },
        ready() {
            this.loadRecentTools();
        }
    },
    methods: {
        /**
         * 初始化页面
         */
        initPage() {
            console.log('首页初始化');
            // 设置导航栏标题
            wx.setNavigationBarTitle({
                title: '工具集'
            });
        },
        /**
         * 顶部导航栏 - 返回按钮
         */
        onNavBack() {
            wx.navigateBack();
        },
        /**
         * 顶部导航栏 - 更多按钮
         */
        onNavMore() {
            wx.showActionSheet({
                itemList: ['设置', '关于', '反馈'],
                success: (res) => {
                    switch (res.tapIndex) {
                        case 0:
                            this.navigateToSettings();
                            break;
                        case 1:
                            this.navigateToAbout();
                            break;
                        case 2:
                            this.navigateToFeedback();
                            break;
                    }
                }
            });
        },
        /**
         * 标签页切换
         */
        onTabChange(e) {
            const tab = e.currentTarget.dataset.tab;
            this.setData({
                currentTab: tab
            });
        },
        /**
         * 底部功能区域点击
         */
        onFunctionTap(e) {
            const func = e.currentTarget.dataset.function;
            console.log('功能点击:', func);
            switch (func.id) {
                case 'category':
                    this.navigateToCategory();
                    break;
                case 'collect':
                    this.navigateToCollect();
                    break;
                case 'history':
                    this.navigateToHistory();
                    break;
                case 'help':
                    this.navigateToHelp();
                    break;
            }
        },
        /**
         * 导航到分类页面
         */
        navigateToCategory() {
            wx.navigateTo({
                url: '/pages/category/category',
                fail: () => {
                    wx.showToast({
                        title: '分类功能开发中',
                        icon: 'none'
                    });
                }
            });
        },
        /**
         * 导航到收藏页面
         */
        navigateToCollect() {
            wx.navigateTo({
                url: '/pages/favorites/favorites',
                fail: () => {
                    wx.showToast({
                        title: '页面不存在',
                        icon: 'none'
                    });
                }
            });
        },
        /**
         * 导航到历史记录页面
         */
        navigateToHistory() {
            wx.navigateTo({
                url: '/pages/history/history',
                fail: () => {
                    wx.showToast({
                        title: '页面不存在',
                        icon: 'none'
                    });
                }
            });
        },
        /**
         * 导航到帮助页面
         */
        navigateToHelp() {
            wx.navigateTo({
                url: '/pages/help/help',
                fail: () => {
                    wx.showToast({
                        title: '帮助功能开发中',
                        icon: 'none'
                    });
                }
            });
        },
        /**
         * 导航到设置页面
         */
        navigateToSettings() {
            wx.showToast({
                title: '设置功能开发中',
                icon: 'none'
            });
        },
        /**
         * 导航到关于页面
         */
        navigateToAbout() {
            wx.showToast({
                title: '关于功能开发中',
                icon: 'none'
            });
        },
        /**
         * 导航到反馈页面
         */
        navigateToFeedback() {
            wx.showToast({
                title: '反馈功能开发中',
                icon: 'none'
            });
        },
        /**
         * 加载最近使用工具
         */
        loadRecentTools() {
            var _a;
            const recentToolIds = ((_a = app.globalData) === null || _a === void 0 ? void 0 : _a.recentTools) || [];
            const recentTools = [];
            // 根据ID获取工具信息
            recentToolIds.forEach(toolId => {
                const tool = this.findToolById(toolId);
                if (tool) {
                    recentTools.push(tool);
                }
            });
            this.setData({
                recentTools: recentTools.slice(0, 6) // 最多显示6个
            });
        },
        /**
         * 根据ID查找工具
         */
        findToolById(toolId) {
            return this.data.recommendTools.find(tool => tool.id === toolId) || null;
        },
        /**
         * 搜索输入处理
         */
        onSearchInput(e) {
            const value = e.detail.value;
            this.setData({
                searchKeyword: value
            });
        },
        /**
         * 搜索确认
         */
        onSearchConfirm(e) {
            const keyword = e.detail.value.trim();
            if (keyword) {
                this.performSearch(keyword);
            }
        },
        /**
         * 清除搜索
         */
        onSearchClear() {
            this.setData({
                searchKeyword: ''
            });
        },
        /**
         * 执行搜索
         */
        performSearch(keyword) {
            console.log('搜索关键词:', keyword);
            wx.showToast({
                title: `搜索: ${keyword}`,
                icon: 'none'
            });
        },
        /**
         * 工具点击处理
         */
        async onToolTap(e) {
            const tool = e.currentTarget.dataset.tool;
            console.log('工具点击:', tool);
            // 记录到最近使用
            this.addToRecentTools(tool);
            // 记录使用历史
            await this.addUsageRecord(tool);
            // 导航到工具页面
            this.navigateToTool(tool);
        },
        /**
         * 分类点击处理
         */
        onCategoryTap(e) {
            const category = e.currentTarget.dataset.category;
            console.log('分类点击:', category);
            wx.showToast({
                title: `${category.name}分类`,
                icon: 'none'
            });
        },
        /**
         * 切换收藏状态
         */
        async onToggleFavorite(e) {
            const tool = e.currentTarget.dataset.tool;
            try {
                const { DataManager } = await Promise.resolve().then(() => __importStar(require('../../utils/dataManager')));
                const dataManager = DataManager.getInstance();
                const result = await dataManager.toggleFavorite(tool.id);
                if (result.success) {
                    // 更新界面显示
                    const toolIndex = this.data.recommendTools.findIndex(t => t.id === tool.id);
                    if (toolIndex !== -1) {
                        const updatedTools = [...this.data.recommendTools];
                        updatedTools[toolIndex].isFavorite = result.isFavorite;
                        this.setData({
                            recommendTools: updatedTools
                        });
                    }
                    wx.showToast({
                        title: result.isFavorite ? '已收藏' : '已取消收藏',
                        icon: 'success'
                    });
                }
                else {
                    wx.showToast({
                        title: result.message || '操作失败',
                        icon: 'none'
                    });
                }
            }
            catch (error) {
                console.error('切换收藏状态失败:', error);
                wx.showToast({
                    title: '操作失败',
                    icon: 'none'
                });
            }
        },
        /**
         * 快捷操作点击处理
         */
        onQuickActionTap(e) {
            const action = e.currentTarget.dataset.action;
            console.log('快捷操作:', action);
            switch (action.action) {
                case 'scan':
                    this.handleScan();
                    break;
                case 'favorites':
                    this.navigateToFavorites();
                    break;
                case 'history':
                    this.navigateToHistory();
                    break;
                case 'profile':
                    this.navigateToProfile();
                    break;
            }
        },
        /**
         * 查看全部最近使用
         */
        onViewAllRecent() {
            wx.showToast({
                title: '查看全部最近使用',
                icon: 'none'
            });
        },
        /**
         * 查看全部推荐
         */
        onViewAllRecommend() {
            wx.showToast({
                title: '查看全部推荐',
                icon: 'none'
            });
        },
        /**
         * 导航到工具页面
         */
        navigateToTool(tool) {
            console.log('导航到工具:', tool);
            switch (tool.category) {
                case 'calculator':
                    wx.navigateTo({
                        url: '/pages/tools/calculator/calculator'
                    });
                    break;
                case 'converter':
                    wx.navigateTo({
                        url: '/pages/tools/converter/converter'
                    });
                    break;
                case 'qrcode':
                    wx.navigateTo({
                        url: '/pages/tools/qrcode/qrcode'
                    });
                    break;
                default:
                    wx.showToast({
                        title: '功能开发中',
                        icon: 'none'
                    });
            }
        },
        /**
         * 添加到最近使用
         */
        addToRecentTools(tool) {
            // 这里可以调用全局数据管理来记录最近使用的工具
            console.log('添加到最近使用:', tool);
        },
        /**
         * 添加使用记录
         */
        async addUsageRecord(tool) {
            try {
                const { DataManager } = await Promise.resolve().then(() => __importStar(require('../../utils/dataManager')));
                const dataManager = DataManager.getInstance();
                await dataManager.addUsageRecord({
                    toolId: tool.id,
                    toolName: tool.name,
                    category: tool.category
                });
            }
            catch (error) {
                console.error('添加使用记录失败:', error);
            }
        },
        /**
         * 处理扫一扫
         */
        handleScan() {
            wx.scanCode({
                success: (res) => {
                    console.log('扫码结果:', res);
                    wx.showModal({
                        title: '扫码结果',
                        content: res.result,
                        showCancel: false
                    });
                },
                fail: (err) => {
                    console.error('扫码失败:', err);
                    wx.showToast({
                        title: '扫码失败',
                        icon: 'error'
                    });
                }
            });
        },
        /**
         * 导航到收藏页面
         */
        navigateToFavorites() {
            wx.showToast({
                title: '我的收藏',
                icon: 'none'
            });
        },
        /**
         * 导航到个人中心
         */
        navigateToProfile() {
            wx.navigateTo({
                url: '/pages/profile/profile'
            });
        },
        bindViewTap() {
            wx.navigateTo({
                url: '../logs/logs'
            });
        },
        onChooseAvatar(e) {
            const { avatarUrl } = e.detail;
            const { nickName } = this.data.userInfo;
            this.setData({
                "userInfo.avatarUrl": avatarUrl,
                hasUserInfo: !!(nickName && avatarUrl && avatarUrl !== defaultAvatarUrl),
            });
        },
        onInputChange(e) {
            const nickName = e.detail.value;
            const { avatarUrl } = this.data.userInfo;
            this.setData({
                "userInfo.nickName": nickName,
                hasUserInfo: !!(nickName && avatarUrl && avatarUrl !== defaultAvatarUrl),
            });
        },
        getUserProfile() {
            // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
            wx.getUserProfile({
                desc: '展示用户信息',
                success: (res) => {
                    console.log(res);
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    });
                }
            });
        },
    }
});
