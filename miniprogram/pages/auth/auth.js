"use strict";
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
// pages/auth/auth.ts
var authManager_1 = require("../../utils/authManager");
var logger_1 = require("../../utils/logger");
Page({
    data: {
        isLoading: false,
        errorMessage: '',
        canRetry: false,
        showDebugInfo: false,
        debugInfo: ''
    },
    /**
     * 页面加载时的处理
     */
    onLoad: function () {
        logger_1.LoggerService.info('授权页面加载');
        this.checkAuthStatus();
    },
    /**
     * 页面显示时的处理
     */
    onShow: function () {
        // 每次显示页面时都检查授权状态
        this.checkAuthStatus();
    },
    /**
     * 检查授权状态
     */
    checkAuthStatus: function () {
        return __awaiter(this, void 0, void 0, function () {
            var authManager, authStatus, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        authManager = authManager_1.AuthManager.getInstance();
                        // 如果已经登录，直接跳转到首页
                        if (authManager.isLoggedIn()) {
                            logger_1.LoggerService.info('用户已登录，跳转到首页');
                            wx.reLaunch({
                                url: '/pages/index/index'
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, authManager.checkAuthStatus()];
                    case 1:
                        authStatus = _a.sent();
                        if (authStatus.hasUserInfo) {
                            // 已有授权，尝试自动登录
                            this.performAutoLogin();
                        }
                        else {
                            // 没有授权，显示授权界面
                            logger_1.LoggerService.info('未检测到授权，显示授权界面');
                            this.setData({
                                debugInfo: "\u5FAE\u4FE1\u7248\u672C\u652F\u6301getUserProfile: " + authStatus.canIUse + "\n\u6388\u6743\u72B6\u6001: " + (authStatus.hasUserInfo ? '已授权' : '未授权')
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        logger_1.LoggerService.error('检查授权状态失败:', error_1);
                        this.setData({
                            errorMessage: '检查授权状态失败，请重试',
                            canRetry: true,
                            debugInfo: "\u9519\u8BEF\u4FE1\u606F: " + error_1
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 自动登录
     */
    performAutoLogin: function () {
        return __awaiter(this, void 0, void 0, function () {
            var authManager, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setData({ isLoading: true });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        authManager = authManager_1.AuthManager.getInstance();
                        return [4 /*yield*/, authManager.login()];
                    case 2:
                        result = _a.sent();
                        if (result.success) {
                            logger_1.LoggerService.info('自动登录成功');
                            wx.showToast({
                                title: '登录成功',
                                icon: 'success',
                                duration: 1500
                            });
                            // 延迟跳转，让用户看到成功提示
                            setTimeout(function () {
                                wx.reLaunch({
                                    url: '/pages/index/index'
                                });
                            }, 1500);
                        }
                        else {
                            throw new Error(result.error || '自动登录失败');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        logger_1.LoggerService.error('自动登录失败:', error_2);
                        this.setData({
                            isLoading: false,
                            errorMessage: '自动登录失败，请手动授权',
                            canRetry: true,
                            debugInfo: this.data.debugInfo + ("\n\u81EA\u52A8\u767B\u5F55\u5931\u8D25: " + error_2)
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 测试授权弹框
     */
    onTestAuthorize: function () {
        var _this = this;
        console.log('测试授权弹框被点击');
        logger_1.LoggerService.info('用户点击测试授权按钮');
        // 检查是否支持 getUserProfile
        if (!wx.canIUse('getUserProfile')) {
            wx.showToast({
                title: '当前微信版本不支持获取用户信息',
                icon: 'none',
                duration: 2000
            });
            this.setData({
                debugInfo: this.data.debugInfo + '\n错误: 当前微信版本不支持getUserProfile'
            });
            return;
        }
        // 直接调用 wx.getUserProfile 测试授权弹框
        wx.getUserProfile({
            desc: '用于测试授权弹框功能',
            success: function (res) {
                console.log('测试授权成功:', res);
                logger_1.LoggerService.info('测试授权成功:', res.userInfo);
                var userInfo = res.userInfo;
                wx.showModal({
                    title: '授权成功',
                    content: "\u83B7\u53D6\u5230\u7528\u6237\u4FE1\u606F\uFF1A\n\u6635\u79F0: " + userInfo.nickName + "\n\u6027\u522B: " + (userInfo.gender === 1 ? '男' : userInfo.gender === 2 ? '女' : '未知') + "\n\u57CE\u5E02: " + (userInfo.city || '未知'),
                    showCancel: false,
                    confirmText: '确定'
                });
                _this.setData({
                    debugInfo: _this.data.debugInfo + ("\n\u6D4B\u8BD5\u6388\u6743\u6210\u529F: " + userInfo.nickName)
                });
            },
            fail: function (error) {
                console.log('测试授权失败:', error);
                logger_1.LoggerService.warn('测试授权失败:', error);
                wx.showModal({
                    title: '授权失败',
                    content: "\u9519\u8BEF\u4FE1\u606F\uFF1A" + (error.errMsg || '未知错误'),
                    showCancel: false,
                    confirmText: '确定'
                });
                _this.setData({
                    debugInfo: _this.data.debugInfo + ("\n\u6D4B\u8BD5\u6388\u6743\u5931\u8D25: " + error.errMsg)
                });
            }
        });
    },
    /**
     * 用户点击授权按钮
     */
    onAuthorize: function () {
        return __awaiter(this, void 0, void 0, function () {
            var authManager, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setData({
                            isLoading: true,
                            errorMessage: '',
                            canRetry: false
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        logger_1.LoggerService.info('用户点击授权按钮');
                        // 检查是否支持 getUserProfile
                        if (!wx.canIUse('getUserProfile')) {
                            throw new Error('当前微信版本不支持 getUserProfile');
                        }
                        authManager = authManager_1.AuthManager.getInstance();
                        return [4 /*yield*/, authManager.login()];
                    case 2:
                        result = _a.sent();
                        if (result.success && result.userInfo) {
                            logger_1.LoggerService.info('用户授权登录成功', result.userInfo);
                            wx.showToast({
                                title: '授权成功',
                                icon: 'success',
                                duration: 1500
                            });
                            // 延迟跳转到个人中心页面展示用户信息
                            setTimeout(function () {
                                wx.reLaunch({
                                    url: '/pages/profile/profile'
                                });
                            }, 1500);
                        }
                        else {
                            throw new Error(result.error || '授权失败');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        logger_1.LoggerService.error('用户授权失败:', error_3);
                        this.setData({
                            isLoading: false,
                            errorMessage: error_3 instanceof Error ? error_3.message : '授权失败，请重试',
                            canRetry: true,
                            debugInfo: this.data.debugInfo + ("\n\u6388\u6743\u5931\u8D25: " + error_3)
                        });
                        wx.showToast({
                            title: '授权失败',
                            icon: 'none',
                            duration: 2000
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 重试授权
     */
    onRetry: function () {
        this.setData({
            errorMessage: '',
            canRetry: false
        });
        this.checkAuthStatus();
    },
    /**
     * 跳过登录
     */
    onSkipLogin: function () {
        wx.showModal({
            title: '确认跳过',
            content: '跳过登录将无法使用个人数据同步功能，确定要跳过吗？',
            success: function (res) {
                if (res.confirm) {
                    logger_1.LoggerService.info('用户选择跳过登录');
                    wx.reLaunch({
                        url: '/pages/index/index'
                    });
                }
            }
        });
    },
    /**
     * 显示调试信息
     */
    showDebugInfo: function () {
        this.setData({
            showDebugInfo: !this.data.showDebugInfo
        });
    },
    /**
     * 分享功能
     */
    onShareAppMessage: function () {
        return {
            title: 'Dailytools - 实用工具集合',
            path: '/pages/index/index'
        };
    },
    /**
     * 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: 'Dailytools - 实用工具集合'
        };
    }
});
