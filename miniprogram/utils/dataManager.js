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
exports.dataManager = exports.DataManager = void 0;
/**
 * 数据管理器
 * 统一管理应用的所有数据存储和操作
 */
var storage_1 = require("./storage");
/**
 * 数据管理器类
 */
var DataManager = /** @class */ (function () {
    function DataManager() {
        this.initialized = false;
    }
    /**
     * 获取单例实例
     */
    DataManager.getInstance = function () {
        if (!DataManager.instance) {
            DataManager.instance = new DataManager();
        }
        return DataManager.instance;
    };
    /**
     * 初始化数据管理器
     */
    DataManager.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.initialized)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        // 初始化存储服务
                        storage_1.StorageService.init();
                        // 检查并初始化默认数据
                        return [4 /*yield*/, this.initializeDefaultData()
                            // 清理过期数据
                        ];
                    case 2:
                        // 检查并初始化默认数据
                        _a.sent();
                        // 清理过期数据
                        return [4 /*yield*/, this.cleanExpiredData()];
                    case 3:
                        // 清理过期数据
                        _a.sent();
                        this.initialized = true;
                        console.log('DataManager 初始化完成');
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error('DataManager 初始化失败:', error_1);
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 初始化默认数据
     */
    DataManager.prototype.initializeDefaultData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var settings, statistics, recentTools, favoriteTools;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUserSettings()];
                    case 1:
                        settings = _a.sent();
                        if (!!settings) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.saveUserSettings(DataManager.DEFAULT_SETTINGS)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.getAppStatistics()];
                    case 4:
                        statistics = _a.sent();
                        if (!!statistics) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.saveAppStatistics(DataManager.DEFAULT_STATISTICS)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [4 /*yield*/, this.getRecentTools()];
                    case 7:
                        recentTools = _a.sent();
                        if (!!recentTools) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.saveRecentTools([])];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [4 /*yield*/, this.getFavoriteTools()];
                    case 10:
                        favoriteTools = _a.sent();
                        if (!!favoriteTools) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.saveFavoriteTools([])];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 清理过期数据
     */
    DataManager.prototype.cleanExpiredData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var thirtyDaysAgo, usageHistory, filteredHistory, calculatorHistory, filteredHistory, conversionHistory, filteredHistory;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
                        return [4 /*yield*/, this.getUsageHistory()];
                    case 1:
                        usageHistory = _a.sent();
                        if (!usageHistory) return [3 /*break*/, 3];
                        filteredHistory = usageHistory.filter(function (record) { return record.timestamp > thirtyDaysAgo; });
                        if (!(filteredHistory.length !== usageHistory.length)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.saveUsageHistory(filteredHistory)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.getCalculatorHistory()];
                    case 4:
                        calculatorHistory = _a.sent();
                        if (!calculatorHistory) return [3 /*break*/, 6];
                        filteredHistory = calculatorHistory.filter(function (record) { return record.timestamp > thirtyDaysAgo; });
                        if (!(filteredHistory.length !== calculatorHistory.length)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.saveCalculatorHistory(filteredHistory)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [4 /*yield*/, this.getConversionHistory()];
                    case 7:
                        conversionHistory = _a.sent();
                        if (!conversionHistory) return [3 /*break*/, 9];
                        filteredHistory = conversionHistory.filter(function (record) { return record.timestamp > thirtyDaysAgo; });
                        if (!(filteredHistory.length !== conversionHistory.length)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.saveConversionHistory(filteredHistory)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    // ===== 用户资料管理 =====
    /**
     * 获取用户资料
     */
    DataManager.prototype.getUserProfile = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_1.StorageService.getAsync(DataManager.KEYS.USER_PROFILE)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 保存用户资料
     */
    DataManager.prototype.saveUserProfile = function (profile) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_1.StorageService.setAsync(DataManager.KEYS.USER_PROFILE, profile)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 更新用户登录状态
     */
    DataManager.prototype.updateLoginStatus = function (isLoggedIn) {
        return __awaiter(this, void 0, void 0, function () {
            var profile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUserProfile()];
                    case 1:
                        profile = _a.sent();
                        if (!profile) return [3 /*break*/, 3];
                        profile.isLoggedIn = isLoggedIn;
                        profile.loginTime = isLoggedIn ? Date.now() : undefined;
                        return [4 /*yield*/, this.saveUserProfile(profile)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    };
    // ===== 用户设置管理 =====
    /**
     * 获取用户设置
     */
    DataManager.prototype.getUserSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_1.StorageService.getAsync(DataManager.KEYS.USER_SETTINGS)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 保存用户设置
     */
    DataManager.prototype.saveUserSettings = function (settings) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_1.StorageService.setAsync(DataManager.KEYS.USER_SETTINGS, settings)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 更新单个设置项
     */
    DataManager.prototype.updateSetting = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var settings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUserSettings()];
                    case 1:
                        settings = (_a.sent()) || DataManager.DEFAULT_SETTINGS;
                        settings[key] = value;
                        return [4 /*yield*/, this.saveUserSettings(settings)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // ===== 最近使用工具管理 =====
    /**
     * 获取最近使用工具
     */
    DataManager.prototype.getRecentTools = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_1.StorageService.getAsync(DataManager.KEYS.RECENT_TOOLS, [])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 保存最近使用工具
     */
    DataManager.prototype.saveRecentTools = function (tools) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_1.StorageService.setAsync(DataManager.KEYS.RECENT_TOOLS, tools)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 添加最近使用工具
     */
    DataManager.prototype.addRecentTool = function (toolId) {
        return __awaiter(this, void 0, void 0, function () {
            var recentTools, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRecentTools()];
                    case 1:
                        recentTools = _a.sent();
                        index = recentTools.indexOf(toolId);
                        // 如果已存在，先移除
                        if (index > -1) {
                            recentTools.splice(index, 1);
                        }
                        // 添加到开头
                        recentTools.unshift(toolId);
                        // 限制数量为10个
                        if (recentTools.length > 10) {
                            recentTools.splice(10);
                        }
                        return [4 /*yield*/, this.saveRecentTools(recentTools)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 清空最近使用工具
     */
    DataManager.prototype.clearRecentTools = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveRecentTools([])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // ===== 收藏工具管理 =====
    /**
     * 获取收藏工具
     */
    DataManager.prototype.getFavoriteTools = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_1.StorageService.getAsync(DataManager.KEYS.FAVORITE_TOOLS, [])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 保存收藏工具
     */
    DataManager.prototype.saveFavoriteTools = function (tools) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_1.StorageService.setAsync(DataManager.KEYS.FAVORITE_TOOLS, tools)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 切换收藏状态
     */
    DataManager.prototype.toggleFavorite = function (toolId) {
        return __awaiter(this, void 0, void 0, function () {
            var favoriteTools, index, success, success;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getFavoriteTools()];
                    case 1:
                        favoriteTools = _a.sent();
                        index = favoriteTools.indexOf(toolId);
                        if (!(index > -1)) return [3 /*break*/, 3];
                        // 已收藏，取消收藏
                        favoriteTools.splice(index, 1);
                        return [4 /*yield*/, this.saveFavoriteTools(favoriteTools)];
                    case 2:
                        success = _a.sent();
                        return [2 /*return*/, { success: success, isFavorite: false }];
                    case 3:
                        // 未收藏，添加收藏
                        if (favoriteTools.length >= 20) {
                            return [2 /*return*/, { success: false, isFavorite: false, message: '最多收藏20个工具' }];
                        }
                        favoriteTools.push(toolId);
                        return [4 /*yield*/, this.saveFavoriteTools(favoriteTools)];
                    case 4:
                        success = _a.sent();
                        return [2 /*return*/, { success: success, isFavorite: true }];
                }
            });
        });
    };
    /**
     * 检查是否已收藏
     */
    DataManager.prototype.isFavorite = function (toolId) {
        return __awaiter(this, void 0, void 0, function () {
            var favoriteTools;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getFavoriteTools()];
                    case 1:
                        favoriteTools = _a.sent();
                        return [2 /*return*/, favoriteTools.includes(toolId)];
                }
            });
        });
    };
    // ===== 使用历史管理 =====
    /**
     * 获取使用历史
     */
    DataManager.prototype.getUsageHistory = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_1.StorageService.getAsync(DataManager.KEYS.USAGE_HISTORY, [])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 保存使用历史
     */
    DataManager.prototype.saveUsageHistory = function (history) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_1.StorageService.setAsync(DataManager.KEYS.USAGE_HISTORY, history)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 添加使用记录
     */
    DataManager.prototype.addUsageRecord = function (record) {
        return __awaiter(this, void 0, void 0, function () {
            var history, newRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUsageHistory()];
                    case 1:
                        history = _a.sent();
                        newRecord = __assign(__assign({}, record), { timestamp: Date.now() });
                        history.unshift(newRecord);
                        // 限制历史记录数量为1000条
                        if (history.length > 1000) {
                            history.splice(1000);
                        }
                        // 同时更新统计数据
                        return [4 /*yield*/, this.updateStatistics(record.toolId, record.duration)];
                    case 2:
                        // 同时更新统计数据
                        _a.sent();
                        return [4 /*yield*/, this.saveUsageHistory(history)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 清空使用历史
     */
    DataManager.prototype.clearUsageHistory = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveUsageHistory([])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // ===== 计算器历史管理 =====
    /**
     * 获取计算器历史
     */
    DataManager.prototype.getCalculatorHistory = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_1.StorageService.getAsync(DataManager.KEYS.CALCULATOR_HISTORY, [])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 保存计算器历史
     */
    DataManager.prototype.saveCalculatorHistory = function (history) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_1.StorageService.setAsync(DataManager.KEYS.CALCULATOR_HISTORY, history)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 添加计算器记录
     */
    DataManager.prototype.addCalculatorRecord = function (record) {
        return __awaiter(this, void 0, void 0, function () {
            var history, newRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCalculatorHistory()];
                    case 1:
                        history = _a.sent();
                        newRecord = __assign(__assign({}, record), { id: Date.now().toString(), timestamp: Date.now() });
                        history.unshift(newRecord);
                        // 限制历史记录数量为100条
                        if (history.length > 100) {
                            history.splice(100);
                        }
                        return [4 /*yield*/, this.saveCalculatorHistory(history)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 清空计算器历史
     */
    DataManager.prototype.clearCalculatorHistory = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveCalculatorHistory([])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // ===== 转换历史管理 =====
    /**
     * 获取转换历史
     */
    DataManager.prototype.getConversionHistory = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_1.StorageService.getAsync(DataManager.KEYS.CONVERSION_HISTORY, [])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 保存转换历史
     */
    DataManager.prototype.saveConversionHistory = function (history) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_1.StorageService.setAsync(DataManager.KEYS.CONVERSION_HISTORY, history)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 添加转换记录
     */
    DataManager.prototype.addConversionRecord = function (record) {
        return __awaiter(this, void 0, void 0, function () {
            var history, newRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getConversionHistory()];
                    case 1:
                        history = _a.sent();
                        newRecord = __assign(__assign({}, record), { id: Date.now().toString(), timestamp: Date.now() });
                        history.unshift(newRecord);
                        // 限制历史记录数量为100条
                        if (history.length > 100) {
                            history.splice(100);
                        }
                        return [4 /*yield*/, this.saveConversionHistory(history)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 清空转换历史
     */
    DataManager.prototype.clearConversionHistory = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveConversionHistory([])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // ===== 统计数据管理 =====
    /**
     * 获取应用统计数据
     */
    DataManager.prototype.getAppStatistics = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_1.StorageService.getAsync(DataManager.KEYS.APP_STATISTICS)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 保存应用统计数据
     */
    DataManager.prototype.saveAppStatistics = function (statistics) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_1.StorageService.setAsync(DataManager.KEYS.APP_STATISTICS, statistics)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 更新统计数据
     */
    DataManager.prototype.updateStatistics = function (toolId, duration) {
        return __awaiter(this, void 0, void 0, function () {
            var statistics, today, uniqueDays;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAppStatistics()];
                    case 1:
                        statistics = (_a.sent()) || DataManager.DEFAULT_STATISTICS;
                        today = new Date().toDateString();
                        // 更新工具使用次数
                        statistics.toolUsageCount[toolId] = (statistics.toolUsageCount[toolId] || 0) + 1;
                        // 更新总会话数
                        statistics.totalSessions += 1;
                        // 更新使用时长
                        if (duration) {
                            statistics.totalUsageTime += duration;
                            statistics.dailyUsage[today] = (statistics.dailyUsage[today] || 0) + duration;
                        }
                        // 更新最后使用时间
                        statistics.lastUseTime = Date.now();
                        uniqueDays = Object.keys(statistics.dailyUsage).length;
                        statistics.activeDays = Math.max(uniqueDays, 1);
                        return [4 /*yield*/, this.saveAppStatistics(statistics)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // ===== 缓存管理 =====
    /**
     * 获取缓存数据
     */
    DataManager.prototype.getCacheData = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_1.StorageService.getAsync(DataManager.KEYS.CACHE_DATA, {})];
                    case 1:
                        cacheData = _a.sent();
                        return [2 /*return*/, cacheData[key]];
                }
            });
        });
    };
    /**
     * 设置缓存数据
     */
    DataManager.prototype.setCacheData = function (key, value, expireTime) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_1.StorageService.getAsync(DataManager.KEYS.CACHE_DATA, {})];
                    case 1:
                        cacheData = _a.sent();
                        cacheData[key] = {
                            value: value,
                            timestamp: Date.now(),
                            expireTime: expireTime || (Date.now() + 24 * 60 * 60 * 1000) // 默认24小时过期
                        };
                        return [4 /*yield*/, storage_1.StorageService.setAsync(DataManager.KEYS.CACHE_DATA, cacheData)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 清理过期缓存
     */
    DataManager.prototype.cleanExpiredCache = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cacheData, now, cleanedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage_1.StorageService.getAsync(DataManager.KEYS.CACHE_DATA, {})];
                    case 1:
                        cacheData = _a.sent();
                        now = Date.now();
                        cleanedData = {};
                        Object.keys(cacheData).forEach(function (key) {
                            var item = cacheData[key];
                            if (item.expireTime > now) {
                                cleanedData[key] = item;
                            }
                        });
                        return [4 /*yield*/, storage_1.StorageService.setAsync(DataManager.KEYS.CACHE_DATA, cleanedData)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // ===== 数据导出导入 =====
    /**
     * 导出所有数据
     */
    DataManager.prototype.exportAllData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {};
                        return [4 /*yield*/, this.getUserProfile()];
                    case 1:
                        _a.userProfile = _b.sent();
                        return [4 /*yield*/, this.getUserSettings()];
                    case 2:
                        _a.userSettings = _b.sent();
                        return [4 /*yield*/, this.getRecentTools()];
                    case 3:
                        _a.recentTools = _b.sent();
                        return [4 /*yield*/, this.getFavoriteTools()];
                    case 4:
                        _a.favoriteTools = _b.sent();
                        return [4 /*yield*/, this.getUsageHistory()];
                    case 5:
                        _a.usageHistory = _b.sent();
                        return [4 /*yield*/, this.getCalculatorHistory()];
                    case 6:
                        _a.calculatorHistory = _b.sent();
                        return [4 /*yield*/, this.getConversionHistory()];
                    case 7:
                        _a.conversionHistory = _b.sent();
                        return [4 /*yield*/, this.getAppStatistics()];
                    case 8:
                        data = (_a.appStatistics = _b.sent(),
                            _a.exportTime = Date.now(),
                            _a.version = '1.0.0',
                            _a);
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * 导入数据
     */
    DataManager.prototype.importData = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 17, , 18]);
                        if (!data.userProfile) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.saveUserProfile(data.userProfile)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!data.userSettings) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.saveUserSettings(data.userSettings)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!data.recentTools) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.saveRecentTools(data.recentTools)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!data.favoriteTools) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.saveFavoriteTools(data.favoriteTools)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        if (!data.usageHistory) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.saveUsageHistory(data.usageHistory)];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10:
                        if (!data.calculatorHistory) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.saveCalculatorHistory(data.calculatorHistory)];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12:
                        if (!data.conversionHistory) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.saveConversionHistory(data.conversionHistory)];
                    case 13:
                        _a.sent();
                        _a.label = 14;
                    case 14:
                        if (!data.appStatistics) return [3 /*break*/, 16];
                        return [4 /*yield*/, this.saveAppStatistics(data.appStatistics)];
                    case 15:
                        _a.sent();
                        _a.label = 16;
                    case 16: return [2 /*return*/, true];
                    case 17:
                        error_2 = _a.sent();
                        console.error('导入数据失败:', error_2);
                        return [2 /*return*/, false];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 获取存储使用情况
     */
    DataManager.prototype.getStorageUsage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var info;
            return __generator(this, function (_a) {
                info = storage_1.StorageService.getInfo();
                return [2 /*return*/, {
                        used: info.currentSize || 0,
                        total: info.limitSize || 10 * 1024,
                        percentage: info.limitSize ? (info.currentSize / info.limitSize) * 100 : 0
                    }];
            });
        });
    };
    /**
     * 清理所有数据
     */
    DataManager.prototype.clearAllData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keys, _i, keys_1, key, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        keys = Object.values(DataManager.KEYS);
                        for (_i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                            key = keys_1[_i];
                            storage_1.StorageService.remove(key);
                        }
                        // 重新初始化默认数据
                        return [4 /*yield*/, this.initializeDefaultData()];
                    case 1:
                        // 重新初始化默认数据
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_3 = _a.sent();
                        console.error('清理数据失败:', error_3);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 存储键名常量
    DataManager.KEYS = {
        USER_PROFILE: 'user_profile',
        USER_SETTINGS: 'user_settings',
        RECENT_TOOLS: 'recent_tools',
        FAVORITE_TOOLS: 'favorite_tools',
        USAGE_HISTORY: 'usage_history',
        CALCULATOR_HISTORY: 'calculator_history',
        CONVERSION_HISTORY: 'conversion_history',
        APP_STATISTICS: 'app_statistics',
        CACHE_DATA: 'cache_data'
    };
    // 默认设置
    DataManager.DEFAULT_SETTINGS = {
        theme: 'auto',
        language: 'zh-CN',
        notifications: {
            enabled: true,
            dailyReminder: false,
            updateNotice: true
        },
        privacy: {
            dataCollection: true,
            usageAnalytics: true
        },
        performance: {
            enableCache: true,
            preloadTools: false
        }
    };
    DataManager.DEFAULT_STATISTICS = {
        totalUsageTime: 0,
        totalSessions: 0,
        toolUsageCount: {},
        dailyUsage: {},
        firstUseTime: Date.now(),
        lastUseTime: Date.now(),
        activeDays: 0
    };
    return DataManager;
}());
exports.DataManager = DataManager;
// 导出单例实例
exports.dataManager = DataManager.getInstance();
