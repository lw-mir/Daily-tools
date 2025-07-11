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
var authManager_1 = require("../../utils/authManager");
var userInfoProcessor_1 = require("../../utils/userInfoProcessor");
var userDataStorage_1 = require("../../utils/userDataStorage");
Page({
    data: {
        userInfo: {
            nickName: '',
            avatarUrl: '',
            gender: 0,
            country: '',
            province: '',
            city: '',
            language: ''
        },
        isLoggedIn: false,
        loginTimeText: '',
        // 登录相关状态
        isLoggingIn: false,
        showRetryModal: false,
        authErrorMessage: '',
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
        loadingText: '加载中...',
        // 用户等级和认证
        userLevel: 'VIP',
        isVerified: true
    },
    onLoad: function () {
        logger_1.LoggerService.info('Profile page loaded');
        this.initProfile();
    },
    onShow: function () {
        // 每次显示时刷新数据
        this.checkLoginStatus();
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
            // 检查登录状态
            this.checkLoginStatus();
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
    // 检查登录状态
    checkLoginStatus: function () {
        try {
            var isLoggedIn = authManager_1.authManager.isLoggedIn();
            var userInfo = authManager_1.authManager.getUserInfo();
            if (isLoggedIn && userInfo) {
                // 格式化登录时间
                var loginState = authManager_1.authManager.getLoginStateInfo();
                var loginTimeText = loginState ?
                    index_1.formatTime(loginState.loginTime) : '';
                this.setData({
                    isLoggedIn: true,
                    userInfo: userInfo,
                    loginTimeText: loginTimeText
                });
                logger_1.LoggerService.info('用户已登录:', userInfo);
                // 验证用户信息
                this.validateUserInfo(userInfo);
            }
            else {
                this.setData({
                    isLoggedIn: false,
                    userInfo: {
                        nickName: '',
                        avatarUrl: '',
                        gender: 0,
                        country: '',
                        province: '',
                        city: '',
                        language: ''
                    },
                    loginTimeText: ''
                });
                logger_1.LoggerService.info('用户未登录');
            }
        }
        catch (error) {
            logger_1.LoggerService.error('检查登录状态失败:', error);
        }
    },
    // 验证用户信息
    validateUserInfo: function (userInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var validation, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, userInfoProcessor_1.userInfoProcessor.validateUserInfo(userInfo)];
                    case 1:
                        validation = _a.sent();
                        if (!!validation.isValid) return [3 /*break*/, 3];
                        logger_1.LoggerService.warn('用户信息验证失败:', validation.errors);
                        if (!validation.errors.some(function (error) { return error.includes('头像') || error.includes('昵称'); })) return [3 /*break*/, 3];
                        logger_1.LoggerService.info('尝试刷新用户信息');
                        return [4 /*yield*/, this.refreshUserInfo()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (validation.warnings.length > 0) {
                            logger_1.LoggerService.warn('用户信息警告:', validation.warnings);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        logger_1.LoggerService.error('验证用户信息时出错:', error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    // 刷新用户信息
    refreshUserInfo: function () {
        return __awaiter(this, void 0, void 0, function () {
            var currentUserInfo, refreshedUserInfo, loginState, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!authManager_1.authManager.isLoggedIn()) {
                            return [2 /*return*/];
                        }
                        currentUserInfo = authManager_1.authManager.getUserInfo();
                        if (!currentUserInfo) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, userInfoProcessor_1.userInfoProcessor.processUserInfo(currentUserInfo)];
                    case 1:
                        refreshedUserInfo = _a.sent();
                        loginState = authManager_1.authManager.getLoginStateInfo();
                        if (loginState) {
                            loginState.userInfo = refreshedUserInfo;
                            authManager_1.authManager.saveLoginState(loginState);
                            // 更新页面数据
                            this.setData({
                                userInfo: refreshedUserInfo
                            });
                            logger_1.LoggerService.info('用户信息已刷新:', refreshedUserInfo);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        logger_1.LoggerService.error('刷新用户信息失败:', error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // 微信授权登录
    onLogin: function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, loginState, loginTimeText, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.data.isLoggingIn)
                            return [2 /*return*/];
                        this.setData({ isLoggingIn: true });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        logger_1.LoggerService.info('开始微信授权登录');
                        return [4 /*yield*/, authManager_1.authManager.login()];
                    case 2:
                        result = _a.sent();
                        if (result.success && result.userInfo) {
                            loginState = authManager_1.authManager.getLoginStateInfo();
                            loginTimeText = loginState ?
                                index_1.formatTime(loginState.loginTime) : '';
                            this.setData({
                                isLoggedIn: true,
                                userInfo: result.userInfo,
                                loginTimeText: loginTimeText,
                                isLoggingIn: false
                            });
                            // 重新加载用户相关数据
                            this.loadStats();
                            this.loadFavoriteTools();
                            this.loadRecentTools();
                            wx.showToast({
                                title: '登录成功',
                                icon: 'success',
                                duration: 2000
                            });
                            logger_1.LoggerService.info('微信授权登录成功');
                        }
                        else {
                            // 登录失败
                            this.setData({
                                isLoggingIn: false,
                                showRetryModal: true,
                                authErrorMessage: result.error || '登录失败，请重试'
                            });
                            logger_1.LoggerService.warn('微信授权登录失败:', result.error);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        this.setData({
                            isLoggingIn: false,
                            showRetryModal: true,
                            authErrorMessage: '网络错误，请检查网络连接'
                        });
                        logger_1.LoggerService.error('微信授权登录异常:', error_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    // 头像加载成功
    onAvatarLoad: function () {
        logger_1.LoggerService.info('用户头像加载成功');
    },
    // 头像加载失败，使用默认头像
    onAvatarError: function () {
        logger_1.LoggerService.warn('用户头像加载失败，使用默认头像');
        var defaultAvatars = [
            '/images/default-avatar-1.png',
            '/images/default-avatar-2.png',
            '/images/default-avatar-3.png'
        ];
        var randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
        this.setData({
            'userInfo.avatarUrl': randomAvatar
        });
    },
    // 显示用户详细信息
    showUserInfoDetail: function () {
        if (!this.data.isLoggedIn || !this.data.userInfo)
            return;
        var userInfo = this.data.userInfo;
        var genderText = userInfo.gender === 1 ? '男' : userInfo.gender === 2 ? '女' : '未知';
        var details = [
            "\u6635\u79F0\uFF1A" + (userInfo.nickName || '未设置'),
            "\u6027\u522B\uFF1A" + genderText,
            "\u57CE\u5E02\uFF1A" + (userInfo.city || '未知'),
            "\u7701\u4EFD\uFF1A" + (userInfo.province || '未知'),
            "\u56FD\u5BB6\uFF1A" + (userInfo.country || '未知'),
            "\u8BED\u8A00\uFF1A" + (userInfo.language || '未知'),
            "\u767B\u5F55\u65F6\u95F4\uFF1A" + (this.data.loginTimeText || '未知')
        ].join('\n');
        wx.showModal({
            title: '用户信息详情',
            content: details,
            showCancel: false,
            confirmText: '确定'
        });
    },
    // 退出登录
    onLogout: function () {
        var _this = this;
        wx.showModal({
            title: '确认退出',
            content: '退出登录后将无法查看个人数据，确定要退出吗？',
            success: function (res) {
                if (res.confirm) {
                    authManager_1.authManager.logout();
                    _this.setData({
                        isLoggedIn: false,
                        userInfo: {
                            nickName: '',
                            avatarUrl: '',
                            gender: 0,
                            country: '',
                            province: '',
                            city: '',
                            language: ''
                        },
                        loginTimeText: '',
                        favoriteTools: [],
                        recentTools: [],
                        stats: {
                            totalUsage: 0,
                            toolsUsed: 0,
                            daysActive: 0,
                            favorites: 0
                        }
                    });
                    wx.showToast({
                        title: '已退出登录',
                        icon: 'success',
                        duration: 1500
                    });
                    logger_1.LoggerService.info('用户退出登录');
                }
            }
        });
    },
    // 重试登录
    onRetryLogin: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setData({ showRetryModal: false });
                        return [4 /*yield*/, this.onLogin()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    // 关闭重试弹窗
    onCloseRetryModal: function () {
        this.setData({ showRetryModal: false });
    },
    // 加载用户数据
    loadUserData: function () {
        return __awaiter(this, void 0, void 0, function () {
            var userProfile, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.data.isLoggedIn)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dataManager_1.dataManager.getUserProfile()];
                    case 2:
                        userProfile = _a.sent();
                        if (userProfile) {
                            this.setData({
                                userInfo: {
                                    nickName: userProfile.nickName || '',
                                    avatarUrl: userProfile.avatarUrl || '',
                                    gender: userProfile.gender || 0,
                                    country: userProfile.country || '',
                                    province: userProfile.province || '',
                                    city: userProfile.city || '',
                                    language: userProfile.language || ''
                                }
                            });
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        logger_1.LoggerService.error('Failed to load user data:', error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    // 加载统计数据
    loadStats: function () {
        return __awaiter(this, void 0, void 0, function () {
            var stats, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.data.isLoggedIn) {
                            this.setData({
                                stats: {
                                    totalUsage: 0,
                                    toolsUsed: 0,
                                    daysActive: 0,
                                    favorites: 0
                                }
                            });
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dataManager_1.dataManager.getUserStats()];
                    case 2:
                        stats = _a.sent();
                        if (stats) {
                            this.setData({ stats: stats });
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        logger_1.LoggerService.error('Failed to load stats:', error_5);
                        this._loadStatsOld();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    // 旧版统计数据加载（兼容）
    _loadStatsOld: function () {
        try {
            var favoriteTools = storage_1.StorageService.get('favorite_tools') || [];
            var usageHistory = storage_1.StorageService.get('usage_history') || [];
            var recentTools = storage_1.StorageService.get('recent_tools') || [];
            var toolsUsed = new Set(usageHistory.map(function (item) { return item.toolId; })).size;
            var daysActive = new Set(usageHistory.map(function (item) {
                return new Date(item.timestamp).toDateString();
            })).size;
            this.setData({
                stats: {
                    totalUsage: usageHistory.length,
                    toolsUsed: toolsUsed,
                    daysActive: daysActive,
                    favorites: favoriteTools.length
                }
            });
        }
        catch (error) {
            logger_1.LoggerService.error('Failed to load old stats:', error);
        }
    },
    // 加载收藏工具
    loadFavoriteTools: function () {
        return __awaiter(this, void 0, void 0, function () {
            var favoriteIds, favoriteTools, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.data.isLoggedIn) {
                            this.setData({ favoriteTools: [] });
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dataManager_1.dataManager.getFavoriteTools()];
                    case 2:
                        favoriteIds = _a.sent();
                        favoriteTools = this.getToolsById(favoriteIds);
                        this.setData({ favoriteTools: favoriteTools });
                        return [3 /*break*/, 4];
                    case 3:
                        error_6 = _a.sent();
                        logger_1.LoggerService.error('Failed to load favorite tools:', error_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    // 加载最近使用工具
    loadRecentTools: function () {
        return __awaiter(this, void 0, void 0, function () {
            var recentHistory, recentTools, error_7;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.data.isLoggedIn) {
                            this.setData({ recentTools: [] });
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dataManager_1.dataManager.getRecentToolsWithTimestamp(5)];
                    case 2:
                        recentHistory = _a.sent();
                        recentTools = recentHistory.map(function (item) {
                            var tool = _this.getToolsById([item.toolId])[0];
                            if (tool) {
                                return __assign(__assign({}, tool), { lastUsed: _this.formatLastUsed(item.timestamp) });
                            }
                            return null;
                        }).filter(Boolean);
                        this.setData({ recentTools: recentTools });
                        return [3 /*break*/, 4];
                    case 3:
                        error_7 = _a.sent();
                        logger_1.LoggerService.error('Failed to load recent tools:', error_7);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    // 根据ID获取工具信息
    getToolsById: function (toolIds) {
        var allTools = [
            { id: 'calculator', name: '计算器', icon: '🧮', description: '科学计算器', path: '/pages/tools/calculator/calculator' },
            { id: 'converter', name: '单位转换', icon: '🔄', description: '长度、重量等单位转换', path: '/pages/tools/converter/converter' },
            { id: 'qrcode', name: '二维码', icon: '📱', description: '二维码生成与识别', path: '/pages/tools/qrcode/qrcode' },
            { id: 'foodwheel', name: '今天吃什么', icon: '🍽️', description: '随机推荐美食', path: '/pages/tools/foodwheel/foodwheel' }
        ];
        return toolIds.map(function (id) { return allTools.find(function (tool) { return tool.id === id; }); }).filter(Boolean);
    },
    // 格式化最后使用时间
    formatLastUsed: function (timestamp) {
        var now = Date.now();
        var diff = now - timestamp;
        var minute = 60 * 1000;
        var hour = 60 * minute;
        var day = 24 * hour;
        if (diff < minute) {
            return '刚刚';
        }
        else if (diff < hour) {
            return Math.floor(diff / minute) + "\u5206\u949F\u524D";
        }
        else if (diff < day) {
            return Math.floor(diff / hour) + "\u5C0F\u65F6\u524D";
        }
        else {
            return Math.floor(diff / day) + "\u5929\u524D";
        }
    },
    // 加载设置
    loadSettings: function () {
        return __awaiter(this, void 0, void 0, function () {
            var settings, error_8;
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
                        error_8 = _a.sent();
                        logger_1.LoggerService.error('Failed to load settings:', error_8);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // 获取主题名称
    getThemeName: function (themeId) {
        var theme = this.data.themes.find(function (t) { return t.id === themeId; });
        return theme ? theme.name : '默认';
    },
    // 计算缓存大小
    calculateCacheSize: function () {
        return __awaiter(this, void 0, void 0, function () {
            var cacheInfo, sizeInKB, sizeText, error_9, keys, totalSize_1, sizeInKB;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, dataManager_1.dataManager.getCacheInfo()];
                    case 1:
                        cacheInfo = _a.sent();
                        if (cacheInfo) {
                            sizeInKB = Math.round(cacheInfo.size / 1024);
                            sizeText = sizeInKB > 1024 ?
                                (sizeInKB / 1024).toFixed(1) + "MB" :
                                sizeInKB + "KB";
                            this.setData({ cacheSize: sizeText });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        logger_1.LoggerService.error('Failed to calculate cache size:', error_9);
                        // 简单估算
                        try {
                            keys = ['favorite_tools', 'recent_tools', 'usage_history', 'user_settings'];
                            totalSize_1 = 0;
                            keys.forEach(function (key) {
                                var data = storage_1.StorageService.get(key);
                                if (data) {
                                    totalSize_1 += JSON.stringify(data).length;
                                }
                            });
                            sizeInKB = Math.round(totalSize_1 / 1024);
                            this.setData({ cacheSize: sizeInKB + "KB" });
                        }
                        catch (estimateError) {
                            logger_1.LoggerService.error('Failed to estimate cache size:', estimateError);
                            this.setData({ cacheSize: '未知' });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // 工具点击事件
    onToolTap: function (e) {
        var tool = e.currentTarget.dataset.tool;
        if (tool && tool.path) {
            // 记录使用历史
            if (this.data.isLoggedIn) {
                dataManager_1.dataManager.recordToolUsage(tool.id).catch(function (error) {
                    logger_1.LoggerService.error('Failed to record tool usage:', error);
                });
            }
            wx.navigateTo({
                url: tool.path,
                fail: function (error) {
                    logger_1.LoggerService.error('Failed to navigate to tool:', error);
                    wx.showToast({
                        title: '页面跳转失败',
                        icon: 'none',
                        duration: 2000
                    });
                }
            });
        }
    },
    // 取消收藏
    onUnfavorite: function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var tool, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.data.isLoggedIn)
                            return [2 /*return*/];
                        tool = e.currentTarget.dataset.tool;
                        if (!tool) return [3 /*break*/, 6];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, dataManager_1.dataManager.removeFavoriteTool(tool.id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.loadFavoriteTools()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.loadStats()];
                    case 4:
                        _a.sent();
                        wx.showToast({
                            title: '已取消收藏',
                            icon: 'success',
                            duration: 1500
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        error_10 = _a.sent();
                        logger_1.LoggerService.error('Failed to unfavorite tool:', error_10);
                        wx.showToast({
                            title: '操作失败',
                            icon: 'none',
                            duration: 2000
                        });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
    // 管理收藏
    onManageFavorites: function () {
        if (!this.data.isLoggedIn) {
            this.onLogin();
            return;
        }
        wx.navigateTo({
            url: '/pages/favorites/favorites',
            fail: function (error) {
                logger_1.LoggerService.error('Failed to navigate to favorites:', error);
            }
        });
    },
    // 清空最近使用
    onClearRecent: function () {
        var _this = this;
        if (!this.data.isLoggedIn)
            return;
        wx.showModal({
            title: '确认清空',
            content: '确定要清空所有使用记录吗？',
            success: function (res) { return __awaiter(_this, void 0, void 0, function () {
                var error_11;
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
                            return [3 /*break*/, 4];
                        case 3:
                            error_11 = _a.sent();
                            logger_1.LoggerService.error('Failed to clear recent tools:', error_11);
                            wx.showToast({
                                title: '操作失败',
                                icon: 'none',
                                duration: 2000
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
            var theme, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        theme = e.currentTarget.dataset.theme;
                        if (!theme) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dataManager_1.dataManager.updateUserSettings({ theme: theme.id })];
                    case 2:
                        _a.sent();
                        this.setData({
                            currentTheme: theme.name,
                            showThemeModal: false
                        });
                        wx.showToast({
                            title: "\u5DF2\u5207\u6362\u5230" + theme.name,
                            icon: 'success',
                            duration: 1500
                        });
                        logger_1.LoggerService.info('Theme changed to:', theme.name);
                        return [3 /*break*/, 4];
                    case 3:
                        error_12 = _a.sent();
                        logger_1.LoggerService.error('Failed to update theme:', error_12);
                        wx.showToast({
                            title: '设置失败',
                            icon: 'none',
                            duration: 2000
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    // 语言设置
    onLanguageSetting: function () {
        wx.showToast({
            title: '暂不支持多语言',
            icon: 'none',
            duration: 2000
        });
    },
    // 通知设置变更
    onNotificationChange: function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var enabled, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enabled = e.detail.value;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dataManager_1.dataManager.updateUserSettings({
                                notifications: {
                                    enabled: enabled,
                                    dailyReminder: false,
                                    updateNotice: true
                                }
                            })];
                    case 2:
                        _a.sent();
                        this.setData({ notificationEnabled: enabled });
                        wx.showToast({
                            title: enabled ? '已开启通知' : '已关闭通知',
                            icon: 'success',
                            duration: 1500
                        });
                        logger_1.LoggerService.info('Notification setting changed to:', enabled);
                        return [3 /*break*/, 4];
                    case 3:
                        error_13 = _a.sent();
                        logger_1.LoggerService.error('Failed to update notification setting:', error_13);
                        // 回滚设置
                        this.setData({ notificationEnabled: !enabled });
                        wx.showToast({
                            title: '设置失败',
                            icon: 'none',
                            duration: 2000
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    // 缓存设置
    onCacheSetting: function () {
        var _this = this;
        wx.showActionSheet({
            itemList: ['清理缓存', '查看缓存详情'],
            success: function (res) {
                if (res.tapIndex === 0) {
                    _this.clearCache();
                }
                else if (res.tapIndex === 1) {
                    _this.showCacheDetails();
                }
            }
        });
    },
    // 清理缓存
    clearCache: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                wx.showModal({
                    title: '清理缓存',
                    content: '清理缓存不会影响您的收藏和设置，确定要继续吗？',
                    success: function (res) { return __awaiter(_this, void 0, void 0, function () {
                        var error_14;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!res.confirm) return [3 /*break*/, 5];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 4, , 5]);
                                    return [4 /*yield*/, dataManager_1.dataManager.clearCache()];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, this.calculateCacheSize()];
                                case 3:
                                    _a.sent();
                                    wx.showToast({
                                        title: '缓存已清理',
                                        icon: 'success',
                                        duration: 2000
                                    });
                                    logger_1.LoggerService.info('Cache cleared successfully');
                                    return [3 /*break*/, 5];
                                case 4:
                                    error_14 = _a.sent();
                                    logger_1.LoggerService.error('Failed to clear cache:', error_14);
                                    wx.showToast({
                                        title: '清理失败',
                                        icon: 'none',
                                        duration: 2000
                                    });
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); }
                });
                return [2 /*return*/];
            });
        });
    },
    // 显示缓存详情
    showCacheDetails: function () {
        wx.showModal({
            title: '缓存详情',
            content: "\u5F53\u524D\u7F13\u5B58\u5927\u5C0F: " + this.data.cacheSize + "\n\n\u7F13\u5B58\u5305\u542B\uFF1A\n\u2022 \u5DE5\u5177\u4F7F\u7528\u8BB0\u5F55\n\u2022 \u6536\u85CF\u5217\u8868\n\u2022 \u4E2A\u4EBA\u8BBE\u7F6E\n\u2022 \u4E34\u65F6\u6570\u636E",
            showCancel: false,
            confirmText: '知道了'
        });
    },
    // 意见反馈
    onFeedback: function () {
        wx.showModal({
            title: '意见反馈',
            content: '如有问题或建议，请通过以下方式联系我们：\n\n邮箱：feedback@dailytools.com\n微信群：扫码加入用户群',
            showCancel: false,
            confirmText: '知道了'
        });
    },
    // 关于我们
    onAbout: function () {
        wx.showModal({
            title: '关于 Dailytools',
            content: 'Dailytools v1.0.0\n\n一个简单实用的工具集合小程序\n\n© 2024 Dailytools Team',
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
    },
    // 分享给朋友
    onShareAppMessage: function () {
        return {
            title: 'Dailytools - 实用工具集合',
            path: '/pages/index/index',
            imageUrl: '/images/share-cover.jpg'
        };
    },
    // 分享到朋友圈
    onShareTimeline: function () {
        return {
            title: 'Dailytools - 实用工具集合',
            imageUrl: '/images/share-cover.jpg'
        };
    },
    // 显示存储使用情况
    showStorageUsage: function () {
        return __awaiter(this, void 0, void 0, function () {
            var storageUsage, usagePercentage, detailText, _i, _a, _b, category, size, sizeKB, error_15;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        wx.showLoading({ title: '获取存储信息...' });
                        return [4 /*yield*/, userDataStorage_1.userDataStorage.getStorageUsage()];
                    case 1:
                        storageUsage = _c.sent();
                        usagePercentage = ((storageUsage.used / storageUsage.total) * 100).toFixed(2);
                        detailText = "\u603B\u5BB9\u91CF: " + (storageUsage.total / 1024 / 1024).toFixed(2) + " MB\n";
                        detailText += "\u5DF2\u4F7F\u7528: " + (storageUsage.used / 1024).toFixed(2) + " KB\n";
                        detailText += "\u4F7F\u7528\u7387: " + usagePercentage + "%\n\n";
                        detailText += "\u5404\u7C7B\u6570\u636E\u5360\u7528:\n";
                        for (_i = 0, _a = Object.entries(storageUsage.byCategory); _i < _a.length; _i++) {
                            _b = _a[_i], category = _b[0], size = _b[1];
                            sizeKB = (size / 1024).toFixed(2);
                            detailText += category + ": " + sizeKB + " KB\n";
                        }
                        wx.hideLoading();
                        wx.showModal({
                            title: '存储使用情况',
                            content: detailText,
                            showCancel: false,
                            confirmText: '确定'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_15 = _c.sent();
                        wx.hideLoading();
                        logger_1.LoggerService.error('获取存储使用情况失败:', error_15);
                        wx.showToast({
                            title: '获取失败',
                            icon: 'error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // 管理用户偏好设置
    manageUserPreferences: function () {
        return __awaiter(this, void 0, void 0, function () {
            var preferences_1, options, error_16;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, userDataStorage_1.userDataStorage.getUserPreferences()];
                    case 1:
                        preferences_1 = _a.sent();
                        options = ['主题设置', '语言设置', '通知设置', '隐私设置'];
                        wx.showActionSheet({
                            itemList: options,
                            success: function (res) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (res.tapIndex) {
                                        case 0: // 主题设置
                                            this.showUserThemeSettings(preferences_1);
                                            break;
                                        case 1: // 语言设置
                                            this.showUserLanguageSettings(preferences_1);
                                            break;
                                        case 2: // 通知设置
                                            this.showUserNotificationSettings(preferences_1);
                                            break;
                                        case 3: // 隐私设置
                                            this.showUserPrivacySettings(preferences_1);
                                            break;
                                    }
                                    return [2 /*return*/];
                                });
                            }); }
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_16 = _a.sent();
                        logger_1.LoggerService.error('获取用户偏好设置失败:', error_16);
                        wx.showToast({
                            title: '获取设置失败',
                            icon: 'error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // 用户主题设置
    showUserThemeSettings: function (preferences) {
        var _this = this;
        var themes = ['自动', '浅色', '深色'];
        wx.showActionSheet({
            itemList: themes,
            success: function (res) { return __awaiter(_this, void 0, void 0, function () {
                var newTheme;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            newTheme = ['auto', 'light', 'dark'][res.tapIndex];
                            return [4 /*yield*/, userDataStorage_1.userDataStorage.updateUserPreferences({
                                    theme: newTheme
                                })];
                        case 1:
                            _a.sent();
                            wx.showToast({
                                title: '主题已更新',
                                icon: 'success'
                            });
                            return [2 /*return*/];
                    }
                });
            }); }
        });
    },
    // 用户语言设置
    showUserLanguageSettings: function (preferences) {
        var _this = this;
        var languages = ['简体中文', 'English'];
        wx.showActionSheet({
            itemList: languages,
            success: function (res) { return __awaiter(_this, void 0, void 0, function () {
                var newLanguage;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            newLanguage = ['zh-CN', 'en-US'][res.tapIndex];
                            return [4 /*yield*/, userDataStorage_1.userDataStorage.updateUserPreferences({
                                    language: newLanguage
                                })];
                        case 1:
                            _a.sent();
                            wx.showToast({
                                title: '语言已更新',
                                icon: 'success'
                            });
                            return [2 /*return*/];
                    }
                });
            }); }
        });
    },
    // 用户通知设置
    showUserNotificationSettings: function (preferences) {
        var _this = this;
        var notifications = preferences.notifications;
        var options = [
            "\u901A\u77E5\u603B\u5F00\u5173: " + (notifications.enabled ? '开启' : '关闭'),
            "\u6BCF\u65E5\u63D0\u9192: " + (notifications.dailyReminder ? '开启' : '关闭'),
            "\u66F4\u65B0\u901A\u77E5: " + (notifications.updateNotice ? '开启' : '关闭')
        ];
        wx.showActionSheet({
            itemList: options,
            success: function (res) { return __awaiter(_this, void 0, void 0, function () {
                var keys, key;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            keys = ['enabled', 'dailyReminder', 'updateNotice'];
                            key = keys[res.tapIndex];
                            return [4 /*yield*/, userDataStorage_1.userDataStorage.updateUserPreferences({
                                    notifications: __assign(__assign({}, notifications), (_a = {}, _a[key] = !notifications[key], _a))
                                })];
                        case 1:
                            _b.sent();
                            wx.showToast({
                                title: '设置已更新',
                                icon: 'success'
                            });
                            return [2 /*return*/];
                    }
                });
            }); }
        });
    },
    // 用户隐私设置
    showUserPrivacySettings: function (preferences) {
        var _this = this;
        var privacy = preferences.privacy;
        var options = [
            "\u6570\u636E\u6536\u96C6: " + (privacy.dataCollection ? '允许' : '禁止'),
            "\u4F7F\u7528\u5206\u6790: " + (privacy.usageAnalytics ? '允许' : '禁止'),
            "\u6570\u636E\u5171\u4EAB: " + (privacy.shareUsageData ? '允许' : '禁止')
        ];
        wx.showActionSheet({
            itemList: options,
            success: function (res) { return __awaiter(_this, void 0, void 0, function () {
                var keys, key;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            keys = ['dataCollection', 'usageAnalytics', 'shareUsageData'];
                            key = keys[res.tapIndex];
                            return [4 /*yield*/, userDataStorage_1.userDataStorage.updateUserPreferences({
                                    privacy: __assign(__assign({}, privacy), (_a = {}, _a[key] = !privacy[key], _a))
                                })];
                        case 1:
                            _b.sent();
                            wx.showToast({
                                title: '隐私设置已更新',
                                icon: 'success'
                            });
                            return [2 /*return*/];
                    }
                });
            }); }
        });
    }
});
