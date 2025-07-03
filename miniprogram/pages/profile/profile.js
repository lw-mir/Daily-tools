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
Object.defineProperty(exports, "__esModule", { value: true });
var storage_1 = require("../../utils/storage");
var logger_1 = require("../../utils/logger");
var index_1 = require("../../utils/index");
var dataManager_1 = require("../../utils/dataManager");
Page({
    data: {
        userInfo: {
            nickName: '',
            avatarUrl: ''
        },
        isLoggedIn: false,
        stats: {
            totalUsage: 0,
            toolsUsed: 0,
            daysActive: 0,
            favorites: 0
        },
        favoriteTools: [],
        recentTools: [],
        currentTheme: '默认',
        notificationEnabled: true,
        cacheSize: '0KB',
        showThemeModal: false,
        themes: [
            { id: 'default', name: '默认', color: '#667eea' },
            { id: 'dark', name: '深色', color: '#2c3e50' },
            { id: 'green', name: '清新绿', color: '#27ae60' },
            { id: 'purple', name: '优雅紫', color: '#8e44ad' },
            { id: 'orange', name: '活力橙', color: '#e67e22' }
        ],
        isLoading: false,
        loadingText: '加载中...'
    },
    onLoad: function () {
        logger_1.LoggerService.info('Profile page loaded');
        this.initProfile();
    },
    onShow: function () {
        // 每次显示时刷新数据
        this.loadUserData();
        this.loadStats();
        this.loadFavoriteTools();
        this.loadRecentTools();
        this.loadSettings();
    },
    onUnload: function () {
        logger_1.LoggerService.info('Profile page unloaded');
    },
    // 初始化个人中心
    initProfile: function () {
        this.setData({ isLoading: true, loadingText: '加载个人信息...' });
        try {
            // 尝试获取用户信息
            this.getUserInfo();
            // 加载各项数据
            this.loadUserData();
            this.loadStats();
            this.loadFavoriteTools();
            this.loadRecentTools();
            this.loadSettings();
            this.calculateCacheSize();
        }
        catch (error) {
            logger_1.LoggerService.error('Failed to initialize profile:', error);
        }
        finally {
            this.setData({ isLoading: false });
        }
    },
    // 获取用户信息
    getUserInfo: function () {
        var _this = this;
        var userInfo = storage_1.StorageService.get('user_info');
        if (userInfo) {
            this.setData({
                userInfo: userInfo,
                isLoggedIn: true
            });
        }
        else {
            // 尝试从微信获取用户信息
            wx.getUserInfo({
                success: function (res) {
                    var userInfo = res.userInfo;
                    _this.setData({
                        userInfo: userInfo,
                        isLoggedIn: true
                    });
                    storage_1.StorageService.set('user_info', userInfo);
                    logger_1.LoggerService.info('User info obtained:', userInfo);
                },
                fail: function () {
                    logger_1.LoggerService.info('User info not available');
                }
            });
        }
    },
    // 用户登录
    onGetUserInfo: function (e) {
        if (e.detail.userInfo) {
            var userInfo = e.detail.userInfo;
            this.setData({
                userInfo: userInfo,
                isLoggedIn: true
            });
            storage_1.StorageService.set('user_info', userInfo);
            wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 1500
            });
            logger_1.LoggerService.info('User logged in:', userInfo);
        }
    },
    // 加载用户数据
    loadUserData: function () {
        return __awaiter(this, void 0, void 0, function () {
            var userProfile, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, dataManager_1.dataManager.getUserProfile()];
                    case 1:
                        userProfile = _a.sent();
                        if (userProfile) {
                            this.setData({
                                userInfo: {
                                    nickName: userProfile.nickName,
                                    avatarUrl: userProfile.avatarUrl
                                },
                                isLoggedIn: userProfile.isLoggedIn
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        logger_1.LoggerService.error('Failed to load user data:', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // 加载统计数据
    loadStats: function () {
        return __awaiter(this, void 0, void 0, function () {
            var statistics, favoriteTools, activeDays, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, dataManager_1.dataManager.getAppStatistics()];
                    case 1:
                        statistics = _a.sent();
                        return [4 /*yield*/, dataManager_1.dataManager.getFavoriteTools()];
                    case 2:
                        favoriteTools = _a.sent();
                        if (statistics) {
                            activeDays = Object.keys(statistics.dailyUsage).length;
                            this.setData({
                                stats: {
                                    totalUsage: Math.floor(statistics.totalUsageTime / 1000),
                                    toolsUsed: Object.keys(statistics.toolUsageCount).length,
                                    daysActive: activeDays,
                                    favorites: favoriteTools.length
                                }
                            });
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        logger_1.LoggerService.error('Failed to load stats:', error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    // 原有的loadStats方法内容
    _loadStatsOld: function () {
        try {
            var app_1 = getApp();
            if (app_1.globalData && app_1.globalData.dataManager) {
                var dataManager_2 = app_1.globalData.dataManager;
                // 获取使用统计
                var stats = dataManager_2.getUsageStats();
                this.setData({ stats: stats });
            }
            else {
                // 从本地存储获取统计数据
                var localStats = storage_1.StorageService.get('usage_stats') || {
                    totalUsage: 0,
                    toolsUsed: 0,
                    daysActive: 1,
                    favorites: 0
                };
                this.setData({ stats: localStats });
            }
        }
        catch (error) {
            logger_1.LoggerService.error('Failed to load stats:', error);
        }
    },
    // 加载收藏工具
    loadFavoriteTools: function () {
        return __awaiter(this, void 0, void 0, function () {
            var favoriteIds, favoriteTools, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, dataManager_1.dataManager.getFavoriteTools()];
                    case 1:
                        favoriteIds = _a.sent();
                        favoriteTools = this.getToolsById(favoriteIds);
                        this.setData({ favoriteTools: favoriteTools });
                        logger_1.LoggerService.info('Favorite tools loaded:', favoriteTools.length);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        logger_1.LoggerService.error('Failed to load favorite tools:', error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // 加载最近使用工具
    loadRecentTools: function () {
        return __awaiter(this, void 0, void 0, function () {
            var recentIds, usageHistory_1, recentTools, error_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, dataManager_1.dataManager.getRecentTools()];
                    case 1:
                        recentIds = _a.sent();
                        return [4 /*yield*/, dataManager_1.dataManager.getUsageHistory()];
                    case 2:
                        usageHistory_1 = _a.sent();
                        recentTools = this.getToolsById(recentIds).map(function (tool) {
                            var lastUsage = usageHistory_1.find(function (record) { return record.toolId === tool.id; });
                            return __assign(__assign({}, tool), { lastUsed: lastUsage ? _this.formatLastUsed(lastUsage.timestamp) : '未知' });
                        });
                        this.setData({ recentTools: recentTools });
                        logger_1.LoggerService.info('Recent tools loaded:', recentTools.length);
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        logger_1.LoggerService.error('Failed to load recent tools:', error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    // 根据ID获取工具信息
    getToolsById: function (toolIds) {
        // 这里应该有一个工具配置数组，暂时返回模拟数据
        var allTools = [
            { id: 'calculator', name: '计算器', icon: '🔢', path: '/pages/tools/calculator/calculator' },
            { id: 'converter', name: '单位转换', icon: '📏', path: '/pages/tools/converter/converter' },
            { id: 'qrcode', name: '二维码', icon: '📱', path: '/pages/tools/qrcode/qrcode' },
            { id: 'color', name: '颜色工具', icon: '🎨', path: '/pages/tools/color/color' },
            { id: 'text', name: '文本工具', icon: '📝', path: '/pages/tools/text/text' },
            { id: 'time', name: '时间工具', icon: '⏰', path: '/pages/tools/time/time' }
        ];
        return toolIds.map(function (id) { return allTools.find(function (tool) { return tool.id === id; }); }).filter(Boolean);
    },
    // 格式化最后使用时间
    formatLastUsed: function (timestamp) {
        if (!timestamp)
            return '未知';
        var now = Date.now();
        var diff = now - timestamp;
        var minutes = Math.floor(diff / 60000);
        var hours = Math.floor(diff / 3600000);
        var days = Math.floor(diff / 86400000);
        if (minutes < 1)
            return '刚刚';
        if (minutes < 60)
            return minutes + "\u5206\u949F\u524D";
        if (hours < 24)
            return hours + "\u5C0F\u65F6\u524D";
        if (days < 7)
            return days + "\u5929\u524D";
        return index_1.formatTime(timestamp, 'MM-dd');
    },
    // 加载设置
    loadSettings: function () {
        return __awaiter(this, void 0, void 0, function () {
            var settings, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, dataManager_1.dataManager.getUserSettings()];
                    case 1:
                        settings = _a.sent();
                        if (settings) {
                            this.setData({
                                currentTheme: this.getThemeName(settings.theme),
                                notificationEnabled: settings.notifications.enabled
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        logger_1.LoggerService.error('Failed to load settings:', error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // 获取主题显示名称
    getThemeName: function (themeId) {
        var themeMap = {
            'light': '默认',
            'dark': '深色',
            'auto': '跟随系统'
        };
        return themeMap[themeId] || '默认';
    },
    // 计算缓存大小
    calculateCacheSize: function () {
        return __awaiter(this, void 0, void 0, function () {
            var storageUsage, cacheSize, sizeInBytes, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, dataManager_1.dataManager.getStorageUsage()];
                    case 1:
                        storageUsage = _a.sent();
                        cacheSize = void 0;
                        sizeInBytes = storageUsage.used;
                        if (sizeInBytes < 1024) {
                            cacheSize = sizeInBytes + "B";
                        }
                        else if (sizeInBytes < 1024 * 1024) {
                            cacheSize = (sizeInBytes / 1024).toFixed(1) + "KB";
                        }
                        else {
                            cacheSize = (sizeInBytes / (1024 * 1024)).toFixed(1) + "MB";
                        }
                        this.setData({ cacheSize: cacheSize });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        logger_1.LoggerService.error('Failed to calculate cache size:', error_6);
                        this.setData({ cacheSize: '未知' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // 工具点击
    onToolTap: function (e) {
        var tool = e.currentTarget.dataset.tool;
        if (tool && tool.path) {
            wx.navigateTo({
                url: tool.path,
                success: function () {
                    logger_1.LoggerService.info('Navigated to tool:', tool.name);
                },
                fail: function (error) {
                    logger_1.LoggerService.error('Failed to navigate:', error);
                    wx.showToast({
                        title: '页面跳转失败',
                        icon: 'none',
                        duration: 1500
                    });
                }
            });
        }
    },
    // 取消收藏
    onUnfavorite: function (e) {
        var _this = this;
        var tool = e.currentTarget.dataset.tool;
        wx.showModal({
            title: '取消收藏',
            content: "\u786E\u5B9A\u8981\u53D6\u6D88\u6536\u85CF\"" + tool.name + "\"\u5417\uFF1F",
            success: function (res) {
                if (res.confirm) {
                    var app_2 = getApp();
                    if (app_2.globalData && app_2.globalData.dataManager) {
                        var dataManager_3 = app_2.globalData.dataManager;
                        dataManager_3.removeFavoriteTool(tool.id);
                    }
                    // 更新本地数据
                    var favoriteTools = _this.data.favoriteTools.filter(function (t) { return t.id !== tool.id; });
                    _this.setData({ favoriteTools: favoriteTools });
                    // 更新统计
                    _this.loadStats();
                    wx.showToast({
                        title: '已取消收藏',
                        icon: 'success',
                        duration: 1500
                    });
                    logger_1.LoggerService.info('Tool unfavorited:', tool.name);
                }
            }
        });
    },
    // 管理收藏
    onManageFavorites: function () {
        wx.showToast({
            title: '功能开发中...',
            icon: 'none',
            duration: 1500
        });
    },
    // 清空最近使用
    onClearRecent: function () {
        var _this = this;
        wx.showModal({
            title: '清空记录',
            content: '确定要清空所有使用记录吗？',
            success: function (res) { return __awaiter(_this, void 0, void 0, function () {
                var error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!res.confirm) return [3 /*break*/, 4];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, dataManager_1.dataManager.clearRecentTools()];
                        case 2:
                            _a.sent();
                            this.setData({ recentTools: [] });
                            wx.showToast({
                                title: '已清空记录',
                                icon: 'success',
                                duration: 1500
                            });
                            logger_1.LoggerService.info('Recent tools cleared');
                            return [3 /*break*/, 4];
                        case 3:
                            error_7 = _a.sent();
                            logger_1.LoggerService.error('Failed to clear recent tools:', error_7);
                            wx.showToast({
                                title: '清空失败',
                                icon: 'none',
                                duration: 1500
                            });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); }
        });
    },
    // 主题设置
    onThemeSetting: function () {
        this.setData({ showThemeModal: true });
    },
    // 关闭主题弹窗
    onCloseThemeModal: function () {
        this.setData({ showThemeModal: false });
    },
    // 选择主题
    onThemeSelect: function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var theme, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        theme = e.currentTarget.dataset.theme;
                        this.setData({
                            currentTheme: theme.name,
                            showThemeModal: false
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        // 保存设置
                        return [4 /*yield*/, dataManager_1.dataManager.updateSetting('theme', theme.id)];
                    case 2:
                        // 保存设置
                        _a.sent();
                        wx.showToast({
                            title: "\u5DF2\u5207\u6362\u5230" + theme.name + "\u4E3B\u9898",
                            icon: 'success',
                            duration: 1500
                        });
                        logger_1.LoggerService.info('Theme changed to:', theme.name);
                        return [3 /*break*/, 4];
                    case 3:
                        error_8 = _a.sent();
                        logger_1.LoggerService.error('Failed to save theme setting:', error_8);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    // 语言设置
    onLanguageSetting: function () {
        wx.showToast({
            title: '暂时只支持中文',
            icon: 'none',
            duration: 1500
        });
    },
    // 通知设置改变
    onNotificationChange: function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var enabled, settings, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enabled = e.detail.value;
                        this.setData({ notificationEnabled: enabled });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, dataManager_1.dataManager.getUserSettings()];
                    case 2:
                        settings = _a.sent();
                        if (!settings) return [3 /*break*/, 4];
                        settings.notifications.enabled = enabled;
                        return [4 /*yield*/, dataManager_1.dataManager.saveUserSettings(settings)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        wx.showToast({
                            title: enabled ? '已开启通知' : '已关闭通知',
                            icon: 'success',
                            duration: 1500
                        });
                        logger_1.LoggerService.info('Notification setting changed:', enabled);
                        return [3 /*break*/, 6];
                    case 5:
                        error_9 = _a.sent();
                        logger_1.LoggerService.error('Failed to save notification setting:', error_9);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
    // 缓存管理
    onCacheSetting: function () {
        var _this = this;
        var cacheSize = this.data.cacheSize;
        wx.showModal({
            title: '缓存管理',
            content: "\u5F53\u524D\u7F13\u5B58\u5927\u5C0F\uFF1A" + cacheSize + "\n\n\u6E05\u7406\u7F13\u5B58\u4F1A\u5220\u9664\u6240\u6709\u672C\u5730\u6570\u636E\uFF0C\u5305\u62EC\u6536\u85CF\u3001\u5386\u53F2\u8BB0\u5F55\u7B49\u3002\u786E\u5B9A\u8981\u6E05\u7406\u5417\uFF1F",
            confirmText: '清理',
            confirmColor: '#ff4757',
            success: function (res) {
                if (res.confirm) {
                    _this.clearCache();
                }
            }
        });
    },
    // 清理缓存
    clearCache: function () {
        return __awaiter(this, void 0, void 0, function () {
            var userSettings, userProfile, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wx.showLoading({ title: '清理中...' });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        return [4 /*yield*/, dataManager_1.dataManager.getUserSettings()];
                    case 2:
                        userSettings = _a.sent();
                        return [4 /*yield*/, dataManager_1.dataManager.getUserProfile()];
                    case 3:
                        userProfile = _a.sent();
                        // 清除所有数据
                        return [4 /*yield*/, dataManager_1.dataManager.clearAllData()];
                    case 4:
                        // 清除所有数据
                        _a.sent();
                        if (!userProfile) return [3 /*break*/, 6];
                        return [4 /*yield*/, dataManager_1.dataManager.saveUserProfile(userProfile)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!userSettings) return [3 /*break*/, 8];
                        return [4 /*yield*/, dataManager_1.dataManager.saveUserSettings(userSettings)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        // 重新初始化数据
                        this.initProfile();
                        wx.hideLoading();
                        wx.showToast({
                            title: '缓存已清理',
                            icon: 'success',
                            duration: 1500
                        });
                        logger_1.LoggerService.info('Cache cleared successfully');
                        return [3 /*break*/, 10];
                    case 9:
                        error_10 = _a.sent();
                        wx.hideLoading();
                        logger_1.LoggerService.error('Failed to clear cache:', error_10);
                        wx.showToast({
                            title: '清理失败',
                            icon: 'none',
                            duration: 1500
                        });
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    },
    // 意见反馈
    onFeedback: function () {
        wx.showModal({
            title: '意见反馈',
            content: '感谢您的反馈！请通过以下方式联系我们：\n\n• 微信群：搜索"Dailytools用户群"\n• 邮箱：feedback@dailytools.com',
            showCancel: false,
            confirmText: '知道了'
        });
    },
    // 关于我们
    onAbout: function () {
        wx.showModal({
            title: '关于 Dailytools',
            content: 'Dailytools v1.0.0\n\n一个集成多种实用工具的微信小程序，致力于为用户提供便捷的日常服务。\n\n© 2024 Dailytools Team',
            showCancel: false,
            confirmText: '知道了'
        });
    },
    // 分享应用
    onShare: function () {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        });
        wx.showToast({
            title: '请点击右上角分享',
            icon: 'none',
            duration: 2000
        });
    },
    // 分享给朋友
    onShareAppMessage: function () {
        return {
            title: 'Dailytools - 你的日常工具箱',
            path: '/pages/index/index',
            imageUrl: '/images/share-cover.png'
        };
    },
    // 分享到朋友圈
    onShareTimeline: function () {
        return {
            title: 'Dailytools - 实用工具集合',
            imageUrl: '/images/share-cover.png'
        };
    }
});
