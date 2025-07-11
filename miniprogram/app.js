"use strict";
// app.ts
// import { dataManager } from './utils/dataManager'
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
// 应用配置
var APP_CONFIG = {
    version: '1.0.0',
    name: 'Dailytools',
    description: '日常工具集合',
    maxRecentTools: 10,
    maxFavoriteTools: 20
};
App({
    globalData: {
        version: APP_CONFIG.version,
        theme: 'light',
        recentTools: [],
        favoriteTools: [],
        systemInfo: undefined,
        userInfo: undefined
    },
    onLaunch: function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var DataManager, dataManager, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('应用启动', options);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        DataManager = require('./utils/dataManager').DataManager;
                        dataManager = DataManager.getInstance();
                        // 初始化数据管理器
                        return [4 /*yield*/, dataManager.init()
                            // 获取系统信息
                        ];
                    case 2:
                        // 初始化数据管理器
                        _a.sent();
                        // 获取系统信息
                        this.getSystemInfo();
                        // 加载用户数据
                        return [4 /*yield*/, this.loadUserData()
                            // 检查授权状态
                        ];
                    case 3:
                        // 加载用户数据
                        _a.sent();
                        // 检查授权状态
                        return [4 /*yield*/, this.checkAuthStatus()];
                    case 4:
                        // 检查授权状态
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        console.error('应用启动失败:', error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
    onShow: function (options) {
        console.log('应用显示', options);
    },
    onHide: function () {
        console.log('应用隐藏');
        // 数据管理器会自动处理数据保存
    },
    onError: function (error) {
        console.error('应用错误', error);
    },
    /**
     * 获取系统信息
     */
    getSystemInfo: function () {
        try {
            var systemInfo = wx.getSystemInfoSync();
            // 存储系统信息到全局数据
            this.globalData.systemInfo = systemInfo;
            // 根据系统主题设置应用主题
            if (systemInfo.theme) {
                this.globalData.theme = systemInfo.theme;
            }
            console.log('系统信息获取成功', systemInfo);
        }
        catch (error) {
            console.error('获取系统信息失败', error);
        }
    },
    /**
     * 检查授权状态
     */
    checkAuthStatus: function () {
        return __awaiter(this, void 0, void 0, function () {
            var AuthManager, authManager, isLoggedIn, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        AuthManager = require('./utils/authManager').AuthManager;
                        authManager = AuthManager.getInstance();
                        return [4 /*yield*/, authManager.isLoggedIn()];
                    case 1:
                        isLoggedIn = _a.sent();
                        if (!isLoggedIn) {
                            console.log('用户未登录，跳转到授权页面');
                            // 跳转到授权页面
                            wx.redirectTo({
                                url: '/pages/auth/auth'
                            });
                        }
                        else {
                            console.log('用户已登录');
                            // 检查登录状态是否有效
                            this.checkLoginStatus();
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error('检查授权状态失败:', error_2);
                        // 出错时也跳转到授权页面
                        wx.redirectTo({
                            url: '/pages/auth/auth'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 检查登录状态
     */
    checkLoginStatus: function () {
        var _this = this;
        wx.checkSession({
            success: function () {
                console.log('登录状态有效');
            },
            fail: function () {
                console.log('登录状态失效，重新登录');
                _this.doLogin();
            }
        });
    },
    /**
     * 执行登录
     */
    doLogin: function () {
        wx.login({
            success: function (res) {
                if (res.code) {
                    console.log('登录成功', res.code);
                    // 这里可以发送 res.code 到后台换取 openId, sessionKey, unionId
                }
                else {
                    console.error('登录失败', res.errMsg);
                }
            },
            fail: function (error) {
                console.error('登录失败', error);
            }
        });
    },
    /**
     * 加载用户数据
     */
    loadUserData: function () {
        return __awaiter(this, void 0, void 0, function () {
            var DataManager, dataManager, recentTools, favoriteTools, settings, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        DataManager = require('./utils/dataManager').DataManager;
                        dataManager = DataManager.getInstance();
                        return [4 /*yield*/, dataManager.getRecentTools()];
                    case 1:
                        recentTools = _a.sent();
                        return [4 /*yield*/, dataManager.getFavoriteTools()];
                    case 2:
                        favoriteTools = _a.sent();
                        return [4 /*yield*/, dataManager.getUserSettings()];
                    case 3:
                        settings = _a.sent();
                        this.globalData.recentTools = recentTools;
                        this.globalData.favoriteTools = favoriteTools;
                        this.globalData.theme = (settings && settings.theme === 'dark') ? 'dark' : 'light';
                        console.log('用户数据加载成功');
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        console.error('用户数据加载失败', error_3);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 添加最近使用工具
     */
    addRecentTool: function (toolId) {
        return __awaiter(this, void 0, void 0, function () {
            var DataManager, dataManager, _a, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        DataManager = require('./utils/dataManager').DataManager;
                        dataManager = DataManager.getInstance();
                        return [4 /*yield*/, dataManager.addRecentTool(toolId)
                            // 更新全局数据
                        ];
                    case 1:
                        _b.sent();
                        // 更新全局数据
                        _a = this.globalData;
                        return [4 /*yield*/, dataManager.getRecentTools()];
                    case 2:
                        // 更新全局数据
                        _a.recentTools = _b.sent();
                        console.log('添加最近使用工具', { toolId: toolId });
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _b.sent();
                        console.error('添加最近使用工具失败:', error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 切换收藏工具
     */
    toggleFavoriteTool: function (toolId) {
        return __awaiter(this, void 0, void 0, function () {
            var DataManager, dataManager, result, _a, action, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        DataManager = require('./utils/dataManager').DataManager;
                        dataManager = DataManager.getInstance();
                        return [4 /*yield*/, dataManager.toggleFavorite(toolId)];
                    case 1:
                        result = _b.sent();
                        if (!result.success) return [3 /*break*/, 3];
                        // 更新全局数据
                        _a = this.globalData;
                        return [4 /*yield*/, dataManager.getFavoriteTools()];
                    case 2:
                        // 更新全局数据
                        _a.favoriteTools = _b.sent();
                        action = result.isFavorite ? '收藏' : '取消收藏';
                        console.log(action + "\u5DE5\u5177", { toolId: toolId });
                        wx.showToast({
                            title: action + "\u6210\u529F",
                            icon: 'success'
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        if (result.message) {
                            wx.showToast({
                                title: result.message,
                                icon: 'none'
                            });
                        }
                        _b.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_5 = _b.sent();
                        console.error('切换收藏状态失败:', error_5);
                        wx.showToast({
                            title: '操作失败',
                            icon: 'none'
                        });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
});
