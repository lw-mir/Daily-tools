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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var storage_1 = require("../../../utils/storage");
var logger_1 = require("../../../utils/logger");
var index_1 = require("../../../utils/index");
var dataManager_1 = require("../../../utils/dataManager");
var dataManager = dataManager_1.DataManager.getInstance();
Page({
    data: {
        conversionTypes: [
            {
                id: 'length',
                name: '长度',
                icon: '📏',
                units: [
                    { id: 'mm', name: '毫米', symbol: 'mm', factor: 0.001 },
                    { id: 'cm', name: '厘米', symbol: 'cm', factor: 0.01 },
                    { id: 'dm', name: '分米', symbol: 'dm', factor: 0.1 },
                    { id: 'm', name: '米', symbol: 'm', factor: 1 },
                    { id: 'km', name: '千米', symbol: 'km', factor: 1000 },
                    { id: 'in', name: '英寸', symbol: 'in', factor: 0.0254 },
                    { id: 'ft', name: '英尺', symbol: 'ft', factor: 0.3048 },
                    { id: 'yd', name: '码', symbol: 'yd', factor: 0.9144 },
                    { id: 'mi', name: '英里', symbol: 'mi', factor: 1609.344 },
                    { id: 'nm', name: '海里', symbol: 'nm', factor: 1852 }
                ]
            },
            {
                id: 'weight',
                name: '重量',
                icon: '⚖️',
                units: [
                    { id: 'mg', name: '毫克', symbol: 'mg', factor: 0.000001 },
                    { id: 'g', name: '克', symbol: 'g', factor: 0.001 },
                    { id: 'kg', name: '千克', symbol: 'kg', factor: 1 },
                    { id: 't', name: '吨', symbol: 't', factor: 1000 },
                    { id: 'oz', name: '盎司', symbol: 'oz', factor: 0.0283495 },
                    { id: 'lb', name: '磅', symbol: 'lb', factor: 0.453592 },
                    { id: 'st', name: '英石', symbol: 'st', factor: 6.35029 },
                    { id: 'jin', name: '斤', symbol: '斤', factor: 0.5 },
                    { id: 'liang', name: '两', symbol: '两', factor: 0.05 }
                ]
            },
            {
                id: 'area',
                name: '面积',
                icon: '🔲',
                units: [
                    { id: 'mm2', name: '平方毫米', symbol: 'mm²', factor: 0.000001 },
                    { id: 'cm2', name: '平方厘米', symbol: 'cm²', factor: 0.0001 },
                    { id: 'm2', name: '平方米', symbol: 'm²', factor: 1 },
                    { id: 'km2', name: '平方千米', symbol: 'km²', factor: 1000000 },
                    { id: 'ha', name: '公顷', symbol: 'ha', factor: 10000 },
                    { id: 'acre', name: '英亩', symbol: 'acre', factor: 4046.86 },
                    { id: 'sqft', name: '平方英尺', symbol: 'ft²', factor: 0.092903 },
                    { id: 'sqin', name: '平方英寸', symbol: 'in²', factor: 0.00064516 }
                ]
            },
            {
                id: 'volume',
                name: '体积',
                icon: '🧊',
                units: [
                    { id: 'ml', name: '毫升', symbol: 'ml', factor: 0.001 },
                    { id: 'l', name: '升', symbol: 'l', factor: 1 },
                    { id: 'm3', name: '立方米', symbol: 'm³', factor: 1000 },
                    { id: 'floz', name: '液体盎司', symbol: 'fl oz', factor: 0.0295735 },
                    { id: 'cup', name: '杯', symbol: 'cup', factor: 0.236588 },
                    { id: 'pt', name: '品脱', symbol: 'pt', factor: 0.473176 },
                    { id: 'qt', name: '夸脱', symbol: 'qt', factor: 0.946353 },
                    { id: 'gal', name: '加仑', symbol: 'gal', factor: 3.78541 }
                ]
            },
            {
                id: 'temperature',
                name: '温度',
                icon: '🌡️',
                units: [
                    { id: 'c', name: '摄氏度', symbol: '°C', factor: 1, offset: 0 },
                    { id: 'f', name: '华氏度', symbol: '°F', factor: 5 / 9, offset: -32 },
                    { id: 'k', name: '开尔文', symbol: 'K', factor: 1, offset: -273.15 }
                ]
            },
            {
                id: 'time',
                name: '时间',
                icon: '⏰',
                units: [
                    { id: 'ms', name: '毫秒', symbol: 'ms', factor: 0.001 },
                    { id: 's', name: '秒', symbol: 's', factor: 1 },
                    { id: 'min', name: '分钟', symbol: 'min', factor: 60 },
                    { id: 'h', name: '小时', symbol: 'h', factor: 3600 },
                    { id: 'd', name: '天', symbol: 'd', factor: 86400 },
                    { id: 'w', name: '周', symbol: 'w', factor: 604800 },
                    { id: 'month', name: '月', symbol: 'month', factor: 2592000 },
                    { id: 'year', name: '年', symbol: 'year', factor: 31536000 }
                ]
            }
        ],
        currentType: 'length',
        inputValue: '',
        outputValue: '0',
        fromUnitIndex: 3,
        toUnitIndex: 0,
        fromUnits: [],
        toUnits: [],
        history: [],
        quickConversions: [
            { id: '1', from: '1米', to: '100厘米', description: '基本长度换算', type: 'length', fromUnit: 'm', toUnit: 'cm' },
            { id: '2', from: '1千克', to: '1000克', description: '基本重量换算', type: 'weight', fromUnit: 'kg', toUnit: 'g' },
            { id: '3', from: '1升', to: '1000毫升', description: '基本体积换算', type: 'volume', fromUnit: 'l', toUnit: 'ml' },
            { id: '4', from: '0°C', to: '32°F', description: '水的冰点', type: 'temperature', fromUnit: 'c', toUnit: 'f' },
            { id: '5', from: '1小时', to: '60分钟', description: '基本时间换算', type: 'time', fromUnit: 'h', toUnit: 'min' }
        ],
        isLoading: false,
        loadingText: '转换中...',
        isFavorite: false
    },
    onLoad: function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.LoggerService.info('Unit Converter page loaded');
                        this.initializeConverter();
                        return [4 /*yield*/, this.loadHistory()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.checkFavoriteStatus()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, , 7]);
                        return [4 /*yield*/, dataManager.addRecentTool('unit-converter')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, dataManager.addUsageRecord({
                                toolId: 'unit-converter',
                                toolName: '单位转换',
                                category: '工具'
                            })];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        logger_1.LoggerService.error('Failed to record tool usage:', error_1);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    },
    onShow: function () {
        var lastState = storage_1.StorageService.get('unit_converter_state');
        if (lastState) {
            this.setData({
                currentType: lastState.currentType || 'length',
                inputValue: lastState.inputValue || '',
                fromUnitIndex: lastState.fromUnitIndex || 3,
                toUnitIndex: lastState.toUnitIndex || 0
            });
            this.updateUnits();
        }
    },
    onHide: function () {
        storage_1.StorageService.set('unit_converter_state', {
            currentType: this.data.currentType,
            inputValue: this.data.inputValue,
            fromUnitIndex: this.data.fromUnitIndex,
            toUnitIndex: this.data.toUnitIndex
        });
    },
    onUnload: function () {
        logger_1.LoggerService.info('Unit Converter page unloaded');
    },
    initializeConverter: function () {
        this.updateUnits();
        this.performConversion();
    },
    updateUnits: function () {
        var _this = this;
        var currentTypeData = this.data.conversionTypes.find(function (type) { return type.id === _this.data.currentType; });
        if (currentTypeData) {
            this.setData({
                fromUnits: currentTypeData.units,
                toUnits: currentTypeData.units
            });
        }
    },
    onTypeChange: function (e) {
        var type = e.currentTarget.dataset.type;
        this.setData({
            currentType: type,
            inputValue: '',
            outputValue: '0',
            fromUnitIndex: 0,
            toUnitIndex: 1
        });
        this.updateUnits();
    },
    onInputChange: function (e) {
        var value = e.detail.value;
        this.setData({
            inputValue: value
        });
        this.performConversion();
    },
    onInputConfirm: function () {
        this.performConversion();
    },
    onFromUnitChange: function (e) {
        var index = parseInt(e.detail.value);
        this.setData({
            fromUnitIndex: index
        });
        this.performConversion();
    },
    onToUnitChange: function (e) {
        var index = parseInt(e.detail.value);
        this.setData({
            toUnitIndex: index
        });
        this.performConversion();
    },
    onSwapUnits: function () {
        var _a = this.data, fromUnitIndex = _a.fromUnitIndex, toUnitIndex = _a.toUnitIndex, inputValue = _a.inputValue, outputValue = _a.outputValue;
        this.setData({
            fromUnitIndex: toUnitIndex,
            toUnitIndex: fromUnitIndex,
            inputValue: outputValue,
            outputValue: inputValue
        });
        this.performConversion();
    },
    performConversion: function () {
        var _a = this.data, inputValue = _a.inputValue, fromUnitIndex = _a.fromUnitIndex, toUnitIndex = _a.toUnitIndex, fromUnits = _a.fromUnits, toUnits = _a.toUnits, currentType = _a.currentType;
        if (!inputValue || inputValue === '' || isNaN(parseFloat(inputValue))) {
            this.setData({ outputValue: '0' });
            return;
        }
        var inputNum = parseFloat(inputValue);
        var fromUnit = fromUnits[fromUnitIndex];
        var toUnit = toUnits[toUnitIndex];
        if (!fromUnit || !toUnit) {
            this.setData({ outputValue: '0' });
            return;
        }
        var result;
        if (currentType === 'temperature') {
            // 温度转换需要特殊处理
            result = this.convertTemperature(inputNum, fromUnit, toUnit);
        }
        else {
            // 其他单位转换
            // 先转换为基准单位，再转换为目标单位
            var baseValue = inputNum * fromUnit.factor;
            result = baseValue / toUnit.factor;
        }
        // 格式化输出结果
        var formattedResult = this.formatResult(result);
        this.setData({ outputValue: formattedResult });
        // 添加到历史记录
        if (inputValue && result !== 0) {
            this.addToHistory(inputValue, formattedResult, fromUnit.name, toUnit.name);
        }
    },
    convertTemperature: function (value, fromUnit, toUnit) {
        // 先转换为摄氏度
        var celsius;
        if (fromUnit.id === 'c') {
            celsius = value;
        }
        else if (fromUnit.id === 'f') {
            celsius = (value - 32) * 5 / 9;
        }
        else if (fromUnit.id === 'k') {
            celsius = value - 273.15;
        }
        else {
            celsius = value;
        }
        // 再从摄氏度转换为目标单位
        var result;
        if (toUnit.id === 'c') {
            result = celsius;
        }
        else if (toUnit.id === 'f') {
            result = celsius * 9 / 5 + 32;
        }
        else if (toUnit.id === 'k') {
            result = celsius + 273.15;
        }
        else {
            result = celsius;
        }
        return result;
    },
    formatResult: function (value) {
        if (Math.abs(value) < 0.0001) {
            return value.toExponential(3);
        }
        else if (Math.abs(value) >= 1000000) {
            return value.toExponential(3);
        }
        else if (Math.abs(value) >= 1000) {
            return value.toFixed(2);
        }
        else if (Math.abs(value) >= 1) {
            return value.toFixed(4);
        }
        else {
            return value.toFixed(6);
        }
    },
    onCopyResult: function () {
        var outputValue = this.data.outputValue;
        if (outputValue && outputValue !== '0') {
            wx.setClipboardData({
                data: outputValue,
                success: function () {
                    wx.showToast({
                        title: '已复制到剪贴板',
                        icon: 'success'
                    });
                }
            });
        }
    },
    onQuickConversion: function (e) {
        var conversion = e.currentTarget.dataset.conversion;
        if (!conversion)
            return;
        // 切换到对应的转换类型
        this.setData({
            currentType: conversion.type
        });
        this.updateUnits();
        // 找到对应的单位索引
        var fromIndex = this.data.fromUnits.findIndex(function (unit) { return unit.id === conversion.fromUnit; });
        var toIndex = this.data.toUnits.findIndex(function (unit) { return unit.id === conversion.toUnit; });
        // 设置转换参数
        this.setData({
            fromUnitIndex: fromIndex >= 0 ? fromIndex : 0,
            toUnitIndex: toIndex >= 0 ? toIndex : 1,
            inputValue: conversion.type === 'temperature' ? '0' : '1'
        });
        this.performConversion();
    },
    addToHistory: function (inputValue, outputValue, fromUnit, toUnit) {
        var historyItem = {
            id: Date.now().toString(),
            type: this.data.currentType,
            inputValue: inputValue,
            outputValue: outputValue,
            fromUnit: fromUnit,
            toUnit: toUnit,
            time: index_1.formatTime(Date.now()),
            timestamp: Date.now()
        };
        var history = __spreadArrays([historyItem], this.data.history.slice(0, 19)); // 保留最近20条记录
        this.setData({ history: history });
        this.saveHistoryToStorage();
    },
    onSelectHistory: function (e) {
        var item = e.currentTarget.dataset.item;
        if (!item)
            return;
        // 切换到对应的转换类型
        this.setData({
            currentType: item.type
        });
        this.updateUnits();
        // 找到对应的单位索引
        var fromIndex = this.data.fromUnits.findIndex(function (unit) { return unit.name === item.fromUnit; });
        var toIndex = this.data.toUnits.findIndex(function (unit) { return unit.name === item.toUnit; });
        // 设置转换参数
        this.setData({
            fromUnitIndex: fromIndex >= 0 ? fromIndex : 0,
            toUnitIndex: toIndex >= 0 ? toIndex : 1,
            inputValue: item.inputValue
        });
        this.performConversion();
    },
    onClearHistory: function () {
        var _this = this;
        wx.showModal({
            title: '确认清空',
            content: '确定要清空所有转换历史吗？',
            success: function (res) {
                if (res.confirm) {
                    _this.setData({ history: [] });
                    _this.saveHistoryToStorage();
                    wx.showToast({
                        title: '历史记录已清空',
                        icon: 'success'
                    });
                }
            }
        });
    },
    loadHistory: function () {
        return __awaiter(this, void 0, void 0, function () {
            var history;
            return __generator(this, function (_a) {
                try {
                    history = storage_1.StorageService.get('unit_converter_history') || [];
                    this.setData({ history: history });
                }
                catch (error) {
                    logger_1.LoggerService.error('Failed to load history:', error);
                }
                return [2 /*return*/];
            });
        });
    },
    saveHistoryToStorage: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    storage_1.StorageService.set('unit_converter_history', this.data.history);
                }
                catch (error) {
                    logger_1.LoggerService.error('Failed to save history:', error);
                }
                return [2 /*return*/];
            });
        });
    },
    checkFavoriteStatus: function () {
        return __awaiter(this, void 0, void 0, function () {
            var favorites, isFavorite;
            return __generator(this, function (_a) {
                try {
                    favorites = storage_1.StorageService.get('user_favorites') || [];
                    isFavorite = favorites.includes('unit-converter');
                    this.setData({ isFavorite: isFavorite });
                }
                catch (error) {
                    logger_1.LoggerService.error('Failed to check favorite status:', error);
                }
                return [2 /*return*/];
            });
        });
    },
    onToggleFavorite: function () {
        return __awaiter(this, void 0, void 0, function () {
            var favorites, toolId, isFavorite, index, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        favorites = storage_1.StorageService.get('user_favorites') || [];
                        toolId = 'unit-converter';
                        isFavorite = favorites.includes(toolId);
                        if (isFavorite) {
                            index = favorites.indexOf(toolId);
                            favorites.splice(index, 1);
                            wx.showToast({
                                title: '已取消收藏',
                                icon: 'success'
                            });
                        }
                        else {
                            favorites.push(toolId);
                            wx.showToast({
                                title: '已添加到收藏',
                                icon: 'success'
                            });
                        }
                        storage_1.StorageService.set('user_favorites', favorites);
                        this.setData({ isFavorite: !isFavorite });
                        return [4 /*yield*/, dataManager.addUsageRecord({
                                toolId: 'unit-converter',
                                toolName: '单位转换',
                                category: '收藏'
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        logger_1.LoggerService.error('Failed to toggle favorite:', error_2);
                        wx.showToast({
                            title: '操作失败',
                            icon: 'error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
});
