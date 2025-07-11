"use strict";
/// <reference path="../../../../typings/index.d.ts" />
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
var dataManager_1 = require("../../../utils/dataManager");
Page({
    data: {
        foodOptions: [],
        wheelRotation: -90,
        isSpinning: false,
        lastResult: null,
        showHistoryModal: false,
        historyList: [],
        showCustomModal: false,
        showEditModal: false,
        customForm: {
            name: '',
            emoji: '',
            type: '',
            description: ''
        },
        editingOption: null,
        showManageModal: false,
        isFavorite: false
    },
    onLoad: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('吃什么？转盘工具页面加载');
                        this.initFoodOptions();
                        this.loadHistory();
                        return [4 /*yield*/, this.checkFavoriteStatus()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, dataManager_1.dataManager.addUsageRecord({
                                toolId: 'foodwheel',
                                toolName: '吃什么转盘',
                                category: 'entertainment'
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    onShow: function () {
        // 页面显示时记录使用历史
        this.recordUsage();
    },
    /**
     * 初始化餐饮选项数据
     */
    initFoodOptions: function () {
        try {
            // 先尝试加载自定义选项
            var customOptions = this.loadCustomOptions();
            if (customOptions && customOptions.length > 0) {
                this.updateWheelRotations(customOptions);
                this.setData({
                    foodOptions: customOptions
                });
                return;
            }
            // 如果没有自定义选项，使用默认选项
            this.loadDefaultOptions();
        }
        catch (error) {
            console.error('初始化餐饮选项失败:', error);
            this.loadDefaultOptions(); // 失败时使用默认选项
        }
    },
    /**
     * 加载默认餐饮选项
     */
    loadDefaultOptions: function () {
        var defaultFoods = [
            { id: 1, name: '川菜', emoji: '🌶️', type: '中式', description: '麻辣鲜香的川菜，让味蕾燃烧起来！' },
            { id: 2, name: '粤菜', emoji: '🦐', type: '中式', description: '清淡鲜美的粤菜，营养丰富又健康。' },
            { id: 3, name: '火锅', emoji: '🍲', type: '中式', description: '热腾腾的火锅，和朋友一起享受美好时光。' },
            { id: 4, name: '烧烤', emoji: '🍖', type: '烧烤', description: '香气四溢的烧烤，夜宵的绝佳选择。' },
            { id: 5, name: '日料', emoji: '🍣', type: '日式', description: '精致的日本料理，体验异国风味。' },
            { id: 6, name: '韩料', emoji: '🥘', type: '韩式', description: '韩式料理，泡菜和烤肉的完美组合。' },
            { id: 7, name: '西餐', emoji: '🥩', type: '西式', description: '优雅的西式料理，享受精致用餐体验。' },
            { id: 8, name: '意面', emoji: '🍝', type: '西式', description: '浓郁的意大利面，简单却美味。' },
            { id: 9, name: '披萨', emoji: '🍕', type: '西式', description: '热乎乎的披萨，分享快乐的美食。' },
            { id: 10, name: '汉堡', emoji: '🍔', type: '快餐', description: '经典的汉堡，快餐中的永恒选择。' },
            { id: 11, name: '面条', emoji: '🍜', type: '中式', description: '一碗热气腾腾的面条，温暖又饱腹。' },
            { id: 12, name: '饺子', emoji: '🥟', type: '中式', description: '传统的饺子，家的味道。' }
        ];
        // 生成颜色和旋转角度
        var colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA'
        ];
        var segmentAngle = 360 / defaultFoods.length;
        var foodOptions = defaultFoods.map(function (food, index) { return (__assign(__assign({}, food), { color: colors[index % colors.length], 
            // 从12点钟方向开始，第一个选项在12点钟位置（-90度补偿CSS旋转）
            // 每个选项按顺序顺时针分布
            rotation: index * segmentAngle, isCustom: false })); });
        this.setData({
            foodOptions: foodOptions
        });
    },
    /**
     * 更新转盘旋转角度
     */
    updateWheelRotations: function (options) {
        var colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#F8C471'
        ];
        var segmentAngle = 360 / options.length;
        console.log('=== 更新转盘角度分布 ===');
        console.log('选项总数:', options.length);
        console.log('每个扇形角度:', segmentAngle.toFixed(1), '度');
        options.forEach(function (option, index) {
            // 从12点钟方向开始，第一个选项在12点钟位置
            // 每个选项按顺序顺时针分布
            option.rotation = index * segmentAngle;
            if (!option.color) {
                option.color = colors[index % colors.length];
            }
            console.log("\u9009\u9879" + (index + 1) + ": " + option.name + " " + option.emoji + " - \u89D2\u5EA6: " + option.rotation.toFixed(1) + "\u00B0 - \u989C\u8272: " + option.color);
        });
        console.log('=====================');
    },
    /**
     * 加载自定义选项
     */
    loadCustomOptions: function () {
        try {
            var customOptions = wx.getStorageSync('foodwheel_custom_options');
            return customOptions || null;
        }
        catch (error) {
            console.error('加载自定义选项失败:', error);
            return null;
        }
    },
    /**
     * 保存自定义选项
     */
    saveCustomOptions: function (options) {
        try {
            wx.setStorageSync('foodwheel_custom_options', options);
        }
        catch (error) {
            console.error('保存自定义选项失败:', error);
            wx.showToast({
                title: '保存失败',
                icon: 'error'
            });
        }
    },
    /**
     * 转动转盘
     */
    spinWheel: function () {
        var _this = this;
        if (this.data.isSpinning) {
            return;
        }
        var foodOptions = this.data.foodOptions;
        if (!foodOptions || foodOptions.length === 0) {
            wx.showToast({
                title: '暂无餐饮选项',
                icon: 'none'
            });
            return;
        }
        console.log('开始转动转盘');
        this.setData({
            isSpinning: true,
            lastResult: null
        });
        // 计算随机停止位置
        var _a = this.calculateSpinResult(), finalRotation = _a.finalRotation, selectedFood = _a.selectedFood;
        // 执行转盘动画
        this.setData({
            wheelRotation: finalRotation
        });
        // 添加震动反馈
        wx.vibrateShort({
            type: 'medium'
        }).catch(function (err) {
            console.log('震动反馈失败:', err);
        });
        // 动画完成后显示结果
        setTimeout(function () {
            _this.setData({
                isSpinning: false,
                lastResult: selectedFood
            });
            // 保存到历史记录
            _this.saveToHistory(selectedFood);
            console.log('转盘停止，选中:', selectedFood.name);
        }, 3000); // 3秒动画时间
    },
    /**
     * 计算转盘停止结果
     */
    calculateSpinResult: function () {
        var foodOptions = this.data.foodOptions;
        var segmentAngle = 360 / foodOptions.length;
        // 生成随机旋转圈数（3-6圈）和最终角度
        var baseRotations = Math.floor(Math.random() * 4) + 3; // 3-6圈
        var randomAngle = Math.random() * 360;
        var totalRotation = this.data.wheelRotation + baseRotations * 360 + randomAngle;
        // 计算转盘最终停止的角度，考虑初始-90度偏移
        var finalAngle = (totalRotation + 90) % 360; // 加90度补偿初始偏移
        // 指针固定在12点钟方向
        // 转盘从12点钟方向开始，第一个选项在12点钟位置
        // 计算指针相对于转盘的位置
        var pointerRelativeAngle = (360 - finalAngle) % 360;
        // 计算指针指向哪个扇形区域
        var selectedIndex = Math.floor(pointerRelativeAngle / segmentAngle);
        // 确保索引在有效范围内
        var validIndex = selectedIndex >= foodOptions.length ? 0 : selectedIndex;
        var selectedFood = foodOptions[validIndex];
        // 详细调试信息
        console.log('=== 转盘计算详情（12点钟起始）===');
        console.log('总旋转角度:', totalRotation);
        console.log('最终停止角度（补偿后）:', finalAngle);
        console.log('指针相对转盘角度:', pointerRelativeAngle);
        console.log('扇形角度:', segmentAngle);
        console.log('选中索引:', validIndex);
        console.log('选中食物:', selectedFood.name, selectedFood.emoji);
        console.log('');
        // 打印扇形区域分布（从12点钟开始顺时针）
        console.log('扇形区域分布（从12点钟开始顺时针）:');
        foodOptions.forEach(function (food, index) {
            var startAngle = index * segmentAngle;
            var endAngle = (index + 1) * segmentAngle;
            var isSelected = index === validIndex;
            console.log("\u7D22\u5F15" + index + ": " + food.name + " " + food.emoji + " - \u89D2\u5EA6\u8303\u56F4: " + startAngle.toFixed(1) + "\u00B0-" + endAngle.toFixed(1) + "\u00B0 " + (isSelected ? '← 选中' : ''));
        });
        console.log('指针相对角度:', pointerRelativeAngle.toFixed(1), '°');
        console.log('==================');
        return {
            finalRotation: totalRotation,
            selectedFood: selectedFood
        };
    },
    /**
     * 保存结果到历史记录
     */
    saveToHistory: function (food) {
        try {
            var now = new Date();
            var timeString = now.getMonth() + 1 + "\u6708" + now.getDate() + "\u65E5 " + now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
            var historyRecord = {
                id: Date.now(),
                name: food.name,
                emoji: food.emoji,
                description: food.description,
                timestamp: now.getTime(),
                timeString: timeString
            };
            var historyList = __spreadArrays([historyRecord], this.data.historyList);
            // 只保留最近50条记录
            if (historyList.length > 50) {
                historyList.splice(50);
            }
            this.setData({
                historyList: historyList
            });
            // 保存到本地存储
            wx.setStorageSync('foodwheel_history', historyList);
        }
        catch (error) {
            console.error('保存历史记录失败:', error);
        }
    },
    /**
     * 加载历史记录
     */
    loadHistory: function () {
        try {
            var historyList = wx.getStorageSync('foodwheel_history') || [];
            this.setData({
                historyList: historyList
            });
        }
        catch (error) {
            console.error('加载历史记录失败:', error);
        }
    },
    /**
     * 显示历史记录弹窗
     */
    showHistory: function () {
        this.setData({
            showHistoryModal: true
        });
    },
    /**
     * 隐藏历史记录弹窗
     */
    hideHistory: function () {
        this.setData({
            showHistoryModal: false
        });
    },
    /**
     * 阻止事件冒泡
     */
    stopPropagation: function () {
        // 阻止点击弹窗内容时关闭弹窗
    },
    /**
     * 显示自定义选项管理
     */
    customizeOptions: function () {
        this.setData({
            showManageModal: true
        });
    },
    /**
     * 隐藏管理弹窗
     */
    hideManageModal: function () {
        this.setData({
            showManageModal: false
        });
    },
    /**
     * 显示添加自定义选项弹窗
     */
    showAddCustom: function () {
        this.setData({
            showCustomModal: true,
            // 确保表单为空状态
            customForm: {
                name: '',
                emoji: '',
                type: '',
                description: ''
            }
        });
    },
    /**
     * 隐藏自定义选项弹窗
     */
    hideCustomModal: function () {
        this.setData({
            showCustomModal: false,
            // 取消时清空表单数据
            customForm: {
                name: '',
                emoji: '',
                type: '',
                description: ''
            }
        });
    },
    /**
     * 表单输入处理
     */
    onFormInput: function (e) {
        var _a;
        var field = e.currentTarget.dataset.field;
        var value = e.detail.value;
        if (field) {
            this.setData((_a = {},
                _a["customForm." + field] = value,
                _a));
        }
    },
    /**
     * 添加自定义选项
     */
    addCustomOption: function () {
        var _a = this.data.customForm, name = _a.name, emoji = _a.emoji, type = _a.type, description = _a.description;
        if (!name.trim()) {
            wx.showToast({
                title: '请输入餐饮名称',
                icon: 'none'
            });
            return;
        }
        if (!emoji.trim()) {
            wx.showToast({
                title: '请输入表情符号',
                icon: 'none'
            });
            return;
        }
        // 检查是否已存在相同名称的选项
        var existingOption = this.data.foodOptions.find(function (option) {
            return option.name.trim().toLowerCase() === name.trim().toLowerCase();
        });
        if (existingOption) {
            wx.showToast({
                title: '该餐饮选项已存在',
                icon: 'none'
            });
            return;
        }
        var newOption = {
            id: Date.now(),
            name: name.trim(),
            emoji: emoji.trim(),
            type: type.trim() || '自定义',
            description: description.trim() || "\u7F8E\u5473\u7684" + name.trim(),
            color: '',
            rotation: 0,
            isCustom: true
        };
        // 将新选项添加到数组末尾，保持添加顺序
        var foodOptions = __spreadArrays(this.data.foodOptions, [newOption]);
        // 重新计算所有选项的转盘位置，确保按顺序均等分布
        this.updateWheelRotations(foodOptions);
        this.setData({
            foodOptions: foodOptions,
            showCustomModal: false,
            // 清空表单
            customForm: {
                name: '',
                emoji: '',
                type: '',
                description: ''
            }
        });
        // 保存自定义选项到本地存储
        this.saveCustomOptions(foodOptions);
        wx.showToast({
            title: '添加成功',
            icon: 'success'
        });
        console.log('添加自定义选项成功:', newOption.name, '当前选项总数:', foodOptions.length);
    },
    /**
     * 显示编辑选项弹窗
     */
    showEditOption: function (e) {
        var option = e.currentTarget.dataset.option;
        if (option) {
            this.setData({
                showEditModal: true,
                editingOption: option,
                customForm: {
                    name: option.name,
                    emoji: option.emoji,
                    type: option.type,
                    description: option.description
                }
            });
        }
    },
    /**
     * 隐藏编辑弹窗
     */
    hideEditModal: function () {
        this.setData({
            showEditModal: false,
            editingOption: null,
            // 取消编辑时清空表单数据
            customForm: {
                name: '',
                emoji: '',
                type: '',
                description: ''
            }
        });
    },
    /**
     * 保存编辑
     */
    saveEdit: function () {
        var _a = this.data.customForm, name = _a.name, emoji = _a.emoji, type = _a.type, description = _a.description;
        var editingOption = this.data.editingOption;
        if (!editingOption)
            return;
        if (!name.trim()) {
            wx.showToast({
                title: '请输入餐饮名称',
                icon: 'none'
            });
            return;
        }
        if (!emoji.trim()) {
            wx.showToast({
                title: '请输入表情符号',
                icon: 'none'
            });
            return;
        }
        // 检查是否与其他选项重名
        var existingOption = this.data.foodOptions.find(function (option) {
            return option.id !== editingOption.id &&
                option.name.trim().toLowerCase() === name.trim().toLowerCase();
        });
        if (existingOption) {
            wx.showToast({
                title: '该餐饮选项已存在',
                icon: 'none'
            });
            return;
        }
        var foodOptions = this.data.foodOptions.map(function (option) {
            if (option.id === editingOption.id) {
                return __assign(__assign({}, option), { name: name.trim(), emoji: emoji.trim(), type: type.trim() || '自定义', description: description.trim() || "\u7F8E\u5473\u7684" + name.trim() });
            }
            return option;
        });
        // 编辑不会改变选项数量，但需要确保转盘角度分布正确
        this.updateWheelRotations(foodOptions);
        this.setData({
            foodOptions: foodOptions,
            showEditModal: false,
            editingOption: null,
            // 清空表单
            customForm: {
                name: '',
                emoji: '',
                type: '',
                description: ''
            }
        });
        // 保存更新后的选项到本地存储
        this.saveCustomOptions(foodOptions);
        wx.showToast({
            title: '修改成功',
            icon: 'success'
        });
        console.log('编辑选项成功:', name.trim());
    },
    /**
     * 删除选项
     */
    deleteOption: function (e) {
        var _this = this;
        var option = e.currentTarget.dataset.option;
        if (!option)
            return;
        wx.showModal({
            title: '确认删除',
            content: "\u786E\u5B9A\u8981\u5220\u9664\"" + option.name + "\"\u5417\uFF1F",
            success: function (res) {
                if (res.confirm) {
                    var foodOptions = _this.data.foodOptions.filter(function (item) { return item.id !== option.id; });
                    if (foodOptions.length === 0) {
                        wx.showToast({
                            title: '至少保留一个选项',
                            icon: 'none'
                        });
                        return;
                    }
                    // 重新计算剩余选项的转盘位置，确保均等分布
                    _this.updateWheelRotations(foodOptions);
                    _this.setData({
                        foodOptions: foodOptions
                    });
                    // 保存更新后的选项到本地存储
                    _this.saveCustomOptions(foodOptions);
                    wx.showToast({
                        title: '删除成功',
                        icon: 'success'
                    });
                    console.log('删除选项成功:', option.name, '剩余选项数:', foodOptions.length);
                }
            }
        });
    },
    /**
     * 重置为默认选项
     */
    resetToDefault: function () {
        var _this = this;
        wx.showModal({
            title: '重置确认',
            content: '确定要重置为默认选项吗？这将清除所有自定义内容。',
            success: function (res) {
                if (res.confirm) {
                    try {
                        // 清除自定义选项
                        wx.removeStorageSync('foodwheel_custom_options');
                        // 重新加载默认选项
                        _this.loadDefaultOptions();
                        _this.setData({
                            showManageModal: false
                        });
                        wx.showToast({
                            title: '重置成功',
                            icon: 'success'
                        });
                    }
                    catch (error) {
                        console.error('重置失败:', error);
                        wx.showToast({
                            title: '重置失败',
                            icon: 'error'
                        });
                    }
                }
            }
        });
    },
    /**
     * 记录工具使用情况
     */
    recordUsage: function () {
        try {
            // 获取数据管理器
            var app_1 = getApp();
            var dataManager_2 = app_1.globalData && app_1.globalData.dataManager;
            if (dataManager_2 && typeof dataManager_2.recordToolUsage === 'function') {
                dataManager_2.recordToolUsage('foodwheel', '吃什么转盘');
            }
        }
        catch (error) {
            console.error('记录使用情况失败:', error);
        }
    },
    /**
     * 页面分享
     */
    onShareAppMessage: function () {
        return {
            title: '吃什么？让转盘帮你决定！',
            path: '/pages/tools/foodwheel/foodwheel',
            imageUrl: '' // 可以设置分享图片
        };
    },
    /**
     * 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: '吃什么？让转盘帮你决定今天的美食！',
            imageUrl: '' // 可以设置分享图片
        };
    },
    /**
     * 检查收藏状态
     */
    checkFavoriteStatus: function () {
        return __awaiter(this, void 0, void 0, function () {
            var isFavorite, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, dataManager_1.dataManager.isFavorite('foodwheel')];
                    case 1:
                        isFavorite = _a.sent();
                        this.setData({ isFavorite: isFavorite });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('[FoodWheel] 检查收藏状态失败:', error_1);
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
            var result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, dataManager_1.dataManager.toggleFavorite('foodwheel')];
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
                        error_2 = _a.sent();
                        console.error('[FoodWheel] 切换收藏失败:', error_2);
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
