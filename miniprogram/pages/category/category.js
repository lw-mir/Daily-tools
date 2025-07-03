"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dataManager_1 = require("../../utils/dataManager");
Page({
    data: {
        searchText: '',
        categories: [],
        filteredCategories: [],
        totalCategories: 0,
        totalTools: 0
    },
    onLoad: function () {
        console.log('[Category] 页面加载');
        this.loadCategories();
    },
    onShow: function () {
        console.log('[Category] 页面显示');
        this.updateStats();
    },
    onPullDownRefresh: function () {
        console.log('[Category] 下拉刷新');
        this.loadCategories();
        setTimeout(function () {
            wx.stopPullDownRefresh();
        }, 1000);
    },
    /**
     * 加载分类数据
     */
    loadCategories: function () {
        try {
            // 模拟分类数据
            var categories = [
                {
                    id: 'calculation',
                    name: '计算工具',
                    icon: '🧮',
                    description: '各种计算和数学工具',
                    tools: [
                        {
                            id: 'calculator',
                            name: '计算器',
                            icon: '🔢',
                            description: '基础数学计算',
                            path: '/pages/tools/calculator/calculator'
                        }
                    ],
                    toolCount: 1
                },
                {
                    id: 'conversion',
                    name: '转换工具',
                    icon: '🔄',
                    description: '单位转换和格式转换',
                    tools: [
                        {
                            id: 'converter',
                            name: '单位转换',
                            icon: '📏',
                            description: '长度、重量、温度等单位转换',
                            path: '/pages/tools/converter/converter'
                        }
                    ],
                    toolCount: 1
                },
                {
                    id: 'text',
                    name: '文本工具',
                    icon: '📝',
                    description: '文本处理和编辑工具',
                    tools: [],
                    toolCount: 0
                },
                {
                    id: 'image',
                    name: '图像工具',
                    icon: '🖼️',
                    description: '图片处理和编辑工具',
                    tools: [],
                    toolCount: 0
                },
                {
                    id: 'qrcode',
                    name: '二维码工具',
                    icon: '📱',
                    description: '二维码生成和识别',
                    tools: [
                        {
                            id: 'qrcode',
                            name: '二维码生成',
                            icon: '📱',
                            description: '生成各种二维码',
                            path: '/pages/tools/qrcode/qrcode'
                        }
                    ],
                    toolCount: 1
                },
                {
                    id: 'network',
                    name: '网络工具',
                    icon: '🌐',
                    description: '网络测试和分析工具',
                    tools: [],
                    toolCount: 0
                }
            ];
            this.setData({
                categories: categories,
                filteredCategories: categories
            });
            this.updateStats();
            console.log('[Category] 分类数据加载完成:', categories.length);
        }
        catch (error) {
            console.error('[Category] 加载分类数据失败:', error);
            wx.showToast({
                title: '加载失败',
                icon: 'error'
            });
        }
    },
    /**
     * 更新统计信息
     */
    updateStats: function () {
        var categories = this.data.categories;
        var totalCategories = categories.length;
        var totalTools = categories.reduce(function (sum, category) { return sum + category.toolCount; }, 0);
        this.setData({
            totalCategories: totalCategories,
            totalTools: totalTools
        });
    },
    /**
     * 搜索输入处理
     */
    onSearchInput: function (e) {
        var searchText = e.detail.value;
        this.setData({ searchText: searchText });
        this.filterCategories(searchText);
    },
    /**
     * 搜索确认处理
     */
    onSearchConfirm: function (e) {
        var searchText = e.detail.value;
        this.filterCategories(searchText);
    },
    /**
     * 过滤分类
     */
    filterCategories: function (searchText) {
        var categories = this.data.categories;
        if (!searchText.trim()) {
            this.setData({ filteredCategories: categories });
            return;
        }
        var filtered = categories.filter(function (category) {
            // 搜索分类名称和描述
            var nameMatch = category.name.toLowerCase().includes(searchText.toLowerCase());
            var descMatch = category.description.toLowerCase().includes(searchText.toLowerCase());
            // 搜索工具名称
            var toolMatch = category.tools.some(function (tool) {
                return tool.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    tool.description.toLowerCase().includes(searchText.toLowerCase());
            });
            return nameMatch || descMatch || toolMatch;
        });
        this.setData({ filteredCategories: filtered });
        console.log('[Category] 搜索结果:', filtered.length);
    },
    /**
     * 分类点击处理
     */
    onCategoryTap: function (e) {
        var _this = this;
        var category = e.currentTarget.dataset.category;
        console.log('[Category] 点击分类:', category.name);
        // 如果分类下有工具，显示工具列表
        if (category.tools.length > 0) {
            wx.showActionSheet({
                itemList: category.tools.map(function (tool) { return tool.name; }),
                success: function (res) {
                    var selectedTool = category.tools[res.tapIndex];
                    _this.navigateToTool(selectedTool);
                }
            });
        }
        else {
            wx.showToast({
                title: '该分类暂无工具',
                icon: 'none'
            });
        }
    },
    /**
     * 工具点击处理
     */
    onToolTap: function (e) {
        // 阻止事件冒泡
        e.stopPropagation();
        var tool = e.currentTarget.dataset.tool;
        this.navigateToTool(tool);
    },
    /**
     * 导航到工具页面
     */
    navigateToTool: function (tool) {
        console.log('[Category] 导航到工具:', tool.name);
        // 添加使用记录
        dataManager_1.dataManager.addUsageRecord({
            toolId: tool.id,
            toolName: tool.name,
            category: 'tools'
        });
        // 导航到工具页面
        wx.navigateTo({
            url: tool.path,
            fail: function (error) {
                console.error('[Category] 导航失败:', error);
                wx.showToast({
                    title: '页面不存在',
                    icon: 'error'
                });
            }
        });
    }
});
