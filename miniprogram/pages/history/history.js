"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataManager_1 = require("../../utils/dataManager");
const index_1 = require("../../utils/index");
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
    onLoad() {
        console.log('[History] 页面加载');
        this.loadUsageHistory();
    },
    onShow() {
        console.log('[History] 页面显示');
        this.loadUsageHistory();
    },
    onPullDownRefresh() {
        console.log('[History] 下拉刷新');
        this.loadUsageHistory();
        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, 1000);
    },
    /**
     * 加载使用历史
     */
    async loadUsageHistory() {
        try {
            this.setData({ isLoading: true });
            const baseRecords = await dataManager_1.dataManager.getUsageHistory();
            // 添加id字段
            const records = baseRecords.map((record, index) => (Object.assign(Object.assign({}, record), { id: `${record.timestamp}_${index}` })));
            const usageGroups = this.groupRecordsByDate(records);
            const stats = this.calculateStats(records);
            this.setData({
                usageGroups,
                filteredGroups: usageGroups,
                stats,
                isEmpty: records.length === 0,
                isLoading: false
            });
            this.filterRecords();
        }
        catch (error) {
            console.error('[History] 加载历史失败:', error);
            this.setData({ isLoading: false });
            wx.showToast({
                title: '加载失败',
                icon: 'error'
            });
        }
    },
    /**
     * 按日期分组记录
     */
    groupRecordsByDate(records) {
        const groups = {};
        records.forEach(record => {
            const date = new Date(record.timestamp);
            const dateKey = date.toDateString();
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(record);
        });
        return Object.entries(groups)
            .map(([dateKey, records]) => {
            const date = new Date(dateKey);
            const totalDuration = records.reduce((sum, record) => sum + (record.duration || 0), 0);
            return {
                date: dateKey,
                dateLabel: this.formatDateLabel(date),
                records: records.sort((a, b) => b.timestamp - a.timestamp),
                totalCount: records.length,
                totalDuration
            };
        })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    /**
     * 格式化日期标签
     */
    formatDateLabel(date) {
        const today = new Date();
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        if (date.toDateString() === today.toDateString()) {
            return '今天';
        }
        else if (date.toDateString() === yesterday.toDateString()) {
            return '昨天';
        }
        else {
            return `${date.getMonth() + 1}月${date.getDate()}日`;
        }
    },
    /**
     * 计算统计信息
     */
    calculateStats(records) {
        // const now = Date.now()
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStart = today.getTime();
        const weekStart = todayStart - 6 * 24 * 60 * 60 * 1000;
        const monthStart = todayStart - 29 * 24 * 60 * 60 * 1000;
        const todayRecords = records.filter(r => r.timestamp >= todayStart);
        const weekRecords = records.filter(r => r.timestamp >= weekStart);
        const monthRecords = records.filter(r => r.timestamp >= monthStart);
        // 统计最常用工具
        const toolCount = {};
        records.forEach(record => {
            toolCount[record.toolName] = (toolCount[record.toolName] || 0) + 1;
        });
        const favoriteTools = Object.entries(toolCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([toolName, count]) => ({ toolName, count }));
        return {
            totalUsage: records.length,
            totalDuration: records.reduce((sum, r) => sum + (r.duration || 0), 0),
            todayUsage: todayRecords.length,
            weekUsage: weekRecords.length,
            monthUsage: monthRecords.length,
            favoriteTools
        };
    },
    /**
     * 搜索输入
     */
    onSearchInput(e) {
        const searchText = e.detail.value;
        this.setData({ searchText });
        this.filterRecords();
    },
    /**
     * 搜索确认
     */
    onSearchConfirm() {
        this.filterRecords();
    },
    /**
     * 清除搜索
     */
    onClearSearch() {
        this.setData({ searchText: '' });
        this.filterRecords();
    },
    /**
     * 时间筛选
     */
    onTimeFilter(e) {
        const filter = e.currentTarget.dataset.filter;
        this.setData({ timeFilter: filter });
        this.filterRecords();
    },
    /**
     * 筛选记录
     */
    filterRecords() {
        const { usageGroups, searchText, timeFilter } = this.data;
        let filtered = [...usageGroups];
        // 时间筛选
        if (timeFilter !== 'all') {
            // const now = Date.now()
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let startTime = 0;
            switch (timeFilter) {
                case 'today':
                    startTime = today.getTime();
                    break;
                case 'week':
                    startTime = today.getTime() - 6 * 24 * 60 * 60 * 1000;
                    break;
                case 'month':
                    startTime = today.getTime() - 29 * 24 * 60 * 60 * 1000;
                    break;
            }
            filtered = filtered.filter(group => {
                const groupDate = new Date(group.date).getTime();
                return groupDate >= startTime;
            });
        }
        // 搜索筛选
        if (searchText.trim()) {
            const keyword = searchText.trim().toLowerCase();
            filtered = filtered.map(group => (Object.assign(Object.assign({}, group), { records: group.records.filter(record => record.toolName.toLowerCase().includes(keyword) ||
                    record.category.toLowerCase().includes(keyword)) }))).filter(group => group.records.length > 0);
        }
        this.setData({ filteredGroups: filtered });
    },
    /**
     * 点击记录
     */
    onRecordTap(e) {
        const record = e.currentTarget.dataset.record;
        // 根据工具类型导航到对应页面
        let path = '';
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
            fail: (error) => {
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
    async onDeleteRecord(e) {
        e.stopPropagation();
        const record = e.currentTarget.dataset.record;
        wx.showModal({
            title: '确认删除',
            content: '确定要删除这条使用记录吗？',
            success: async (res) => {
                if (res.confirm) {
                    try {
                        // 获取所有记录，过滤掉要删除的记录，然后保存
                        const baseRecords = await dataManager_1.dataManager.getUsageHistory();
                        const filteredRecords = baseRecords.filter(r => !(r.timestamp === record.timestamp && r.toolId === record.toolId));
                        await dataManager_1.dataManager.saveUsageHistory(filteredRecords);
                        wx.showToast({
                            title: '删除成功',
                            icon: 'success'
                        });
                        this.loadUsageHistory();
                    }
                    catch (error) {
                        console.error('[History] 删除记录失败:', error);
                        wx.showToast({
                            title: '删除失败',
                            icon: 'error'
                        });
                    }
                }
            }
        });
    },
    /**
     * 清空历史记录
     */
    onClearHistory() {
        wx.showModal({
            title: '确认清空',
            content: '确定要清空所有使用历史吗？此操作不可恢复。',
            success: async (res) => {
                if (res.confirm) {
                    try {
                        await dataManager_1.dataManager.clearUsageHistory();
                        wx.showToast({
                            title: '清空成功',
                            icon: 'success'
                        });
                        this.loadUsageHistory();
                    }
                    catch (error) {
                        console.error('[History] 清空历史失败:', error);
                        wx.showToast({
                            title: '清空失败',
                            icon: 'error'
                        });
                    }
                }
            }
        });
    },
    /**
     * 导出数据
     */
    async onExportData() {
        try {
            const records = await dataManager_1.dataManager.getUsageHistory();
            const exportData = {
                exportTime: new Date().toISOString(),
                totalRecords: records.length,
                records: records.map(record => ({
                    toolName: record.toolName,
                    category: record.category,
                    time: index_1.formatTime(record.timestamp),
                    duration: record.duration || 0
                }))
            };
            const dataString = JSON.stringify(exportData, null, 2);
            // 复制到剪贴板
            wx.setClipboardData({
                data: dataString,
                success: () => {
                    wx.showToast({
                        title: '数据已复制到剪贴板',
                        icon: 'success',
                        duration: 2000
                    });
                },
                fail: () => {
                    wx.showToast({
                        title: '导出失败',
                        icon: 'error'
                    });
                }
            });
        }
        catch (error) {
            console.error('[History] 导出数据失败:', error);
            wx.showToast({
                title: '导出失败',
                icon: 'error'
            });
        }
    },
    /**
     * 格式化持续时间
     */
    formatDuration(duration) {
        if (duration < 60) {
            return `${duration}秒`;
        }
        else if (duration < 3600) {
            return `${Math.floor(duration / 60)}分钟`;
        }
        else {
            const hours = Math.floor(duration / 3600);
            const minutes = Math.floor((duration % 3600) / 60);
            return `${hours}小时${minutes}分钟`;
        }
    }
});
