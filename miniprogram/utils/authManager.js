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
exports.authManager = exports.AuthManager = void 0;
// 微信授权管理器
var storage_1 = require("./storage");
var logger_1 = require("./logger");
var userInfoProcessor_1 = require("./userInfoProcessor");
var userDataStorage_1 = require("./userDataStorage");
var AuthManager = /** @class */ (function () {
    function AuthManager() {
        this.STORAGE_KEY = 'user_login_state';
        this.LOGIN_EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000; // 7天过期
    }
    AuthManager.getInstance = function () {
        if (!AuthManager.instance) {
            AuthManager.instance = new AuthManager();
        }
        return AuthManager.instance;
    };
    /**
     * 检查用户是否已登录
     */
    AuthManager.prototype.isLoggedIn = function () {
        try {
            var loginState = this.getLoginState();
            if (!loginState)
                return false;
            // 检查是否过期
            if (Date.now() > loginState.expireTime) {
                this.logout();
                return false;
            }
            return loginState.isLoggedIn && !!loginState.userInfo;
        }
        catch (error) {
            logger_1.LoggerService.error('检查登录状态失败:', error);
            return false;
        }
    };
    /**
     * 获取当前用户信息
     */
    AuthManager.prototype.getUserInfo = function () {
        try {
            var loginState = this.getLoginState();
            if (!loginState || !this.isLoggedIn()) {
                return null;
            }
            return loginState.userInfo;
        }
        catch (error) {
            logger_1.LoggerService.error('获取用户信息失败:', error);
            return null;
        }
    };
    /**
     * 获取登录状态详情（公共方法）
     */
    AuthManager.prototype.getLoginStateInfo = function () {
        return this.getLoginState();
    };
    /**
     * 微信授权登录
     */
    AuthManager.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var existingAuth, rawUserInfo, processedUserInfo, loginState, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        logger_1.LoggerService.info('开始微信授权登录');
                        return [4 /*yield*/, this.checkExistingAuth()];
                    case 1:
                        existingAuth = _a.sent();
                        if (existingAuth.success) {
                            return [2 /*return*/, existingAuth];
                        }
                        return [4 /*yield*/, this.requestUserProfile()];
                    case 2:
                        rawUserInfo = _a.sent();
                        if (!rawUserInfo) {
                            return [2 /*return*/, {
                                    success: false,
                                    error: '用户取消授权'
                                }];
                        }
                        return [4 /*yield*/, userInfoProcessor_1.userInfoProcessor.processUserInfo(rawUserInfo)];
                    case 3:
                        processedUserInfo = _a.sent();
                        loginState = {
                            isLoggedIn: true,
                            userInfo: processedUserInfo,
                            loginTime: Date.now(),
                            expireTime: Date.now() + this.LOGIN_EXPIRE_TIME
                        };
                        return [4 /*yield*/, userDataStorage_1.userDataStorage.saveLoginState(loginState)];
                    case 4:
                        _a.sent();
                        logger_1.LoggerService.info('微信授权登录成功:', processedUserInfo);
                        return [2 /*return*/, {
                                success: true,
                                userInfo: processedUserInfo
                            }];
                    case 5:
                        error_1 = _a.sent();
                        logger_1.LoggerService.error('微信授权登录失败:', error_1);
                        return [2 /*return*/, {
                                success: false,
                                error: error_1 instanceof Error ? error_1.message : '登录失败'
                            }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 检查已有授权（注意：不再检查scope.userInfo，因为getUserProfile每次都需要用户主动触发）
     */
    AuthManager.prototype.checkExistingAuth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        // 检查本地是否有有效的登录状态
                        var loginState = _this.getLoginState();
                        if (loginState && loginState.isLoggedIn && loginState.userInfo && loginState.expireTime > Date.now()) {
                            logger_1.LoggerService.info('使用本地登录状态');
                            resolve({
                                success: true,
                                userInfo: loginState.userInfo
                            });
                        }
                        else {
                            // 没有有效的本地登录状态，需要重新授权
                            resolve({ success: false, error: '需要重新授权' });
                        }
                    })];
            });
        });
    };
    /**
     * 请求用户信息授权
     */
    AuthManager.prototype.requestUserProfile = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        console.log('AuthManager: 开始调用 wx.getUserProfile...');
                        // 检查是否支持 getUserProfile
                        if (!wx.canIUse('getUserProfile')) {
                            console.error('当前微信版本不支持 getUserProfile');
                            logger_1.LoggerService.error('当前微信版本不支持 getUserProfile');
                            resolve(null);
                            return;
                        }
                        wx.getUserProfile({
                            desc: '用于完善用户资料',
                            success: function (res) {
                                console.log('AuthManager: wx.getUserProfile 调用成功:', res);
                                logger_1.LoggerService.info('获取用户信息成功:', res.userInfo);
                                resolve(res.userInfo);
                            },
                            fail: function (error) {
                                console.log('AuthManager: wx.getUserProfile 调用失败:', error);
                                logger_1.LoggerService.warn('用户拒绝授权:', error);
                                resolve(null);
                            }
                        });
                    })];
            });
        });
    };
    /**
     * 退出登录
     */
    AuthManager.prototype.logout = function () {
        try {
            storage_1.StorageService.remove(this.STORAGE_KEY);
            logger_1.LoggerService.info('用户退出登录');
        }
        catch (error) {
            logger_1.LoggerService.error('退出登录失败:', error);
        }
    };
    /**
     * 刷新登录状态（延长过期时间）
     */
    AuthManager.prototype.refreshLoginState = function () {
        try {
            var loginState = this.getLoginState();
            if (loginState && loginState.isLoggedIn) {
                loginState.expireTime = Date.now() + this.LOGIN_EXPIRE_TIME;
                this.saveLoginState(loginState);
                logger_1.LoggerService.info('登录状态已刷新');
            }
        }
        catch (error) {
            logger_1.LoggerService.error('刷新登录状态失败:', error);
        }
    };
    /**
     * 检查授权状态
     */
    AuthManager.prototype.checkAuthStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        // 检查本地是否有有效的用户信息
                        var loginState = _this.getLoginState();
                        var hasValidUserInfo = !!(loginState && loginState.isLoggedIn && loginState.userInfo && loginState.expireTime > Date.now());
                        resolve({
                            hasUserInfo: hasValidUserInfo,
                            canIUse: wx.canIUse('getUserProfile')
                        });
                    })];
            });
        });
    };
    /**
     * 获取登录状态（私有方法）
     */
    AuthManager.prototype.getLoginState = function () {
        try {
            return storage_1.StorageService.get(this.STORAGE_KEY);
        }
        catch (error) {
            logger_1.LoggerService.error('获取登录状态失败:', error);
            return null;
        }
    };
    /**
     * 保存登录状态
     */
    AuthManager.prototype.saveLoginState = function (loginState) {
        try {
            storage_1.StorageService.set(this.STORAGE_KEY, loginState);
        }
        catch (error) {
            logger_1.LoggerService.error('保存登录状态失败:', error);
        }
    };
    return AuthManager;
}());
exports.AuthManager = AuthManager;
// 导出单例实例
exports.authManager = AuthManager.getInstance();
