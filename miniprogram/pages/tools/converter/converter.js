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
// 单位定义
var UNIT_DEFINITIONS = {
    length: [
        { id: 'mm', name: '毫米', symbol: 'mm', factor: 0.001 },
        { id: 'cm', name: '厘米', symbol: 'cm', factor: 0.01 },
        { id: 'm', name: '米', symbol: 'm', factor: 1 },
        { id: 'km', name: '千米', symbol: 'km', factor: 1000 },
        { id: 'inch', name: '英寸', symbol: 'in', factor: 0.0254 },
        { id: 'ft', name: '英尺', symbol: 'ft', factor: 0.3048 },
        { id: 'yard', name: '码', symbol: 'yd', factor: 0.9144 },
        { id: 'mile', name: '英里', symbol: 'mi', factor: 1609.344 }
    ],
    weight: [
        { id: 'mg', name: '毫克', symbol: 'mg', factor: 0.000001 },
        { id: 'g', name: '克', symbol: 'g', factor: 0.001 },
        { id: 'kg', name: '千克', symbol: 'kg', factor: 1 },
        { id: 'ton', name: '吨', symbol: 't', factor: 1000 },
        { id: 'oz', name: '盎司', symbol: 'oz', factor: 0.0283495 },
        { id: 'lb', name: '磅', symbol: 'lb', factor: 0.453592 },
        { id: 'stone', name: '英石', symbol: 'st', factor: 6.35029 }
    ],
    temperature: [
        { id: 'celsius', name: '摄氏度', symbol: '°C', factor: 1, offset: 0 },
        { id: 'fahrenheit', name: '华氏度', symbol: '°F', factor: 5 / 9, offset: -32 },
        { id: 'kelvin', name: '开尔文', symbol: 'K', factor: 1, offset: -273.15 }
    ],
    area: [
        { id: 'mm2', name: '平方毫米', symbol: 'mm²', factor: 0.000001 },
        { id: 'cm2', name: '平方厘米', symbol: 'cm²', factor: 0.0001 },
        { id: 'm2', name: '平方米', symbol: 'm²', factor: 1 },
        { id: 'km2', name: '平方千米', symbol: 'km²', factor: 1000000 },
        { id: 'inch2', name: '平方英寸', symbol: 'in²', factor: 0.00064516 },
        { id: 'ft2', name: '平方英尺', symbol: 'ft²', factor: 0.092903 },
        { id: 'acre', name: '英亩', symbol: 'acre', factor: 4046.86 }
    ],
    volume: [
        { id: 'ml', name: '毫升', symbol: 'ml', factor: 0.001 },
        { id: 'l', name: '升', symbol: 'L', factor: 1 },
        { id: 'm3', name: '立方米', symbol: 'm³', factor: 1000 },
        { id: 'cup', name: '杯', symbol: 'cup', factor: 0.236588 },
        { id: 'pint', name: '品脱', symbol: 'pt', factor: 0.473176 },
        { id: 'quart', name: '夸脱', symbol: 'qt', factor: 0.946353 },
        { id: 'gallon', name: '加仑', symbol: 'gal', factor: 3.78541 }
    ]
};
Page({
    data: {
        conversionTypes: [
            { id: 'length', name: '长度', icon: '📏' },
            { id: 'weight', name: '重量', icon: '⚖️' },
            { id: 'temperature', name: '温度', icon: '🌡️' },
            { id: 'area', name: '面积', icon: '📐' },
            { id: 'volume', name: '体积', icon: '🥤' },
            { id: 'speed', name: '速度', icon: '🚀' }
        ],
        currentType: 'length',
        fromUnits: [],
        toUnits: [],
        fromUnitIndex: 0,
        toUnitIndex: 1,
        inputValue: '',
        outputValue: '0',
        quickConversions: [],
        history: [],
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
                        logger_1.LoggerService.info('Converter page loaded');
                        this.initConverter();
                        return [4 /*yield*/, this.loadHistory()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, dataManager_1.dataManager.addRecentTool('converter')];
                    case 3:
                        _a.sent();
                        // 记录使用历史
                        return [4 /*yield*/, dataManager_1.dataManager.addUsageRecord({
                                toolId: 'converter',
                                toolName: '单位转换',
                                category: '工具'
                            })];
                    case 4:
                        // 记录使用历史
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        logger_1.LoggerService.error('Failed to record tool usage:', error_1);
                        return [3 /*break*/, 6];
                    case 6: 
                    // 检查收藏状态
                    return [4 /*yield*/, this.checkFavoriteStatus()];
                    case 7:
                        // 检查收藏状态
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    onShow: function () {
        // 恢复上次的转换状态
        var lastState = storage_1.StorageService.get('converter_state');
        if (lastState) {
            this.setData({
                currentType: lastState.currentType || 'length',
                inputValue: lastState.inputValue || '',
                fromUnitIndex: lastState.fromUnitIndex || 0,
                toUnitIndex: lastState.toUnitIndex || 1
            });
            this.initConverter();
        }
    },
    onHide: function () {
        // 保存当前转换状态
        storage_1.StorageService.set('converter_state', {
            currentType: this.data.currentType,
            inputValue: this.data.inputValue,
            fromUnitIndex: this.data.fromUnitIndex,
            toUnitIndex: this.data.toUnitIndex
        });
    },
    onUnload: function () {
        logger_1.LoggerService.info('Converter page unloaded');
    },
    // 初始化转换器
    initConverter: function () {
        var currentType = this.data.currentType;
        var units = UNIT_DEFINITIONS[currentType] || [];
        this.setData({
            fromUnits: units,
            toUnits: units,
            quickConversions: this.getQuickConversions(currentType)
        });
        // 如果有输入值，执行转换
        if (this.data.inputValue) {
            this.performConversion();
        }
    },
    // 获取快捷转换选项
    getQuickConversions: function (type) {
        var quickMap = {
            length: [
                { id: '1', from: '1米', to: '厘米', description: '1米 = 100厘米', fromUnit: 'm', toUnit: 'cm', value: 1 },
                { id: '2', from: '1千米', to: '米', description: '1千米 = 1000米', fromUnit: 'km', toUnit: 'm', value: 1 },
                { id: '3', from: '1英尺', to: '厘米', description: '1英尺 ≈ 30.48厘米', fromUnit: 'ft', toUnit: 'cm', value: 1 },
                { id: '4', from: '1英寸', to: '厘米', description: '1英寸 ≈ 2.54厘米', fromUnit: 'inch', toUnit: 'cm', value: 1 }
            ],
            weight: [
                { id: '1', from: '1千克', to: '克', description: '1千克 = 1000克', fromUnit: 'kg', toUnit: 'g', value: 1 },
                { id: '2', from: '1磅', to: '千克', description: '1磅 ≈ 0.45千克', fromUnit: 'lb', toUnit: 'kg', value: 1 },
                { id: '3', from: '1吨', to: '千克', description: '1吨 = 1000千克', fromUnit: 'ton', toUnit: 'kg', value: 1 },
                { id: '4', from: '1盎司', to: '克', description: '1盎司 ≈ 28.35克', fromUnit: 'oz', toUnit: 'g', value: 1 }
            ],
            temperature: [
                { id: '1', from: '0°C', to: '华氏度', description: '0°C = 32°F', fromUnit: 'celsius', toUnit: 'fahrenheit', value: 0 },
                { id: '2', from: '100°C', to: '华氏度', description: '100°C = 212°F', fromUnit: 'celsius', toUnit: 'fahrenheit', value: 100 },
                { id: '3', from: '37°C', to: '华氏度', description: '37°C ≈ 98.6°F', fromUnit: 'celsius', toUnit: 'fahrenheit', value: 37 },
                { id: '4', from: '0°C', to: '开尔文', description: '0°C = 273.15K', fromUnit: 'celsius', toUnit: 'kelvin', value: 0 }
            ],
            area: [
                { id: '1', from: '1平方米', to: '平方厘米', description: '1m² = 10000cm²', fromUnit: 'm2', toUnit: 'cm2', value: 1 },
                { id: '2', from: '1平方千米', to: '平方米', description: '1km² = 1000000m²', fromUnit: 'km2', toUnit: 'm2', value: 1 },
                { id: '3', from: '1英亩', to: '平方米', description: '1英亩 ≈ 4047m²', fromUnit: 'acre', toUnit: 'm2', value: 1 },
                { id: '4', from: '1平方英尺', to: '平方米', description: '1ft² ≈ 0.093m²', fromUnit: 'ft2', toUnit: 'm2', value: 1 }
            ],
            volume: [
                { id: '1', from: '1升', to: '毫升', description: '1升 = 1000毫升', fromUnit: 'l', toUnit: 'ml', value: 1 },
                { id: '2', from: '1立方米', to: '升', description: '1m³ = 1000升', fromUnit: 'm3', toUnit: 'l', value: 1 },
                { id: '3', from: '1加仑', to: '升', description: '1加仑 ≈ 3.79升', fromUnit: 'gallon', toUnit: 'l', value: 1 },
                { id: '4', from: '1杯', to: '毫升', description: '1杯 ≈ 237毫升', fromUnit: 'cup', toUnit: 'ml', value: 1 }
            ]
        };
        return quickMap[type] || [];
    },
    // 转换类型改变
    onTypeChange: function (e) {
        var type = e.currentTarget.dataset.type;
        this.setData({
            currentType: type,
            inputValue: '',
            outputValue: '0',
            fromUnitIndex: 0,
            toUnitIndex: 1
        });
        this.initConverter();
        logger_1.LoggerService.info('Conversion type changed to:', type);
    },
    // 输入值改变
    onInputChange: function (e) {
        var value = e.detail.value;
        this.setData({ inputValue: value });
        if (value) {
            this.performConversion();
        }
        else {
            this.setData({ outputValue: '0' });
        }
    },
    // 输入确认
    onInputConfirm: function () {
        this.performConversion();
    },
    // 源单位改变
    onFromUnitChange: function (e) {
        var index = parseInt(e.detail.value);
        this.setData({ fromUnitIndex: index });
        if (this.data.inputValue) {
            this.performConversion();
        }
    },
    // 目标单位改变
    onToUnitChange: function (e) {
        var index = parseInt(e.detail.value);
        this.setData({ toUnitIndex: index });
        if (this.data.inputValue) {
            this.performConversion();
        }
    },
    // 交换单位
    onSwapUnits: function () {
        var _a = this.data, fromUnitIndex = _a.fromUnitIndex, toUnitIndex = _a.toUnitIndex, outputValue = _a.outputValue;
        this.setData({
            fromUnitIndex: toUnitIndex,
            toUnitIndex: fromUnitIndex,
            inputValue: outputValue !== '0' ? outputValue : '',
            outputValue: '0'
        });
        if (this.data.inputValue) {
            this.performConversion();
        }
        logger_1.LoggerService.info('Units swapped');
    },
    // 执行转换
    performConversion: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, inputValue, fromUnits, toUnits, fromUnitIndex, toUnitIndex, currentType, inputNum, fromUnit, toUnit, result, formattedResult, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.data, inputValue = _a.inputValue, fromUnits = _a.fromUnits, toUnits = _a.toUnits, fromUnitIndex = _a.fromUnitIndex, toUnitIndex = _a.toUnitIndex, currentType = _a.currentType;
                        if (!inputValue || !fromUnits.length || !toUnits.length) {
                            return [2 /*return*/];
                        }
                        inputNum = parseFloat(inputValue);
                        if (isNaN(inputNum)) {
                            this.setData({ outputValue: '无效输入' });
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        fromUnit = fromUnits[fromUnitIndex];
                        toUnit = toUnits[toUnitIndex];
                        result = void 0;
                        if (currentType === 'temperature') {
                            // 温度转换需要特殊处理
                            result = this.convertTemperature(inputNum, fromUnit, toUnit);
                        }
                        else {
                            // 其他单位转换
                            result = this.convertUnit(inputNum, fromUnit, toUnit);
                        }
                        formattedResult = this.formatResult(result);
                        this.setData({ outputValue: formattedResult });
                        if (!(inputValue !== '' && formattedResult !== '0')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.saveToHistory(inputValue, formattedResult, fromUnit.name, toUnit.name)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        logger_1.LoggerService.info('Conversion completed:', {
                            input: inputValue + " " + fromUnit.name,
                            output: formattedResult + " " + toUnit.name
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _b.sent();
                        logger_1.LoggerService.error('Conversion error:', error_2);
                        this.setData({ outputValue: '转换错误' });
                        wx.showToast({
                            title: '转换失败',
                            icon: 'none',
                            duration: 2000
                        });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    // 单位转换（非温度）
    convertUnit: function (value, fromUnit, toUnit) {
        // 先转换到基础单位，再转换到目标单位
        var baseValue = value * fromUnit.factor;
        return baseValue / toUnit.factor;
    },
    // 温度转换
    convertTemperature: function (value, fromUnit, toUnit) {
        // 先转换到摄氏度
        var celsius;
        switch (fromUnit.id) {
            case 'celsius':
                celsius = value;
                break;
            case 'fahrenheit':
                celsius = (value - 32) * 5 / 9;
                break;
            case 'kelvin':
                celsius = value - 273.15;
                break;
            default:
                throw new Error('Unknown temperature unit');
        }
        // 从摄氏度转换到目标单位
        switch (toUnit.id) {
            case 'celsius':
                return celsius;
            case 'fahrenheit':
                return celsius * 9 / 5 + 32;
            case 'kelvin':
                return celsius + 273.15;
            default:
                throw new Error('Unknown temperature unit');
        }
    },
    // 格式化结果
    formatResult: function (result) {
        if (!isFinite(result)) {
            return '无穷大';
        }
        if (isNaN(result)) {
            return '未定义';
        }
        // 根据数值大小选择合适的精度
        var absResult = Math.abs(result);
        var precision;
        if (absResult >= 1000000) {
            precision = 2;
        }
        else if (absResult >= 1000) {
            precision = 3;
        }
        else if (absResult >= 1) {
            precision = 6;
        }
        else {
            precision = 8;
        }
        // 使用科学记数法处理极大或极小的数
        if (absResult > 1e12 || (absResult < 1e-6 && absResult > 0)) {
            return result.toExponential(4);
        }
        var rounded = parseFloat(result.toPrecision(precision));
        // 移除末尾的0
        return rounded.toString().replace(/\.?0+$/, '');
    },
    // 快捷转换
    onQuickConversion: function (e) {
        var conversion = e.currentTarget.dataset.conversion;
        var _a = this.data, fromUnits = _a.fromUnits, toUnits = _a.toUnits;
        // 找到对应的单位索引
        var fromIndex = fromUnits.findIndex(function (unit) { return unit.id === conversion.fromUnit; });
        var toIndex = toUnits.findIndex(function (unit) { return unit.id === conversion.toUnit; });
        if (fromIndex !== -1 && toIndex !== -1) {
            this.setData({
                inputValue: conversion.value.toString(),
                fromUnitIndex: fromIndex,
                toUnitIndex: toIndex
            });
            this.performConversion();
            wx.showToast({
                title: '已应用快捷转换',
                icon: 'success',
                duration: 1500
            });
        }
    },
    // 保存到历史记录
    saveToHistory: function (inputValue, outputValue, fromUnit, toUnit) {
        return __awaiter(this, void 0, void 0, function () {
            var history, now, historyItem, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        history = __spreadArrays(this.data.history);
                        now = new Date();
                        historyItem = {
                            id: Date.now().toString(),
                            type: this.data.currentType,
                            inputValue: inputValue,
                            outputValue: outputValue,
                            fromUnit: fromUnit,
                            toUnit: toUnit,
                            time: index_1.formatTime(now.getTime(), 'HH:mm:ss'),
                            timestamp: now.getTime()
                        };
                        history.unshift(historyItem);
                        // 限制历史记录数量
                        if (history.length > 50) {
                            history.splice(50);
                        }
                        this.setData({ history: history });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        // 保存到数据管理器
                        return [4 /*yield*/, dataManager_1.dataManager.setCacheData('converter_history', history)];
                    case 2:
                        // 保存到数据管理器
                        _a.sent();
                        // 同时记录转换操作
                        return [4 /*yield*/, dataManager_1.dataManager.addUsageRecord({
                                toolId: 'converter',
                                toolName: '单位转换',
                                category: '工具',
                                data: {
                                    type: this.data.currentType,
                                    inputValue: inputValue,
                                    outputValue: outputValue,
                                    fromUnit: fromUnit,
                                    toUnit: toUnit
                                }
                            })];
                    case 3:
                        // 同时记录转换操作
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        logger_1.LoggerService.error('Failed to save converter history:', error_3);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    // 加载历史记录
    loadHistory: function () {
        return __awaiter(this, void 0, void 0, function () {
            var history, error_4, history;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, dataManager_1.dataManager.getCacheData('converter_history')];
                    case 1:
                        history = (_a.sent()) || [];
                        this.setData({ history: history });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        logger_1.LoggerService.error('Failed to load converter history:', error_4);
                        history = storage_1.StorageService.get('converter_history') || [];
                        this.setData({ history: history });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // 选择历史记录
    onSelectHistory: function (e) {
        var _this = this;
        var item = e.currentTarget.dataset.item;
        // const { fromUnits, toUnits } = this.data;
        // 如果历史记录的类型与当前类型不同，先切换类型
        if (item.type !== this.data.currentType) {
            this.setData({ currentType: item.type });
            this.initConverter();
            // 等待数据更新后再设置值
            setTimeout(function () {
                _this.applyHistoryItem(item);
            }, 100);
        }
        else {
            this.applyHistoryItem(item);
        }
    },
    // 应用历史记录项
    applyHistoryItem: function (item) {
        var _a = this.data, fromUnits = _a.fromUnits, toUnits = _a.toUnits;
        // 找到对应的单位索引
        var fromIndex = fromUnits.findIndex(function (unit) { return unit.name === item.fromUnit; });
        var toIndex = toUnits.findIndex(function (unit) { return unit.name === item.toUnit; });
        if (fromIndex !== -1 && toIndex !== -1) {
            this.setData({
                inputValue: item.inputValue,
                fromUnitIndex: fromIndex,
                toUnitIndex: toIndex
            });
            this.performConversion();
            wx.showToast({
                title: '已选择历史记录',
                icon: 'success',
                duration: 1500
            });
        }
    },
    // 清空历史记录
    onClearHistory: function () {
        var _this = this;
        wx.showModal({
            title: '确认清空',
            content: '确定要清空所有转换历史吗？',
            success: function (res) { return __awaiter(_this, void 0, void 0, function () {
                var error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!res.confirm) return [3 /*break*/, 5];
                            this.setData({ history: [] });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, dataManager_1.dataManager.setCacheData('converter_history', [])];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_5 = _a.sent();
                            logger_1.LoggerService.error('Failed to clear converter history:', error_5);
                            return [3 /*break*/, 4];
                        case 4:
                            wx.showToast({
                                title: '历史记录已清空',
                                icon: 'success',
                                duration: 1500
                            });
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            }); }
        });
    },
    // 复制结果
    onCopyResult: function () {
        var outputValue = this.data.outputValue;
        wx.setClipboardData({
            data: outputValue,
            success: function () {
                wx.showToast({
                    title: '已复制到剪贴板',
                    icon: 'success',
                    duration: 1500
                });
                logger_1.LoggerService.info('Result copied to clipboard:', outputValue);
            },
            fail: function (error) {
                logger_1.LoggerService.error('Failed to copy result:', error);
                wx.showToast({
                    title: '复制失败',
                    icon: 'none',
                    duration: 1500
                });
            }
        });
    },
    /**
     * 检查收藏状态
     */
    checkFavoriteStatus: function () {
        return __awaiter(this, void 0, void 0, function () {
            var isFavorite, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, dataManager_1.dataManager.isFavorite('converter')];
                    case 1:
                        isFavorite = _a.sent();
                        this.setData({ isFavorite: isFavorite });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.error('[Converter] 检查收藏状态失败:', error_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 切换收藏状态
     */
    onToggleFavorite: function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, dataManager_1.dataManager.toggleFavorite('converter')];
                    case 1:
                        result = _a.sent();
                        if (result.success) {
                            this.setData({ isFavorite: result.isFavorite });
                            wx.showToast({
                                title: result.isFavorite ? '已添加到收藏' : '已取消收藏',
                                icon: 'success',
                                duration: 1500
                            });
                        }
                        else {
                            wx.showToast({
                                title: result.message || '操作失败',
                                icon: 'error'
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        console.error('[Converter] 切换收藏失败:', error_7);
                        wx.showToast({
                            title: '操作失败',
                            icon: 'error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
});
