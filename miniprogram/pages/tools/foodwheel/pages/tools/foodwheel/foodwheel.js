"use strict";
/// <reference path="../../../../typings/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const dataManager_1 = require("../../../utils/dataManager");
Page({
    data: {
        foodOptions: [],
        wheelRotation: 0,
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
    async onLoad() {
        console.log('吃什么？转盘工具页面加载');
        try {
            // 只初始化基础数据，不调用任何外部API
            this.initFoodOptions();
            this.loadHistory();
            // 设置默认收藏状态
            this.setData({ isFavorite: false });
            console.log('页面基础数据初始化完成');
        }
        catch (error) {
            console.error('页面初始化失败:', error);
        }
    },
    onShow() {
        // 延迟执行需要API的操作，确保小程序完全就绪
        setTimeout(() => {
            this.initializeExternalServices();
        }, 2000); // 增加延迟到2秒，确保小程序完全初始化
    },
    /**
     * 初始化外部服务（延迟执行）
     */
    async initializeExternalServices() {
        try {
            // 检查应用和数据管理器是否就绪
            if (!this.isAppReady()) {
                console.log('应用未完全初始化，跳过外部服务初始化');
                return;
            }
            // 依次执行外部API调用，添加错误恢复机制
            await this.safeCheckFavoriteStatus();
            await this.delay(500); // 间隔500ms
            await this.safeAddUsageRecord();
            await this.delay(500); // 间隔500ms
            await this.safeRecordUsage();
            console.log('外部服务初始化完成');
        }
        catch (error) {
            console.error('外部服务初始化失败:', error);
            // 静默处理，不影响核心功能
        }
    },
    /**
     * 检查应用是否完全就绪
     */
    isAppReady() {
        try {
            // 检查wx对象是否可用
            if (!wx) {
                console.log('wx对象不可用');
                return false;
            }
            // 检查应用实例
            const app = getApp();
            if (!app || !app.globalData) {
                console.log('应用实例不可用');
                return false;
            }
            // 检查数据管理器
            if (!dataManager_1.dataManager) {
                console.log('数据管理器不可用');
                return false;
            }
            return true;
        }
        catch (error) {
            console.error('检查应用状态失败:', error);
            return false;
        }
    },
    /**
     * 延迟工具函数
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    /**
     * 初始化餐饮选项数据
     */
    initFoodOptions() {
        try {
            // 先尝试加载自定义选项
            const customOptions = this.loadCustomOptions();
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
    loadDefaultOptions() {
        const defaultFoods = [
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
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA'
        ];
        const segmentAngle = 360 / defaultFoods.length;
        const foodOptions = defaultFoods.map((food, index) => (Object.assign(Object.assign({}, food), { color: colors[index % colors.length], rotation: index * segmentAngle, isCustom: false })));
        this.setData({
            foodOptions
        });
    },
    /**
     * 更新转盘旋转角度
     */
    updateWheelRotations(options) {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#F8C471'
        ];
        const segmentAngle = 360 / options.length;
        options.forEach((option, index) => {
            option.rotation = index * segmentAngle;
            if (!option.color) {
                option.color = colors[index % colors.length];
            }
        });
    },
    /**
     * 加载自定义选项
     */
    loadCustomOptions() {
        try {
            const customOptions = wx.getStorageSync('foodwheel_custom_options');
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
    saveCustomOptions(options) {
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
    spinWheel() {
        if (this.data.isSpinning) {
            return;
        }
        const { foodOptions } = this.data;
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
        const { finalRotation, selectedFood } = this.calculateSpinResult();
        // 执行转盘动画
        this.setData({
            wheelRotation: finalRotation
        });
        // 添加震动反馈
        wx.vibrateShort({
            type: 'medium'
        }).catch(err => {
            console.log('震动反馈失败:', err);
        });
        // 动画完成后显示结果
        setTimeout(() => {
            this.setData({
                isSpinning: false,
                lastResult: selectedFood
            });
            // 保存到历史记录
            this.saveToHistory(selectedFood);
            console.log('转盘停止，选中:', selectedFood.name);
        }, 3000); // 3秒动画时间
    },
    /**
     * 计算转盘停止结果
     */
    calculateSpinResult() {
        const foodOptions = this.data.foodOptions;
        const segmentAngle = 360 / foodOptions.length;
        // 生成随机旋转圈数（3-6圈）和最终角度
        const baseRotations = Math.floor(Math.random() * 4) + 3; // 3-6圈
        const randomAngle = Math.random() * 360;
        const totalRotation = this.data.wheelRotation + baseRotations * 360 + randomAngle;
        // 计算转盘最终停止的角度（0-360度）
        const finalAngle = totalRotation % 360;
        // 关键修复：重新设计角度到索引的映射逻辑
        // 指针固定在12点钟方向（0度位置）
        // 从指针位置开始，顺时针方向将360度按选项数量均分
        // 第0个选项对应 0° - segmentAngle°
        // 第1个选项对应 segmentAngle° - 2*segmentAngle°
        // 以此类推...
        // 由于转盘是顺时针旋转，我们需要计算指针相对于转盘的位置
        // 转盘旋转角度越大，指针相对于转盘的位置就是 360° - finalAngle
        const pointerRelativeAngle = (360 - finalAngle) % 360;
        // 计算指针指向哪个扇形区域
        const selectedIndex = Math.floor(pointerRelativeAngle / segmentAngle);
        // 确保索引在有效范围内
        const validIndex = selectedIndex >= foodOptions.length ? 0 : selectedIndex;
        const selectedFood = foodOptions[validIndex];
        // 详细调试信息
        console.log('=== 转盘计算详情 ===');
        console.log('总旋转角度:', totalRotation);
        console.log('最终停止角度:', finalAngle);
        console.log('指针相对转盘角度:', pointerRelativeAngle);
        console.log('扇形角度:', segmentAngle);
        console.log('选中索引:', validIndex);
        console.log('选中食物:', selectedFood.name, selectedFood.emoji);
        console.log('');
        // 打印扇形区域分布（从指针开始顺时针）
        console.log('扇形区域分布（从指针顺时针）:');
        foodOptions.forEach((food, index) => {
            const startAngle = index * segmentAngle;
            const endAngle = (index + 1) * segmentAngle;
            const isSelected = index === validIndex;
            console.log(`索引${index}: ${food.name} ${food.emoji} - 角度范围: ${startAngle.toFixed(1)}°-${endAngle.toFixed(1)}° ${isSelected ? '← 选中' : ''}`);
        });
        console.log('指针相对角度:', pointerRelativeAngle.toFixed(1), '°');
        console.log('==================');
        return {
            finalRotation: totalRotation,
            selectedFood
        };
    },
    /**
     * 保存结果到历史记录
     */
    saveToHistory(food) {
        try {
            const now = new Date();
            const timeString = `${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            const historyRecord = {
                id: Date.now(),
                name: food.name,
                emoji: food.emoji,
                description: food.description,
                timestamp: now.getTime(),
                timeString
            };
            const historyList = [historyRecord, ...this.data.historyList];
            // 只保留最近50条记录
            if (historyList.length > 50) {
                historyList.splice(50);
            }
            this.setData({
                historyList
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
    loadHistory() {
        try {
            const historyList = wx.getStorageSync('foodwheel_history') || [];
            this.setData({
                historyList
            });
        }
        catch (error) {
            console.error('加载历史记录失败:', error);
        }
    },
    /**
     * 显示历史记录弹窗
     */
    showHistory() {
        this.setData({
            showHistoryModal: true
        });
    },
    /**
     * 隐藏历史记录弹窗
     */
    hideHistory() {
        this.setData({
            showHistoryModal: false
        });
    },
    /**
     * 阻止事件冒泡
     */
    stopPropagation() {
        // 阻止点击弹窗内容时关闭弹窗
    },
    /**
     * 显示自定义选项管理
     */
    customizeOptions() {
        this.setData({
            showManageModal: true
        });
    },
    /**
     * 隐藏管理弹窗
     */
    hideManageModal() {
        this.setData({
            showManageModal: false
        });
    },
    /**
     * 显示添加自定义选项弹窗
     */
    showAddCustom() {
        this.setData({
            showCustomModal: true,
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
    hideCustomModal() {
        this.setData({
            showCustomModal: false
        });
    },
    /**
     * 表单输入处理
     */
    onFormInput(e) {
        const { field } = e.currentTarget.dataset;
        const { value } = e.detail;
        if (field) {
            this.setData({
                [`customForm.${field}`]: value
            });
        }
    },
    /**
     * 选择表情符号
     */
    selectEmoji(e) {
        const { emoji } = e.currentTarget.dataset;
        if (emoji) {
            this.setData({
                'customForm.emoji': emoji
            });
        }
    },
    /**
     * 添加自定义选项
     */
    addCustomOption() {
        const { name, emoji, type, description } = this.data.customForm;
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
        const existingOption = this.data.foodOptions.find((option) => option.name.trim().toLowerCase() === name.trim().toLowerCase());
        if (existingOption) {
            wx.showToast({
                title: '该餐饮选项已存在',
                icon: 'none'
            });
            return;
        }
        const newOption = {
            id: Date.now(),
            name: name.trim(),
            emoji: emoji.trim(),
            type: type.trim() || '自定义',
            description: description.trim() || `美味的${name.trim()}`,
            color: '',
            rotation: 0,
            isCustom: true
        };
        const foodOptions = [...this.data.foodOptions, newOption];
        this.updateWheelRotations(foodOptions);
        this.setData({
            foodOptions,
            showCustomModal: false
        });
        this.saveCustomOptions(foodOptions);
        wx.showToast({
            title: '添加成功',
            icon: 'success'
        });
    },
    /**
     * 显示编辑选项弹窗
     */
    showEditOption(e) {
        const { option } = e.currentTarget.dataset;
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
    hideEditModal() {
        this.setData({
            showEditModal: false,
            editingOption: null
        });
    },
    /**
     * 保存编辑
     */
    saveEdit() {
        const { name, emoji, type, description } = this.data.customForm;
        const editingOption = this.data.editingOption;
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
        const existingOption = this.data.foodOptions.find((option) => option.id !== editingOption.id &&
            option.name.trim().toLowerCase() === name.trim().toLowerCase());
        if (existingOption) {
            wx.showToast({
                title: '该餐饮选项已存在',
                icon: 'none'
            });
            return;
        }
        const foodOptions = this.data.foodOptions.map((option) => {
            if (option.id === editingOption.id) {
                return Object.assign(Object.assign({}, option), { name: name.trim(), emoji: emoji.trim(), type: type.trim() || '自定义', description: description.trim() || `美味的${name.trim()}` });
            }
            return option;
        });
        this.setData({
            foodOptions,
            showEditModal: false,
            editingOption: null
        });
        this.saveCustomOptions(foodOptions);
        wx.showToast({
            title: '修改成功',
            icon: 'success'
        });
    },
    /**
     * 删除选项
     */
    deleteOption(e) {
        const { option } = e.currentTarget.dataset;
        if (!option)
            return;
        wx.showModal({
            title: '确认删除',
            content: `确定要删除"${option.name}"吗？`,
            success: (res) => {
                if (res.confirm) {
                    const foodOptions = this.data.foodOptions.filter((item) => item.id !== option.id);
                    if (foodOptions.length === 0) {
                        wx.showToast({
                            title: '至少保留一个选项',
                            icon: 'none'
                        });
                        return;
                    }
                    this.updateWheelRotations(foodOptions);
                    this.setData({
                        foodOptions
                    });
                    this.saveCustomOptions(foodOptions);
                    wx.showToast({
                        title: '删除成功',
                        icon: 'success'
                    });
                }
            }
        });
    },
    /**
     * 重置为默认选项
     */
    resetToDefault() {
        wx.showModal({
            title: '重置确认',
            content: '确定要重置为默认选项吗？这将清除所有自定义内容。',
            success: (res) => {
                if (res.confirm) {
                    try {
                        // 清除自定义选项
                        wx.removeStorageSync('foodwheel_custom_options');
                        // 重新加载默认选项
                        this.loadDefaultOptions();
                        this.setData({
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
     * 安全记录工具使用情况（改进版）
     */
    async safeRecordUsage() {
        try {
            // 多重检查确保环境就绪
            if (!this.isAppReady()) {
                console.log('应用环境未就绪，跳过记录使用情况');
                return;
            }
            // 获取应用实例
            const app = getApp();
            const dataManager = app.globalData && app.globalData.dataManager;
            if (dataManager && typeof dataManager.recordToolUsage === 'function') {
                await dataManager.recordToolUsage('foodwheel', '吃什么转盘');
                console.log('使用情况记录成功');
            }
            else {
                console.log('数据管理器方法不可用，跳过记录');
            }
        }
        catch (error) {
            console.error('记录使用情况失败:', error);
            // 静默处理，不影响用户体验
        }
    },
    /**
     * 页面分享
     */
    onShareAppMessage() {
        return {
            title: '吃什么？让转盘帮你决定！',
            path: '/pages/tools/foodwheel/foodwheel',
            imageUrl: '' // 可以设置分享图片
        };
    },
    /**
     * 分享到朋友圈
     */
    onShareTimeline() {
        return {
            title: '吃什么？让转盘帮你决定今天的美食！',
            imageUrl: '' // 可以设置分享图片
        };
    },
    /**
     * 安全检查收藏状态（改进版）
     */
    async safeCheckFavoriteStatus() {
        try {
            // 多重检查确保环境就绪
            if (!this.isAppReady()) {
                console.log('应用环境未就绪，设置默认收藏状态');
                this.setData({ isFavorite: false });
                return;
            }
            // 检查dataManager方法是否存在
            if (!dataManager_1.dataManager || typeof dataManager_1.dataManager.isFavorite !== 'function') {
                console.log('收藏功能不可用，设置默认状态');
                this.setData({ isFavorite: false });
                return;
            }
            // 添加超时机制
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('检查收藏状态超时')), 5000));
            const checkPromise = dataManager_1.dataManager.isFavorite('foodwheel');
            const isFavorite = await Promise.race([checkPromise, timeoutPromise]);
            this.setData({ isFavorite: !!isFavorite });
            console.log('收藏状态检查完成:', isFavorite);
        }
        catch (error) {
            console.error('检查收藏状态失败:', error);
            // 设置默认值，不影响用户体验
            this.setData({ isFavorite: false });
        }
    },
    /**
     * 安全添加使用记录（改进版）
     */
    async safeAddUsageRecord() {
        try {
            // 多重检查确保环境就绪
            if (!this.isAppReady()) {
                console.log('应用环境未就绪，跳过添加使用记录');
                return;
            }
            // 检查dataManager方法是否存在
            if (!dataManager_1.dataManager || typeof dataManager_1.dataManager.addUsageRecord !== 'function') {
                console.log('使用记录功能不可用，跳过添加');
                return;
            }
            // 添加超时机制
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('添加使用记录超时')), 5000));
            const addRecordPromise = dataManager_1.dataManager.addUsageRecord({
                toolId: 'foodwheel',
                toolName: '吃什么转盘',
                category: 'entertainment'
            });
            await Promise.race([addRecordPromise, timeoutPromise]);
            console.log('使用记录添加成功');
        }
        catch (error) {
            console.error('添加使用记录失败:', error);
            // 静默处理错误
        }
    },
    /**
     * 切换收藏状态（改进版）
     */
    async onToggleFavorite() {
        try {
            // 检查环境是否就绪
            if (!this.isAppReady()) {
                wx.showToast({
                    title: '系统初始化中，请稍后重试',
                    icon: 'none'
                });
                return;
            }
            // 检查dataManager是否可用
            if (!dataManager_1.dataManager || typeof dataManager_1.dataManager.toggleFavorite !== 'function') {
                wx.showToast({
                    title: '收藏功能暂不可用',
                    icon: 'none'
                });
                return;
            }
            // 显示加载状态
            wx.showLoading({
                title: '处理中...',
                mask: true
            });
            // 添加超时机制
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('操作超时')), 8000));
            const togglePromise = dataManager_1.dataManager.toggleFavorite('foodwheel');
            const result = await Promise.race([togglePromise, timeoutPromise]);
            wx.hideLoading();
            if (result && result.success) {
                this.setData({ isFavorite: result.isFavorite });
                wx.showToast({
                    title: result.isFavorite ? '已添加到收藏' : '已取消收藏',
                    icon: 'success',
                    duration: 1500
                });
            }
            else {
                throw new Error((result === null || result === void 0 ? void 0 : result.message) || '操作失败');
            }
        }
        catch (error) {
            wx.hideLoading();
            console.error('切换收藏失败:', error);
            const errorObj = error;
            let errorMessage = '操作失败，请重试';
            if ((errorObj === null || errorObj === void 0 ? void 0 : errorObj.message) === '操作超时') {
                errorMessage = '操作超时，请检查网络后重试';
            }
            wx.showToast({
                title: errorMessage,
                icon: 'error'
            });
        }
    }
});
