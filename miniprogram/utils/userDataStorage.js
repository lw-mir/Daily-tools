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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDataStorage = exports.UserDataStorage = void 0;
// 用户数据存储管理器
var storage_1 = require("./storage");
var logger_1 = require("./logger");
/**
 * 用户数据存储管理器
 * 专门处理用户相关的数据存储、同步、备份等功能
 */
var UserDataStorage = /** @class */ (function () {
    function UserDataStorage() {
    }
    UserDataStorage.getInstance = function () {
        if (!UserDataStorage.instance) {
            UserDataStorage.instance = new UserDataStorage();
        }
        return UserDataStorage.instance;
    };
    // ==================== 登录状态管理 ====================
    /**
     * 保存用户登录状态
     */
    UserDataStorage.prototype.saveLoginState = function (loginState) {
        return __awaiter(this, void 0, void 0, function () {
            var success, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, storage_1.StorageService.setAsync(UserDataStorage.KEYS.LOGIN_STATE, __assign(__assign({}, loginState), { savedAt: Date.now(), version: UserDataStorage.DATA_VERSION }))];
                    case 1:
                        success = _a.sent();
                        if (!success) return [3 /*break*/, 3];
                        logger_1.LoggerService.info('用户登录状态保存成功');
                        return [4 /*yield*/, this.updateSyncStatus(['login_state'])];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, success];
                    case 4:
                        error_1 = _a.sent();
                        logger_1.LoggerService.error('保存用户登录状态失败:', error_1);
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 获取用户登录状态
     */
    UserDataStorage.prototype.getLoginState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, now, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, storage_1.StorageService.getAsync(UserDataStorage.KEYS.LOGIN_STATE)];
                    case 1:
                        data = _a.sent();
                        if (!data) {
                            return [2 /*return*/, null];
                        }
                        now = Date.now();
                        if (!(data.expireTime && data.expireTime < now)) return [3 /*break*/, 3];
                        logger_1.LoggerService.info('用户登录状态已过期');
                        return [4 /*yield*/, this.clearLoginState()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/, data];
                    case 4:
                        error_2 = _a.sent();
                        logger_1.LoggerService.error('获取用户登录状态失败:', error_2);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 清除用户登录状态
     */
    UserDataStorage.prototype.clearLoginState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var success, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        success = storage_1.StorageService.remove(UserDataStorage.KEYS.LOGIN_STATE);
                        if (!success) return [3 /*break*/, 2];
                        logger_1.LoggerService.info('用户登录状态已清除');
                        return [4 /*yield*/, this.updateSyncStatus(['login_state'])];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, success];
                    case 3:
                        error_3 = _a.sent();
                        logger_1.LoggerService.error('清除用户登录状态失败:', error_3);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 更新用户信息
     */
    UserDataStorage.prototype.updateUserInfo = function (userInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var loginState, updatedLoginState, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getLoginState()];
                    case 1:
                        loginState = _a.sent();
                        if (!loginState) {
                            logger_1.LoggerService.warn('用户未登录，无法更新用户信息');
                            return [2 /*return*/, false];
                        }
                        updatedLoginState = __assign(__assign({}, loginState), { userInfo: __assign(__assign({}, userInfo), { processedAt: Date.now() }) });
                        return [4 /*yield*/, this.saveLoginState(updatedLoginState)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_4 = _a.sent();
                        logger_1.LoggerService.error('更新用户信息失败:', error_4);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // ==================== 用户偏好设置管理 ====================
    /**
     * 保存用户偏好设置
     */
    UserDataStorage.prototype.saveUserPreferences = function (preferences) {
        return __awaiter(this, void 0, void 0, function () {
            var success, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, storage_1.StorageService.setAsync(UserDataStorage.KEYS.PREFERENCES, __assign(__assign({}, preferences), { updatedAt: Date.now(), version: UserDataStorage.DATA_VERSION }))];
                    case 1:
                        success = _a.sent();
                        if (!success) return [3 /*break*/, 3];
                        logger_1.LoggerService.info('用户偏好设置保存成功');
                        return [4 /*yield*/, this.updateSyncStatus(['preferences'])];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, success];
                    case 4:
                        error_5 = _a.sent();
                        logger_1.LoggerService.error('保存用户偏好设置失败:', error_5);
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 获取用户偏好设置
     */
    UserDataStorage.prototype.getUserPreferences = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, mergedPreferences, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, storage_1.StorageService.getAsync(UserDataStorage.KEYS.PREFERENCES)];
                    case 1:
                        data = _a.sent();
                        if (!!data) return [3 /*break*/, 3];
                        // 返回默认设置并保存
                        return [4 /*yield*/, this.saveUserPreferences(UserDataStorage.DEFAULT_PREFERENCES)];
                    case 2:
                        // 返回默认设置并保存
                        _a.sent();
                        return [2 /*return*/, UserDataStorage.DEFAULT_PREFERENCES];
                    case 3:
                        mergedPreferences = this.mergeWithDefaults(data, UserDataStorage.DEFAULT_PREFERENCES);
                        return [2 /*return*/, mergedPreferences];
                    case 4:
                        error_6 = _a.sent();
                        logger_1.LoggerService.error('获取用户偏好设置失败:', error_6);
                        return [2 /*return*/, UserDataStorage.DEFAULT_PREFERENCES];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 更新部分用户偏好设置
     */
    UserDataStorage.prototype.updateUserPreferences = function (updates) {
        return __awaiter(this, void 0, void 0, function () {
            var currentPreferences, updatedPreferences, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getUserPreferences()];
                    case 1:
                        currentPreferences = _a.sent();
                        updatedPreferences = this.deepMerge(currentPreferences, updates);
                        return [4 /*yield*/, this.saveUserPreferences(updatedPreferences)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_7 = _a.sent();
                        logger_1.LoggerService.error('更新用户偏好设置失败:', error_7);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // ==================== 用户活动数据管理 ====================
    /**
     * 保存用户活动数据
     */
    UserDataStorage.prototype.saveUserActivityData = function (activityData) {
        return __awaiter(this, void 0, void 0, function () {
            var success, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, storage_1.StorageService.setAsync(UserDataStorage.KEYS.ACTIVITY_DATA, __assign(__assign({}, activityData), { updatedAt: Date.now(), version: UserDataStorage.DATA_VERSION }))];
                    case 1:
                        success = _a.sent();
                        if (!success) return [3 /*break*/, 3];
                        logger_1.LoggerService.info('用户活动数据保存成功');
                        return [4 /*yield*/, this.updateSyncStatus(['activity_data'])];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, success];
                    case 4:
                        error_8 = _a.sent();
                        logger_1.LoggerService.error('保存用户活动数据失败:', error_8);
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 获取用户活动数据
     */
    UserDataStorage.prototype.getUserActivityData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, storage_1.StorageService.getAsync(UserDataStorage.KEYS.ACTIVITY_DATA)];
                    case 1:
                        data = _a.sent();
                        if (!!data) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.saveUserActivityData(UserDataStorage.DEFAULT_ACTIVITY_DATA)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, UserDataStorage.DEFAULT_ACTIVITY_DATA];
                    case 3: return [2 /*return*/, data];
                    case 4:
                        error_9 = _a.sent();
                        logger_1.LoggerService.error('获取用户活动数据失败:', error_9);
                        return [2 /*return*/, UserDataStorage.DEFAULT_ACTIVITY_DATA];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 记录用户活动
     */
    UserDataStorage.prototype.recordUserActivity = function (duration) {
        return __awaiter(this, void 0, void 0, function () {
            var activityData, today, now, updatedActivityData, streak, error_10;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getUserActivityData()];
                    case 1:
                        activityData = _b.sent();
                        today = this.getDateString(new Date());
                        now = Date.now();
                        updatedActivityData = __assign(__assign({}, activityData), { totalUsageTime: activityData.totalUsageTime + duration, dailyUsage: __assign(__assign({}, activityData.dailyUsage), (_a = {}, _a[today] = (activityData.dailyUsage[today] || 0) + duration, _a)), sessionCount: activityData.sessionCount + 1, lastActiveTime: now });
                        streak = this.calculateStreak(updatedActivityData.dailyUsage);
                        updatedActivityData.streakDays = streak.current;
                        updatedActivityData.longestStreak = Math.max(streak.longest, updatedActivityData.longestStreak);
                        return [4 /*yield*/, this.saveUserActivityData(updatedActivityData)];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3:
                        error_10 = _b.sent();
                        logger_1.LoggerService.error('记录用户活动失败:', error_10);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // ==================== 用户工具数据管理 ====================
    /**
     * 保存用户工具数据
     */
    UserDataStorage.prototype.saveUserToolData = function (toolData) {
        return __awaiter(this, void 0, void 0, function () {
            var success, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, storage_1.StorageService.setAsync(UserDataStorage.KEYS.TOOL_DATA, __assign(__assign({}, toolData), { updatedAt: Date.now(), version: UserDataStorage.DATA_VERSION }))];
                    case 1:
                        success = _a.sent();
                        if (!success) return [3 /*break*/, 3];
                        logger_1.LoggerService.info('用户工具数据保存成功');
                        return [4 /*yield*/, this.updateSyncStatus(['tool_data'])];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, success];
                    case 4:
                        error_11 = _a.sent();
                        logger_1.LoggerService.error('保存用户工具数据失败:', error_11);
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 获取用户工具数据
     */
    UserDataStorage.prototype.getUserToolData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, storage_1.StorageService.getAsync(UserDataStorage.KEYS.TOOL_DATA)];
                    case 1:
                        data = _a.sent();
                        if (!!data) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.saveUserToolData(UserDataStorage.DEFAULT_TOOL_DATA)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, UserDataStorage.DEFAULT_TOOL_DATA];
                    case 3: return [2 /*return*/, data];
                    case 4:
                        error_12 = _a.sent();
                        logger_1.LoggerService.error('获取用户工具数据失败:', error_12);
                        return [2 /*return*/, UserDataStorage.DEFAULT_TOOL_DATA];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 添加收藏工具
     */
    UserDataStorage.prototype.addFavoriteTool = function (toolId) {
        return __awaiter(this, void 0, void 0, function () {
            var toolData, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getUserToolData()];
                    case 1:
                        toolData = _a.sent();
                        if (!!toolData.favoriteTools.includes(toolId)) return [3 /*break*/, 3];
                        toolData.favoriteTools.push(toolId);
                        // 更新工具统计
                        if (!toolData.toolUsageStats[toolId]) {
                            toolData.toolUsageStats[toolId] = {
                                totalUsage: 0,
                                totalTime: 0,
                                averageTime: 0,
                                lastUsed: 0
                            };
                        }
                        toolData.toolUsageStats[toolId].favoriteAt = Date.now();
                        return [4 /*yield*/, this.saveUserToolData(toolData)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/, true];
                    case 4:
                        error_13 = _a.sent();
                        logger_1.LoggerService.error('添加收藏工具失败:', error_13);
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 移除收藏工具
     */
    UserDataStorage.prototype.removeFavoriteTool = function (toolId) {
        return __awaiter(this, void 0, void 0, function () {
            var toolData, index, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getUserToolData()];
                    case 1:
                        toolData = _a.sent();
                        index = toolData.favoriteTools.indexOf(toolId);
                        if (!(index > -1)) return [3 /*break*/, 3];
                        toolData.favoriteTools.splice(index, 1);
                        // 更新工具统计
                        if (toolData.toolUsageStats[toolId]) {
                            delete toolData.toolUsageStats[toolId].favoriteAt;
                        }
                        return [4 /*yield*/, this.saveUserToolData(toolData)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/, true];
                    case 4:
                        error_14 = _a.sent();
                        logger_1.LoggerService.error('移除收藏工具失败:', error_14);
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 记录工具使用
     */
    UserDataStorage.prototype.recordToolUsage = function (toolId, toolName, duration) {
        return __awaiter(this, void 0, void 0, function () {
            var toolData, now, existingRecentIndex, recentTool, stats, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getUserToolData()];
                    case 1:
                        toolData = _a.sent();
                        now = Date.now();
                        existingRecentIndex = toolData.recentTools.findIndex(function (tool) { return tool.toolId === toolId; });
                        if (existingRecentIndex > -1) {
                            // 更新现有记录
                            toolData.recentTools[existingRecentIndex] = __assign(__assign({}, toolData.recentTools[existingRecentIndex]), { lastUsed: now, usageCount: toolData.recentTools[existingRecentIndex].usageCount + 1 });
                            recentTool = toolData.recentTools.splice(existingRecentIndex, 1)[0];
                            toolData.recentTools.unshift(recentTool);
                        }
                        else {
                            // 添加新记录
                            toolData.recentTools.unshift({
                                toolId: toolId,
                                toolName: toolName,
                                lastUsed: now,
                                usageCount: 1
                            });
                        }
                        // 限制最近使用工具数量
                        if (toolData.recentTools.length > 20) {
                            toolData.recentTools = toolData.recentTools.slice(0, 20);
                        }
                        // 更新工具使用统计
                        if (!toolData.toolUsageStats[toolId]) {
                            toolData.toolUsageStats[toolId] = {
                                totalUsage: 0,
                                totalTime: 0,
                                averageTime: 0,
                                lastUsed: 0
                            };
                        }
                        stats = toolData.toolUsageStats[toolId];
                        stats.totalUsage += 1;
                        stats.lastUsed = now;
                        if (duration) {
                            stats.totalTime += duration;
                            stats.averageTime = stats.totalTime / stats.totalUsage;
                        }
                        return [4 /*yield*/, this.saveUserToolData(toolData)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_15 = _a.sent();
                        logger_1.LoggerService.error('记录工具使用失败:', error_15);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // ==================== 数据备份和恢复 ====================
    /**
     * 创建数据备份
     */
    UserDataStorage.prototype.createDataBackup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loginState, preferences, activityData, toolData, backup, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.getLoginState()];
                    case 1:
                        loginState = _a.sent();
                        return [4 /*yield*/, this.getUserPreferences()];
                    case 2:
                        preferences = _a.sent();
                        return [4 /*yield*/, this.getUserActivityData()];
                    case 3:
                        activityData = _a.sent();
                        return [4 /*yield*/, this.getUserToolData()];
                    case 4:
                        toolData = _a.sent();
                        backup = {
                            version: UserDataStorage.DATA_VERSION,
                            timestamp: Date.now(),
                            userInfo: (loginState === null || loginState === void 0 ? void 0 : loginState.userInfo) || null,
                            preferences: preferences,
                            activityData: activityData,
                            toolData: toolData,
                            checksum: ''
                        };
                        // 生成校验和
                        backup.checksum = this.generateChecksum(backup);
                        // 保存备份
                        return [4 /*yield*/, storage_1.StorageService.setAsync(UserDataStorage.KEYS.BACKUP_DATA, backup)];
                    case 5:
                        // 保存备份
                        _a.sent();
                        logger_1.LoggerService.info('数据备份创建成功');
                        return [2 /*return*/, backup];
                    case 6:
                        error_16 = _a.sent();
                        logger_1.LoggerService.error('创建数据备份失败:', error_16);
                        return [2 /*return*/, null];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 恢复数据备份
     */
    UserDataStorage.prototype.restoreDataBackup = function (backup) {
        return __awaiter(this, void 0, void 0, function () {
            var expectedChecksum, loginState, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        expectedChecksum = this.generateChecksum(__assign(__assign({}, backup), { checksum: '' }));
                        if (backup.checksum !== expectedChecksum) {
                            logger_1.LoggerService.error('备份数据校验失败');
                            return [2 /*return*/, false];
                        }
                        if (!backup.userInfo) return [3 /*break*/, 2];
                        loginState = {
                            isLoggedIn: true,
                            userInfo: backup.userInfo,
                            loginTime: Date.now(),
                            expireTime: Date.now() + UserDataStorage.EXPIRE_TIMES.LOGIN_STATE
                        };
                        return [4 /*yield*/, this.saveLoginState(loginState)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.saveUserPreferences(backup.preferences)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.saveUserActivityData(backup.activityData)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.saveUserToolData(backup.toolData)];
                    case 5:
                        _a.sent();
                        logger_1.LoggerService.info('数据备份恢复成功');
                        return [2 /*return*/, true];
                    case 6:
                        error_17 = _a.sent();
                        logger_1.LoggerService.error('恢复数据备份失败:', error_17);
                        return [2 /*return*/, false];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // ==================== 数据同步管理 ====================
    /**
     * 获取同步状态
     */
    UserDataStorage.prototype.getSyncStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, defaultStatus, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, storage_1.StorageService.getAsync(UserDataStorage.KEYS.SYNC_STATUS)];
                    case 1:
                        data = _a.sent();
                        if (!!data) return [3 /*break*/, 3];
                        defaultStatus = {
                            lastSyncTime: 0,
                            syncVersion: 1,
                            needsSync: false,
                            syncErrors: [],
                            pendingChanges: []
                        };
                        return [4 /*yield*/, storage_1.StorageService.setAsync(UserDataStorage.KEYS.SYNC_STATUS, defaultStatus)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, defaultStatus];
                    case 3: return [2 /*return*/, data];
                    case 4:
                        error_18 = _a.sent();
                        logger_1.LoggerService.error('获取同步状态失败:', error_18);
                        return [2 /*return*/, {
                                lastSyncTime: 0,
                                syncVersion: 1,
                                needsSync: false,
                                syncErrors: [],
                                pendingChanges: []
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 更新同步状态
     */
    UserDataStorage.prototype.updateSyncStatus = function (changedKeys) {
        return __awaiter(this, void 0, void 0, function () {
            var syncStatus, newPendingChanges, updatedStatus, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getSyncStatus()];
                    case 1:
                        syncStatus = _a.sent();
                        newPendingChanges = __spreadArrays(new Set(__spreadArrays(syncStatus.pendingChanges, changedKeys)));
                        updatedStatus = __assign(__assign({}, syncStatus), { needsSync: newPendingChanges.length > 0, pendingChanges: newPendingChanges });
                        return [4 /*yield*/, storage_1.StorageService.setAsync(UserDataStorage.KEYS.SYNC_STATUS, updatedStatus)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        error_19 = _a.sent();
                        logger_1.LoggerService.error('更新同步状态失败:', error_19);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // ==================== 数据清理和维护 ====================
    /**
     * 清理过期数据
     */
    UserDataStorage.prototype.cleanExpiredData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var now, loginState, activityData, ninetyDaysAgo, filteredDailyUsage, _i, _a, _b, date, usage, dateTime, error_20;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 7, , 8]);
                        now = Date.now();
                        return [4 /*yield*/, this.getLoginState()];
                    case 1:
                        loginState = _c.sent();
                        if (!(loginState && loginState.expireTime < now)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.clearLoginState()];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3: return [4 /*yield*/, this.getUserActivityData()];
                    case 4:
                        activityData = _c.sent();
                        ninetyDaysAgo = now - 90 * 24 * 60 * 60 * 1000;
                        filteredDailyUsage = {};
                        for (_i = 0, _a = Object.entries(activityData.dailyUsage); _i < _a.length; _i++) {
                            _b = _a[_i], date = _b[0], usage = _b[1];
                            dateTime = new Date(date).getTime();
                            if (dateTime > ninetyDaysAgo) {
                                filteredDailyUsage[date] = usage;
                            }
                        }
                        if (!(Object.keys(filteredDailyUsage).length !== Object.keys(activityData.dailyUsage).length)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.saveUserActivityData(__assign(__assign({}, activityData), { dailyUsage: filteredDailyUsage }))];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        logger_1.LoggerService.info('过期数据清理完成');
                        return [2 /*return*/, true];
                    case 7:
                        error_20 = _c.sent();
                        logger_1.LoggerService.error('清理过期数据失败:', error_20);
                        return [2 /*return*/, false];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 获取存储使用情况
     */
    UserDataStorage.prototype.getStorageUsage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var storageInfo, byCategory, _i, _a, _b, category, key, data, error_21, error_22;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 7, , 8]);
                        storageInfo = storage_1.StorageService.getInfo();
                        byCategory = {};
                        _i = 0, _a = Object.entries(UserDataStorage.KEYS);
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        _b = _a[_i], category = _b[0], key = _b[1];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, storage_1.StorageService.getAsync(key)];
                    case 3:
                        data = _c.sent();
                        if (data) {
                            byCategory[category] = JSON.stringify(data).length;
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_21 = _c.sent();
                        byCategory[category] = 0;
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, {
                            total: storageInfo.limitSize || 10 * 1024 * 1024,
                            used: storageInfo.currentSize || 0,
                            byCategory: byCategory
                        }];
                    case 7:
                        error_22 = _c.sent();
                        logger_1.LoggerService.error('获取存储使用情况失败:', error_22);
                        return [2 /*return*/, {
                                total: 0,
                                used: 0,
                                byCategory: {}
                            }];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 清空所有用户数据
     */
    UserDataStorage.prototype.clearAllUserData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var clearPromises, error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        clearPromises = Object.values(UserDataStorage.KEYS).map(function (key) {
                            return storage_1.StorageService.remove(key);
                        });
                        return [4 /*yield*/, Promise.all(clearPromises)];
                    case 1:
                        _a.sent();
                        logger_1.LoggerService.info('所有用户数据已清空');
                        return [2 /*return*/, true];
                    case 2:
                        error_23 = _a.sent();
                        logger_1.LoggerService.error('清空用户数据失败:', error_23);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==================== 辅助方法 ====================
    /**
     * 深度合并对象
     */
    UserDataStorage.prototype.deepMerge = function (target, source) {
        var result = __assign({}, target);
        for (var key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(target[key] || {}, source[key]);
            }
            else {
                result[key] = source[key];
            }
        }
        return result;
    };
    /**
     * 合并默认设置
     */
    UserDataStorage.prototype.mergeWithDefaults = function (data, defaults) {
        var result = __assign({}, defaults);
        for (var key in data) {
            if (data[key] && typeof data[key] === 'object' && !Array.isArray(data[key])) {
                result[key] = this.mergeWithDefaults(data[key], defaults[key] || {});
            }
            else {
                result[key] = data[key];
            }
        }
        return result;
    };
    /**
     * 获取日期字符串
     */
    UserDataStorage.prototype.getDateString = function (date) {
        return date.toISOString().split('T')[0];
    };
    /**
     * 计算连续使用天数
     */
    UserDataStorage.prototype.calculateStreak = function (dailyUsage) {
        var dates = Object.keys(dailyUsage).sort();
        var currentStreak = 0;
        var longestStreak = 0;
        var tempStreak = 0;
        var today = this.getDateString(new Date());
        for (var i = dates.length - 1; i >= 0; i--) {
            var date = dates[i];
            var expectedDate = new Date();
            expectedDate.setDate(expectedDate.getDate() - (dates.length - 1 - i));
            if (date === this.getDateString(expectedDate)) {
                tempStreak++;
                if (date === today || i === dates.length - 1) {
                    currentStreak = tempStreak;
                }
            }
            else {
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 0;
            }
        }
        longestStreak = Math.max(longestStreak, tempStreak);
        return { current: currentStreak, longest: longestStreak };
    };
    /**
     * 生成校验和
     */
    UserDataStorage.prototype.generateChecksum = function (data) {
        var str = JSON.stringify(data);
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转换为32位整数
        }
        return Math.abs(hash).toString(16);
    };
    // 存储键名常量
    UserDataStorage.KEYS = {
        LOGIN_STATE: 'user_login_state',
        USER_INFO: 'user_info',
        PREFERENCES: 'user_preferences',
        ACTIVITY_DATA: 'user_activity_data',
        TOOL_DATA: 'user_tool_data',
        BACKUP_DATA: 'user_backup_data',
        SYNC_STATUS: 'user_sync_status',
        ENCRYPTED_DATA: 'user_encrypted_data'
    };
    // 数据版本（用于数据迁移）
    UserDataStorage.DATA_VERSION = '1.0.0';
    // 数据过期时间
    UserDataStorage.EXPIRE_TIMES = {
        LOGIN_STATE: 7 * 24 * 60 * 60 * 1000,
        CACHE_DATA: 24 * 60 * 60 * 1000,
        BACKUP_RETENTION: 30 * 24 * 60 * 60 * 1000,
    };
    // 默认配置
    UserDataStorage.DEFAULT_PREFERENCES = {
        theme: 'auto',
        language: 'zh-CN',
        fontSize: 'medium',
        notifications: {
            enabled: true,
            dailyReminder: false,
            updateNotice: true,
            soundEnabled: true,
            vibrationEnabled: true,
        },
        privacy: {
            dataCollection: true,
            usageAnalytics: true,
            shareUsageData: false,
            allowPersonalization: true,
        },
        accessibility: {
            highContrast: false,
            reduceMotion: false,
            screenReader: false,
        },
    };
    UserDataStorage.DEFAULT_ACTIVITY_DATA = {
        totalUsageTime: 0,
        dailyUsage: {},
        sessionCount: 0,
        lastActiveTime: 0,
        firstUseTime: Date.now(),
        streakDays: 0,
        longestStreak: 0,
    };
    UserDataStorage.DEFAULT_TOOL_DATA = {
        favoriteTools: [],
        recentTools: [],
        toolUsageStats: {},
        toolSettings: {},
    };
    return UserDataStorage;
}());
exports.UserDataStorage = UserDataStorage;
// 导出单例实例
exports.userDataStorage = UserDataStorage.getInstance();
