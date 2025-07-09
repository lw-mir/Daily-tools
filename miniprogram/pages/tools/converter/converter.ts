import { StorageService } from '../../../utils/storage';
import { LoggerService } from '../../../utils/logger';
import { formatTime } from '../../../utils/index';
import { DataManager } from '../../../utils/dataManager';

const dataManager = DataManager.getInstance();

interface ConversionType {
  id: string;
  name: string;
  icon: string;
  units: Unit[];
}

interface Unit {
  id: string;
  name: string;
  symbol: string;
  factor: number; // 转换为基准单位的系数
  offset?: number; // 偏移量（用于温度转换）
}

interface ConversionHistory {
  id: string;
  type: string;
  inputValue: string;
  outputValue: string;
  fromUnit: string;
  toUnit: string;
  time: string;
  timestamp: number;
}

interface QuickConversion {
  id: string;
  from: string;
  to: string;
  description: string;
  type: string;
  fromUnit: string;
  toUnit: string;
}

interface ConverterData {
  conversionTypes: ConversionType[];
  currentType: string;
  inputValue: string;
  outputValue: string;
  fromUnitIndex: number;
  toUnitIndex: number;
  fromUnits: Unit[];
  toUnits: Unit[];
  history: ConversionHistory[];
  quickConversions: QuickConversion[];
  isLoading: boolean;
  loadingText: string;
  isFavorite: boolean;
}

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
          { id: 'f', name: '华氏度', symbol: '°F', factor: 5/9, offset: -32 },
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
    fromUnitIndex: 3, // 默认选择米
    toUnitIndex: 0,   // 默认选择毫米
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
  } as ConverterData,

  async onLoad() {
    LoggerService.info('Unit Converter page loaded');
    this.initializeConverter();
    await this.loadHistory();
    await this.checkFavoriteStatus();
    
    try {
      await dataManager.addRecentTool('unit-converter');
      await dataManager.addUsageRecord({
        toolId: 'unit-converter',
        toolName: '单位转换',
        category: '工具'
      });
    } catch (error) {
      LoggerService.error('Failed to record tool usage:', error);
    }
  },

  onShow() {
    const lastState = StorageService.get('unit_converter_state');
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

  onHide() {
    StorageService.set('unit_converter_state', {
      currentType: this.data.currentType,
      inputValue: this.data.inputValue,
      fromUnitIndex: this.data.fromUnitIndex,
      toUnitIndex: this.data.toUnitIndex
    });
  },

  onUnload() {
    LoggerService.info('Unit Converter page unloaded');
  },

  initializeConverter() {
    this.updateUnits();
    this.performConversion();
  },

  updateUnits() {
    const currentTypeData = this.data.conversionTypes.find(type => type.id === this.data.currentType);
    if (currentTypeData) {
      this.setData({
        fromUnits: currentTypeData.units,
        toUnits: currentTypeData.units
      });
    }
  },

  onTypeChange(e: WechatMiniprogram.TouchEvent) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      currentType: type,
      inputValue: '',
      outputValue: '0',
      fromUnitIndex: 0,
      toUnitIndex: 1
    });
    this.updateUnits();
  },

  onInputChange(e: WechatMiniprogram.Input) {
    const value = e.detail.value;
    this.setData({
      inputValue: value
    });
    this.performConversion();
  },

  onInputConfirm() {
    this.performConversion();
  },

  onFromUnitChange(e: WechatMiniprogram.PickerChange) {
    const index = parseInt(e.detail.value as string);
    this.setData({
      fromUnitIndex: index
    });
    this.performConversion();
  },

  onToUnitChange(e: WechatMiniprogram.PickerChange) {
    const index = parseInt(e.detail.value as string);
    this.setData({
      toUnitIndex: index
    });
    this.performConversion();
  },

  onSwapUnits() {
    const { fromUnitIndex, toUnitIndex, inputValue, outputValue } = this.data;
    this.setData({
      fromUnitIndex: toUnitIndex,
      toUnitIndex: fromUnitIndex,
      inputValue: outputValue,
      outputValue: inputValue
    });
    this.performConversion();
  },

  performConversion() {
    const { inputValue, fromUnitIndex, toUnitIndex, fromUnits, toUnits, currentType } = this.data;
    
    if (!inputValue || inputValue === '' || isNaN(parseFloat(inputValue))) {
      this.setData({ outputValue: '0' });
      return;
    }

    const inputNum = parseFloat(inputValue);
    const fromUnit = fromUnits[fromUnitIndex];
    const toUnit = toUnits[toUnitIndex];

    if (!fromUnit || !toUnit) {
      this.setData({ outputValue: '0' });
      return;
    }

    let result: number;

    if (currentType === 'temperature') {
      // 温度转换需要特殊处理
      result = this.convertTemperature(inputNum, fromUnit, toUnit);
    } else {
      // 其他单位转换
      // 先转换为基准单位，再转换为目标单位
      const baseValue = inputNum * fromUnit.factor;
      result = baseValue / toUnit.factor;
    }

    // 格式化输出结果
    const formattedResult = this.formatResult(result);
    this.setData({ outputValue: formattedResult });

    // 添加到历史记录
    if (inputValue && result !== 0) {
      this.addToHistory(inputValue, formattedResult, fromUnit.name, toUnit.name);
    }
  },

  convertTemperature(value: number, fromUnit: Unit, toUnit: Unit): number {
    // 先转换为摄氏度
    let celsius: number;
    if (fromUnit.id === 'c') {
      celsius = value;
    } else if (fromUnit.id === 'f') {
      celsius = (value - 32) * 5/9;
    } else if (fromUnit.id === 'k') {
      celsius = value - 273.15;
    } else {
      celsius = value;
    }

    // 再从摄氏度转换为目标单位
    let result: number;
    if (toUnit.id === 'c') {
      result = celsius;
    } else if (toUnit.id === 'f') {
      result = celsius * 9/5 + 32;
    } else if (toUnit.id === 'k') {
      result = celsius + 273.15;
    } else {
      result = celsius;
    }

    return result;
  },

  formatResult(value: number): string {
    if (Math.abs(value) < 0.0001) {
      return value.toExponential(3);
    } else if (Math.abs(value) >= 1000000) {
      return value.toExponential(3);
    } else if (Math.abs(value) >= 1000) {
      return value.toFixed(2);
    } else if (Math.abs(value) >= 1) {
      return value.toFixed(4);
    } else {
      return value.toFixed(6);
    }
  },

  onCopyResult() {
    const { outputValue } = this.data;
    if (outputValue && outputValue !== '0') {
      wx.setClipboardData({
        data: outputValue,
        success: () => {
          wx.showToast({
            title: '已复制到剪贴板',
            icon: 'success'
          });
        }
      });
    }
  },

  onQuickConversion(e: WechatMiniprogram.TouchEvent) {
    const conversion = e.currentTarget.dataset.conversion;
    if (!conversion) return;

    // 切换到对应的转换类型
    this.setData({
      currentType: conversion.type
    });
    this.updateUnits();

    // 找到对应的单位索引
    const fromIndex = this.data.fromUnits.findIndex(unit => unit.id === conversion.fromUnit);
    const toIndex = this.data.toUnits.findIndex(unit => unit.id === conversion.toUnit);

    // 设置转换参数
    this.setData({
      fromUnitIndex: fromIndex >= 0 ? fromIndex : 0,
      toUnitIndex: toIndex >= 0 ? toIndex : 1,
      inputValue: conversion.type === 'temperature' ? '0' : '1'
    });

    this.performConversion();
  },

  addToHistory(inputValue: string, outputValue: string, fromUnit: string, toUnit: string) {
    const historyItem: ConversionHistory = {
      id: Date.now().toString(),
      type: this.data.currentType,
      inputValue,
      outputValue,
      fromUnit,
      toUnit,
      time: formatTime(Date.now()),
      timestamp: Date.now()
    };

    const history = [historyItem, ...this.data.history.slice(0, 19)]; // 保留最近20条记录
    this.setData({ history });
    this.saveHistoryToStorage();
  },

  onSelectHistory(e: WechatMiniprogram.TouchEvent) {
    const item = e.currentTarget.dataset.item;
    if (!item) return;

    // 切换到对应的转换类型
    this.setData({
      currentType: item.type
    });
    this.updateUnits();

    // 找到对应的单位索引
    const fromIndex = this.data.fromUnits.findIndex(unit => unit.name === item.fromUnit);
    const toIndex = this.data.toUnits.findIndex(unit => unit.name === item.toUnit);

    // 设置转换参数
    this.setData({
      fromUnitIndex: fromIndex >= 0 ? fromIndex : 0,
      toUnitIndex: toIndex >= 0 ? toIndex : 1,
      inputValue: item.inputValue
    });

    this.performConversion();
  },

  onClearHistory() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有转换历史吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ history: [] });
          this.saveHistoryToStorage();
          wx.showToast({
            title: '历史记录已清空',
            icon: 'success'
          });
        }
      }
    });
  },

  async loadHistory() {
    try {
      const history = StorageService.get('unit_converter_history') || [];
      this.setData({ history });
    } catch (error) {
      LoggerService.error('Failed to load history:', error);
    }
  },

  async saveHistoryToStorage() {
    try {
      StorageService.set('unit_converter_history', this.data.history);
    } catch (error) {
      LoggerService.error('Failed to save history:', error);
    }
  },

  async checkFavoriteStatus() {
    try {
      const favorites = StorageService.get('user_favorites') || [];
      const isFavorite = favorites.includes('unit-converter');
      this.setData({ isFavorite });
    } catch (error) {
      LoggerService.error('Failed to check favorite status:', error);
    }
  },

  async onToggleFavorite() {
    try {
      const favorites = StorageService.get('user_favorites') || [];
      const toolId = 'unit-converter';
      const isFavorite = favorites.includes(toolId);

      if (isFavorite) {
        const index = favorites.indexOf(toolId);
        favorites.splice(index, 1);
        wx.showToast({
          title: '已取消收藏',
          icon: 'success'
        });
      } else {
        favorites.push(toolId);
        wx.showToast({
          title: '已添加到收藏',
          icon: 'success'
        });
      }

      StorageService.set('user_favorites', favorites);
      this.setData({ isFavorite: !isFavorite });

      await dataManager.addUsageRecord({
        toolId: 'unit-converter',
        toolName: '单位转换',
        category: '收藏'
      });
    } catch (error) {
      LoggerService.error('Failed to toggle favorite:', error);
      wx.showToast({
        title: '操作失败',
        icon: 'error'
      });
    }
  }
}); 