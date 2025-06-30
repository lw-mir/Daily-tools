"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("../../../utils/storage");
const logger_1 = require("../../../utils/logger");
const index_1 = require("../../../utils/index");
const dataManager_1 = require("../../../utils/dataManager");
// 单位定义
const UNIT_DEFINITIONS = {
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
            { id: 'volume', name: '体积', icon: '🥤' }
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
        loadingText: '转换中...'
    },
    async onLoad() {
        logger_1.LoggerService.info('Converter page loaded');
        this.initConverter();
        await this.loadHistory();
        // 添加到最近使用工具
        try {
            await dataManager_1.dataManager.addRecentTool('converter');
            // 记录使用历史
            await dataManager_1.dataManager.addUsageRecord({
                toolId: 'converter',
                toolName: '单位转换',
                category: '工具'
            });
        }
        catch (error) {
            logger_1.LoggerService.error('Failed to record tool usage:', error);
        }
    },
    onShow() {
        // 恢复上次的转换状态
        const lastState = storage_1.StorageService.get('converter_state');
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
    onHide() {
        // 保存当前转换状态
        storage_1.StorageService.set('converter_state', {
            currentType: this.data.currentType,
            inputValue: this.data.inputValue,
            fromUnitIndex: this.data.fromUnitIndex,
            toUnitIndex: this.data.toUnitIndex
        });
    },
    onUnload() {
        logger_1.LoggerService.info('Converter page unloaded');
    },
    // 初始化转换器
    initConverter() {
        const { currentType } = this.data;
        const units = UNIT_DEFINITIONS[currentType] || [];
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
    getQuickConversions(type) {
        const quickMap = {
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
    onTypeChange(e) {
        const type = e.currentTarget.dataset.type;
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
    onInputChange(e) {
        const value = e.detail.value;
        this.setData({ inputValue: value });
        if (value) {
            this.performConversion();
        }
        else {
            this.setData({ outputValue: '0' });
        }
    },
    // 输入确认
    onInputConfirm() {
        this.performConversion();
    },
    // 源单位改变
    onFromUnitChange(e) {
        const index = parseInt(e.detail.value);
        this.setData({ fromUnitIndex: index });
        if (this.data.inputValue) {
            this.performConversion();
        }
    },
    // 目标单位改变
    onToUnitChange(e) {
        const index = parseInt(e.detail.value);
        this.setData({ toUnitIndex: index });
        if (this.data.inputValue) {
            this.performConversion();
        }
    },
    // 交换单位
    onSwapUnits() {
        const { fromUnitIndex, toUnitIndex, outputValue } = this.data;
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
    async performConversion() {
        const { inputValue, fromUnits, toUnits, fromUnitIndex, toUnitIndex, currentType } = this.data;
        if (!inputValue || !fromUnits.length || !toUnits.length) {
            return;
        }
        const inputNum = parseFloat(inputValue);
        if (isNaN(inputNum)) {
            this.setData({ outputValue: '无效输入' });
            return;
        }
        try {
            const fromUnit = fromUnits[fromUnitIndex];
            const toUnit = toUnits[toUnitIndex];
            let result;
            if (currentType === 'temperature') {
                // 温度转换需要特殊处理
                result = this.convertTemperature(inputNum, fromUnit, toUnit);
            }
            else {
                // 其他单位转换
                result = this.convertUnit(inputNum, fromUnit, toUnit);
            }
            const formattedResult = this.formatResult(result);
            this.setData({ outputValue: formattedResult });
            // 保存到历史记录
            if (inputValue !== '' && formattedResult !== '0') {
                await this.saveToHistory(inputValue, formattedResult, fromUnit.name, toUnit.name);
            }
            logger_1.LoggerService.info('Conversion completed:', {
                input: `${inputValue} ${fromUnit.name}`,
                output: `${formattedResult} ${toUnit.name}`
            });
        }
        catch (error) {
            logger_1.LoggerService.error('Conversion error:', error);
            this.setData({ outputValue: '转换错误' });
            wx.showToast({
                title: '转换失败',
                icon: 'none',
                duration: 2000
            });
        }
    },
    // 单位转换（非温度）
    convertUnit(value, fromUnit, toUnit) {
        // 先转换到基础单位，再转换到目标单位
        const baseValue = value * fromUnit.factor;
        return baseValue / toUnit.factor;
    },
    // 温度转换
    convertTemperature(value, fromUnit, toUnit) {
        // 先转换到摄氏度
        let celsius;
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
    formatResult(result) {
        if (!isFinite(result)) {
            return '无穷大';
        }
        if (isNaN(result)) {
            return '未定义';
        }
        // 根据数值大小选择合适的精度
        const absResult = Math.abs(result);
        let precision;
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
        const rounded = parseFloat(result.toPrecision(precision));
        // 移除末尾的0
        return rounded.toString().replace(/\.?0+$/, '');
    },
    // 快捷转换
    onQuickConversion(e) {
        const conversion = e.currentTarget.dataset.conversion;
        const { fromUnits, toUnits } = this.data;
        // 找到对应的单位索引
        const fromIndex = fromUnits.findIndex(unit => unit.id === conversion.fromUnit);
        const toIndex = toUnits.findIndex(unit => unit.id === conversion.toUnit);
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
    async saveToHistory(inputValue, outputValue, fromUnit, toUnit) {
        const history = [...this.data.history];
        const now = new Date();
        const historyItem = {
            id: Date.now().toString(),
            type: this.data.currentType,
            inputValue,
            outputValue,
            fromUnit,
            toUnit,
            time: index_1.formatTime(now.getTime(), 'HH:mm:ss'),
            timestamp: now.getTime()
        };
        history.unshift(historyItem);
        // 限制历史记录数量
        if (history.length > 50) {
            history.splice(50);
        }
        this.setData({ history });
        try {
            // 保存到数据管理器
            await dataManager_1.dataManager.setCacheData('converter_history', history);
            // 同时记录转换操作
            await dataManager_1.dataManager.addUsageRecord({
                toolId: 'converter',
                toolName: '单位转换',
                category: '工具',
                data: {
                    type: this.data.currentType,
                    inputValue,
                    outputValue,
                    fromUnit,
                    toUnit
                }
            });
        }
        catch (error) {
            logger_1.LoggerService.error('Failed to save converter history:', error);
        }
    },
    // 加载历史记录
    async loadHistory() {
        try {
            const history = await dataManager_1.dataManager.getCacheData('converter_history') || [];
            this.setData({ history });
        }
        catch (error) {
            logger_1.LoggerService.error('Failed to load converter history:', error);
            // 回退到本地存储
            const history = storage_1.StorageService.get('converter_history') || [];
            this.setData({ history });
        }
    },
    // 选择历史记录
    onSelectHistory(e) {
        const item = e.currentTarget.dataset.item;
        // const { fromUnits, toUnits } = this.data;
        // 如果历史记录的类型与当前类型不同，先切换类型
        if (item.type !== this.data.currentType) {
            this.setData({ currentType: item.type });
            this.initConverter();
            // 等待数据更新后再设置值
            setTimeout(() => {
                this.applyHistoryItem(item);
            }, 100);
        }
        else {
            this.applyHistoryItem(item);
        }
    },
    // 应用历史记录项
    applyHistoryItem(item) {
        const { fromUnits, toUnits } = this.data;
        // 找到对应的单位索引
        const fromIndex = fromUnits.findIndex(unit => unit.name === item.fromUnit);
        const toIndex = toUnits.findIndex(unit => unit.name === item.toUnit);
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
    onClearHistory() {
        wx.showModal({
            title: '确认清空',
            content: '确定要清空所有转换历史吗？',
            success: async (res) => {
                if (res.confirm) {
                    this.setData({ history: [] });
                    try {
                        await dataManager_1.dataManager.setCacheData('converter_history', []);
                    }
                    catch (error) {
                        logger_1.LoggerService.error('Failed to clear converter history:', error);
                    }
                    wx.showToast({
                        title: '历史记录已清空',
                        icon: 'success',
                        duration: 1500
                    });
                }
            }
        });
    },
    // 复制结果
    onCopyResult() {
        const { outputValue } = this.data;
        wx.setClipboardData({
            data: outputValue,
            success: () => {
                wx.showToast({
                    title: '已复制到剪贴板',
                    icon: 'success',
                    duration: 1500
                });
                logger_1.LoggerService.info('Result copied to clipboard:', outputValue);
            },
            fail: (error) => {
                logger_1.LoggerService.error('Failed to copy result:', error);
                wx.showToast({
                    title: '复制失败',
                    icon: 'none',
                    duration: 1500
                });
            }
        });
    }
});
