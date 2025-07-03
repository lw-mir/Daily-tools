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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// 获取应用实例
var app = getApp();
var defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
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
                description: '随机选择美食的转盘工具',
                image: '/images/eat-what.jpg',
                icon: '🍽️',
                category: 'foodwheel',
                tags: ['美食', '随机'],
                isFavorite: false
            },
            {
                id: 'image-convert',
                name: '图片转化',
                description: '图像格式转换和处理工具',
                image: '/images/image-convert.jpg',
                icon: '🖼️',
                category: 'converter',
                tags: ['图片', '转换'],
                isFavorite: false
            },
            {
                id: 'calculator-tool',
                name: '计算工具',
                description: '数学计算和单位转换工具',
                image: '/images/calculator.jpg',
                icon: '🔢',
                category: 'calculator',
                tags: ['计算', '数学'],
                isFavorite: false
            },
            {
                id: 'ruler',
                name: '测量工具',
                description: '长度测量和尺寸计算工具',
                image: '/images/ruler.jpg',
                icon: '📏',
                category: 'converter',
                tags: ['测量', '长度'],
                isFavorite: false
            },
            {
                id: 'pliers',
                name: '实用工具',
                description: '各种实用的日常小工具',
                image: '/images/pliers.jpg',
                icon: '🔧',
                category: 'tools',
                tags: ['工具', '实用'],
                isFavorite: false
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
        attached: function () {
            this.initPage();
        },
        ready: function () {
            this.loadRecentTools();
        }
    },
    methods: {
        /**
         * 初始化页面
         */
        initPage: function () {
            console.log('首页初始化');
            // 设置导航栏标题
            wx.setNavigationBarTitle({
                title: '工具集'
            });
        },
        /**
         * 顶部导航栏 - 返回按钮
         */
        onNavBack: function () {
            wx.navigateBack();
        },
        /**
         * 顶部导航栏 - 更多按钮
         */
        onNavMore: function () {
            var _this = this;
            wx.showActionSheet({
                itemList: ['设置', '关于', '反馈'],
                success: function (res) {
                    switch (res.tapIndex) {
                        case 0:
                            _this.navigateToSettings();
                            break;
                        case 1:
                            _this.navigateToAbout();
                            break;
                        case 2:
                            _this.navigateToFeedback();
                            break;
                    }
                }
            });
        },
        /**
         * 标签页切换
         */
        onTabChange: function (e) {
            var tab = e.currentTarget.dataset.tab;
            this.setData({
                currentTab: tab
            });
        },
        /**
         * 底部功能区域点击
         */
        onFunctionTap: function (e) {
            var func = e.currentTarget.dataset.function;
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
        navigateToCategory: function () {
            wx.navigateTo({
                url: '/pages/category/category',
                fail: function () {
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
        navigateToCollect: function () {
            wx.navigateTo({
                url: '/pages/favorites/favorites',
                fail: function () {
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
        navigateToHistory: function () {
            wx.navigateTo({
                url: '/pages/history/history',
                fail: function () {
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
        navigateToHelp: function () {
            wx.navigateTo({
                url: '/pages/help/help',
                fail: function () {
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
        navigateToSettings: function () {
            wx.showToast({
                title: '设置功能开发中',
                icon: 'none'
            });
        },
        /**
         * 导航到关于页面
         */
        navigateToAbout: function () {
            wx.showToast({
                title: '关于功能开发中',
                icon: 'none'
            });
        },
        /**
         * 导航到反馈页面
         */
        navigateToFeedback: function () {
            wx.showToast({
                title: '反馈功能开发中',
                icon: 'none'
            });
        },
        /**
         * 加载最近使用工具
         */
        loadRecentTools: function () {
            var _this = this;
            var recentToolIds = (app.globalData && app.globalData.recentTools) || [];
            var recentTools = [];
            // 根据ID获取工具信息
            recentToolIds.forEach(function (toolId) {
                var tool = _this.findToolById(toolId);
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
        findToolById: function (toolId) {
            return this.data.recommendTools.find(function (tool) { return tool.id === toolId; }) || null;
        },
        /**
         * 搜索输入处理
         */
        onSearchInput: function (e) {
            var value = e.detail.value;
            this.setData({
                searchKeyword: value
            });
        },
        /**
         * 搜索确认
         */
        onSearchConfirm: function (e) {
            var keyword = e.detail.value.trim();
            if (keyword) {
                this.performSearch(keyword);
            }
        },
        /**
         * 清除搜索
         */
        onSearchClear: function () {
            this.setData({
                searchKeyword: ''
            });
        },
        /**
         * 执行搜索
         */
        performSearch: function (keyword) {
            console.log('搜索关键词:', keyword);
            wx.showToast({
                title: "\u641C\u7D22: " + keyword,
                icon: 'none'
            });
        },
        /**
         * 工具点击处理
         */
        onToolTap: function (e) {
            return __awaiter(this, void 0, void 0, function () {
                var tool;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tool = e.currentTarget.dataset.tool;
                            console.log('工具点击:', tool);
                            // 记录到最近使用
                            this.addToRecentTools(tool);
                            // 记录使用历史
                            return [4 /*yield*/, this.addUsageRecord(tool)
                                // 导航到工具页面
                            ];
                        case 1:
                            // 记录使用历史
                            _a.sent();
                            // 导航到工具页面
                            this.navigateToTool(tool);
                            return [2 /*return*/];
                    }
                });
            });
        },
        /**
         * 分类点击处理
         */
        onCategoryTap: function (e) {
            var category = e.currentTarget.dataset.category;
            console.log('分类点击:', category);
            wx.showToast({
                title: category.name + "\u5206\u7C7B",
                icon: 'none'
            });
        },
        /**
         * 切换收藏状态
         */
        onToggleFavorite: function (e) {
            return __awaiter(this, void 0, void 0, function () {
                var tool, DataManager, dataManager, result, toolIndex, updatedTools, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tool = e.currentTarget.dataset.tool;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../../utils/dataManager')); })];
                        case 2:
                            DataManager = (_a.sent()).DataManager;
                            dataManager = DataManager.getInstance();
                            return [4 /*yield*/, dataManager.toggleFavorite(tool.id)];
                        case 3:
                            result = _a.sent();
                            if (result.success) {
                                toolIndex = this.data.recommendTools.findIndex(function (t) { return t.id === tool.id; });
                                if (toolIndex !== -1) {
                                    updatedTools = __spreadArrays(this.data.recommendTools);
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
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            console.error('切换收藏状态失败:', error_1);
                            wx.showToast({
                                title: '操作失败',
                                icon: 'none'
                            });
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        },
        /**
         * 快捷操作点击处理
         */
        onQuickActionTap: function (e) {
            var action = e.currentTarget.dataset.action;
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
        onViewAllRecent: function () {
            wx.showToast({
                title: '查看全部最近使用',
                icon: 'none'
            });
        },
        /**
         * 查看全部推荐
         */
        onViewAllRecommend: function () {
            wx.showToast({
                title: '查看全部推荐',
                icon: 'none'
            });
        },
        /**
         * 导航到工具页面
         */
        navigateToTool: function (tool) {
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
                case 'foodwheel':
                    wx.navigateTo({
                        url: '/pages/tools/foodwheel/foodwheel'
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
        addToRecentTools: function (tool) {
            // 这里可以调用全局数据管理来记录最近使用的工具
            console.log('添加到最近使用:', tool);
        },
        /**
         * 添加使用记录
         */
        addUsageRecord: function (tool) {
            return __awaiter(this, void 0, void 0, function () {
                var DataManager, dataManager, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../../utils/dataManager')); })];
                        case 1:
                            DataManager = (_a.sent()).DataManager;
                            dataManager = DataManager.getInstance();
                            return [4 /*yield*/, dataManager.addUsageRecord({
                                    toolId: tool.id,
                                    toolName: tool.name,
                                    category: tool.category
                                })];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            console.error('添加使用记录失败:', error_2);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        /**
         * 处理扫一扫
         */
        handleScan: function () {
            wx.scanCode({
                success: function (res) {
                    console.log('扫码结果:', res);
                    wx.showModal({
                        title: '扫码结果',
                        content: res.result,
                        showCancel: false
                    });
                },
                fail: function (err) {
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
        navigateToFavorites: function () {
            wx.showToast({
                title: '我的收藏',
                icon: 'none'
            });
        },
        /**
         * 导航到个人中心
         */
        navigateToProfile: function () {
            wx.navigateTo({
                url: '/pages/profile/profile'
            });
        },
        bindViewTap: function () {
            wx.navigateTo({
                url: '../logs/logs'
            });
        },
        onChooseAvatar: function (e) {
            var avatarUrl = e.detail.avatarUrl;
            var nickName = this.data.userInfo.nickName;
            this.setData({
                "userInfo.avatarUrl": avatarUrl,
                hasUserInfo: !!(nickName && avatarUrl && avatarUrl !== defaultAvatarUrl),
            });
        },
        onInputChange: function (e) {
            var nickName = e.detail.value;
            var avatarUrl = this.data.userInfo.avatarUrl;
            this.setData({
                "userInfo.nickName": nickName,
                hasUserInfo: !!(nickName && avatarUrl && avatarUrl !== defaultAvatarUrl),
            });
        },
        getUserProfile: function () {
            var _this = this;
            // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
            wx.getUserProfile({
                desc: '展示用户信息',
                success: function (res) {
                    console.log(res);
                    _this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    });
                }
            });
        },
    }
});
