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
var dataManager_1 = require("../../utils/dataManager");
var index_1 = require("../../utils/index");
Page({
    data: {
        searchText: '',
        timeFilter: 'all',
        usageGroups: [],
        filteredGroups: [],
        stats: {
            totalUsage: 0,
            totalDuration: 0,
            todayUsage: 0,
            weekUsage: 0,
            monthUsage: 0,
            favoriteTools: []
        },
        timeFilters: [
            { id: 'all', name: '全部' },
            { id: 'today', name: '今天' },
            { id: 'week', name: '本周' },
            { id: 'month', name: '本月' }
        ],
        isLoading: false,
        isEmpty: false
    },
    onLoad: function () {
        console.log('[History] 页面加载');
        this.loadUsageHistory();
    },
    onShow: function () {
        console.log('[History] 页面显示');
        this.loadUsageHistory();
    },
    onPullDownRefresh: function () {
        console.log('[History] 下拉刷新');
        this.loadUsageHistory();
        setTimeout(function () {
            wx.stopPullDownRefresh();
        }, 1000);
    },
    /**
     * 加载使用历史
     */
    loadUsageHistory: function () {
        return __awaiter(this, void 0, void 0, function () {
            var baseRecords, records, usageGroups, stats, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.setData({ isLoading: true });
                        return [4 /*yield*/, dataManager_1.dataManager.getUsageHistory()
                            // 添加id字段
                        ];
                    case 1:
                        baseRecords = _a.sent();
                        records = baseRecords.map(function (record, index) { return (__assign(__assign({}, record), { id: record.timestamp + "_" + index })); });
                        usageGroups = this.groupRecordsByDate(records);
                        stats = this.calculateStats(records);
                        this.setData({
                            usageGroups: usageGroups,
                            filteredGroups: usageGroups,
                            stats: stats,
                            isEmpty: records.length === 0,
                            isLoading: false
                        });
                        this.filterRecords();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('[History] 加载历史失败:', error_1);
                        this.setData({ isLoading: false });
                        wx.showToast({
                            title: '加载失败',
                            icon: 'error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 按日期分组记录
     */
    groupRecordsByDate: function (records) {
        var _this = this;
        var groups = {};
        records.forEach(function (record) {
            var date = new Date(record.timestamp);
            var dateKey = date.toDateString();
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(record);
        });
        return Object.entries(groups)
            .map(function (_a) {
            var dateKey = _a[0], records = _a[1];
            var date = new Date(dateKey);
            var totalDuration = records.reduce(function (sum, record) { return sum + (record.duration || 0); }, 0);
            return {
                date: dateKey,
                dateLabel: _this.formatDateLabel(date),
                records: records.sort(function (a, b) { return b.timestamp - a.timestamp; }),
                totalCount: records.length,
                totalDuration: totalDuration
            };
        })
            .sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); });
    },
    /**
     * 格式化日期标签
     */
    formatDateLabel: function (date) {
        var today = new Date();
        var yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        if (date.toDateString() === today.toDateString()) {
            return '今天';
        }
        else if (date.toDateString() === yesterday.toDateString()) {
            return '昨天';
        }
        else {
            return date.getMonth() + 1 + "\u6708" + date.getDate() + "\u65E5";
        }
    },
    /**
     * 计算统计信息
     */
    calculateStats: function (records) {
        // const now = Date.now()
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var todayStart = today.getTime();
        var weekStart = todayStart - 6 * 24 * 60 * 60 * 1000;
        var monthStart = todayStart - 29 * 24 * 60 * 60 * 1000;
        var todayRecords = records.filter(function (r) { return r.timestamp >= todayStart; });
        var weekRecords = records.filter(function (r) { return r.timestamp >= weekStart; });
        var monthRecords = records.filter(function (r) { return r.timestamp >= monthStart; });
        // 统计最常用工具
        var toolCount = {};
        records.forEach(function (record) {
            toolCount[record.toolName] = (toolCount[record.toolName] || 0) + 1;
        });
        var favoriteTools = Object.entries(toolCount)
            .sort(function (_a, _b) {
            var a = _a[1];
            var b = _b[1];
            return b - a;
        })
            .slice(0, 5)
            .map(function (_a) {
            var toolName = _a[0], count = _a[1];
            return ({ toolName: toolName, count: count });
        });
        return {
            totalUsage: records.length,
            totalDuration: records.reduce(function (sum, r) { return sum + (r.duration || 0); }, 0),
            todayUsage: todayRecords.length,
            weekUsage: weekRecords.length,
            monthUsage: monthRecords.length,
            favoriteTools: favoriteTools
        };
    },
    /**
     * 搜索输入
     */
    onSearchInput: function (e) {
        var searchText = e.detail.value;
        this.setData({ searchText: searchText });
        this.filterRecords();
    },
    /**
     * 搜索确认
     */
    onSearchConfirm: function () {
        this.filterRecords();
    },
    /**
     * 清除搜索
     */
    onClearSearch: function () {
        this.setData({ searchText: '' });
        this.filterRecords();
    },
    /**
     * 时间筛选
     */
    onTimeFilter: function (e) {
        var filter = e.currentTarget.dataset.filter;
        this.setData({ timeFilter: filter });
        this.filterRecords();
    },
    /**
     * 筛选记录
     */
    filterRecords: function () {
        var _a = this.data, usageGroups = _a.usageGroups, searchText = _a.searchText, timeFilter = _a.timeFilter;
        var filtered = __spreadArrays(usageGroups);
        // 时间筛选
        if (timeFilter !== 'all') {
            // const now = Date.now()
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            var startTime_1 = 0;
            switch (timeFilter) {
                case 'today':
                    startTime_1 = today.getTime();
                    break;
                case 'week':
                    startTime_1 = today.getTime() - 6 * 24 * 60 * 60 * 1000;
                    break;
                case 'month':
                    startTime_1 = today.getTime() - 29 * 24 * 60 * 60 * 1000;
                    break;
            }
            filtered = filtered.filter(function (group) {
                var groupDate = new Date(group.date).getTime();
                return groupDate >= startTime_1;
            });
        }
        // 搜索筛选
        if (searchText.trim()) {
            var keyword_1 = searchText.trim().toLowerCase();
            filtered = filtered.map(function (group) { return (__assign(__assign({}, group), { records: group.records.filter(function (record) {
                    return record.toolName.toLowerCase().includes(keyword_1) ||
                        record.category.toLowerCase().includes(keyword_1);
                }) })); }).filter(function (group) { return group.records.length > 0; });
        }
        this.setData({ filteredGroups: filtered });
    },
    /**
     * 点击记录
     */
    onRecordTap: function (e) {
        var record = e.currentTarget.dataset.record;
        // 根据工具类型导航到对应页面
        var path = '';
        switch (record.toolId) {
            case 'calculator':
                path = '/pages/tools/calculator/calculator';
                break;
            case 'converter':
                path = '/pages/tools/converter/converter';
                break;
            case 'qrcode':
                path = '/pages/tools/qrcode/qrcode';
                break;
            case 'foodwheel':
                path = '/pages/tools/foodwheel/foodwheel';
                break;
            default:
                wx.showToast({
                    title: '工具页面不存在',
                    icon: 'none'
                });
                return;
        }
        // 添加新的使用记录
        dataManager_1.dataManager.addUsageRecord({
            toolId: record.toolId,
            toolName: record.toolName,
            category: record.category
        });
        wx.navigateTo({
            url: path,
            fail: function (error) {
                console.error('[History] 导航失败:', error);
                wx.showToast({
                    title: '页面不存在',
                    icon: 'error'
                });
            }
        });
    },
    /**
     * 删除记录
     */
    onDeleteRecord: function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var record;
            var _this = this;
            return __generator(this, function (_a) {
                e.stopPropagation();
                record = e.currentTarget.dataset.record;
                wx.showModal({
                    title: '确认删除',
                    content: '确定要删除这条使用记录吗？',
                    success: function (res) { return __awaiter(_this, void 0, void 0, function () {
                        var baseRecords, filteredRecords, error_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!res.confirm) return [3 /*break*/, 5];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 4, , 5]);
                                    return [4 /*yield*/, dataManager_1.dataManager.getUsageHistory()];
                                case 2:
                                    baseRecords = _a.sent();
                                    filteredRecords = baseRecords.filter(function (r) {
                                        return !(r.timestamp === record.timestamp && r.toolId === record.toolId);
                                    });
                                    return [4 /*yield*/, dataManager_1.dataManager.saveUsageHistory(filteredRecords)];
                                case 3:
                                    _a.sent();
                                    wx.showToast({
                                        title: '删除成功',
                                        icon: 'success'
                                    });
                                    this.loadUsageHistory();
                                    return [3 /*break*/, 5];
                                case 4:
                                    error_2 = _a.sent();
                                    console.error('[History] 删除记录失败:', error_2);
                                    wx.showToast({
                                        title: '删除失败',
                                        icon: 'error'
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
    /**
     * 清空历史记录
     */
    onClearHistory: function () {
        var _this = this;
        wx.showModal({
            title: '确认清空',
            content: '确定要清空所有使用历史吗？此操作不可恢复。',
            success: function (res) { return __awaiter(_this, void 0, void 0, function () {
                var error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!res.confirm) return [3 /*break*/, 4];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, dataManager_1.dataManager.clearUsageHistory()];
                        case 2:
                            _a.sent();
                            wx.showToast({
                                title: '清空成功',
                                icon: 'success'
                            });
                            this.loadUsageHistory();
                            return [3 /*break*/, 4];
                        case 3:
                            error_3 = _a.sent();
                            console.error('[History] 清空历史失败:', error_3);
                            wx.showToast({
                                title: '清空失败',
                                icon: 'error'
                            });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); }
        });
    },
    /**
     * 导出数据
     */
    onExportData: function () {
        return __awaiter(this, void 0, void 0, function () {
            var records, exportData, dataString, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, dataManager_1.dataManager.getUsageHistory()];
                    case 1:
                        records = _a.sent();
                        exportData = {
                            exportTime: new Date().toISOString(),
                            totalRecords: records.length,
                            records: records.map(function (record) { return ({
                                toolName: record.toolName,
                                category: record.category,
                                time: index_1.formatTime(record.timestamp),
                                duration: record.duration || 0
                            }); })
                        };
                        dataString = JSON.stringify(exportData, null, 2);
                        // 复制到剪贴板
                        wx.setClipboardData({
                            data: dataString,
                            success: function () {
                                wx.showToast({
                                    title: '数据已复制到剪贴板',
                                    icon: 'success',
                                    duration: 2000
                                });
                            },
                            fail: function () {
                                wx.showToast({
                                    title: '导出失败',
                                    icon: 'error'
                                });
                            }
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error('[History] 导出数据失败:', error_4);
                        wx.showToast({
                            title: '导出失败',
                            icon: 'error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 格式化持续时间
     */
    formatDuration: function (duration) {
        if (duration < 60) {
            return duration + "\u79D2";
        }
        else if (duration < 3600) {
            return Math.floor(duration / 60) + "\u5206\u949F";
        }
        else {
            var hours = Math.floor(duration / 3600);
            var minutes = Math.floor((duration % 3600) / 60);
            return hours + "\u5C0F\u65F6" + minutes + "\u5206\u949F";
        }
    }
});
