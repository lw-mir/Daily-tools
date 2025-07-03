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
Object.defineProperty(exports, "__esModule", { value: true });
var dataManager_1 = require("../../utils/dataManager");
Page({
    data: {
        favoriteTools: [],
        isLoading: false,
        isEmpty: false
    },
    onLoad: function () {
        console.log('[Favorites] 页面加载');
        this.loadFavorites();
    },
    onShow: function () {
        console.log('[Favorites] 页面显示');
        this.loadFavorites();
    },
    onPullDownRefresh: function () {
        console.log('[Favorites] 下拉刷新');
        this.loadFavorites();
        setTimeout(function () {
            wx.stopPullDownRefresh();
        }, 1000);
    },
    /**
     * 加载收藏列表
     */
    loadFavorites: function () {
        return __awaiter(this, void 0, void 0, function () {
            var favoriteToolIds_1, allTools, favoriteTools, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setData({ isLoading: true });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dataManager_1.dataManager.getFavoriteTools()];
                    case 2:
                        favoriteToolIds_1 = _a.sent();
                        console.log('[Favorites] 收藏的工具ID:', favoriteToolIds_1);
                        allTools = this.getAllTools();
                        favoriteTools = allTools.filter(function (tool) { return favoriteToolIds_1.includes(tool.id); });
                        // 更新收藏状态
                        favoriteTools.forEach(function (tool) {
                            tool.isFavorite = true;
                        });
                        console.log('[Favorites] 收藏的工具列表:', favoriteTools);
                        this.setData({
                            favoriteTools: favoriteTools,
                            isEmpty: favoriteTools.length === 0,
                            isLoading: false
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('[Favorites] 加载收藏列表失败:', error_1);
                        this.setData({
                            favoriteTools: [],
                            isEmpty: true,
                            isLoading: false
                        });
                        wx.showToast({
                            title: '加载失败',
                            icon: 'error'
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 获取所有工具列表
     */
    getAllTools: function () {
        return [
            {
                id: 'calculator',
                name: '计算器',
                icon: '🔢',
                description: '基础数学计算工具',
                category: 'calculator',
                path: '/pages/tools/calculator/calculator',
                isFavorite: true
            },
            {
                id: 'converter',
                name: '单位转换',
                icon: '📏',
                description: '长度、重量、温度等单位转换',
                category: 'converter',
                path: '/pages/tools/converter/converter',
                isFavorite: true
            },
            {
                id: 'foodwheel',
                name: '转盘工具',
                icon: '🎯',
                description: '随机选择和决策转盘',
                category: 'converter',
                path: '/pages/tools/foodwheel/foodwheel',
                isFavorite: true
            },
            {
                id: 'qrcode',
                name: '二维码',
                icon: '📱',
                description: '二维码生成和识别',
                category: 'qrcode',
                path: '/pages/tools/qrcode/qrcode',
                isFavorite: false
            }
        ];
    },
    /**
     * 点击工具项，跳转到对应工具页面
     */
    onToolTap: function (e) {
        var tool = e.currentTarget.dataset.tool;
        if (!tool) {
            console.error('[Favorites] 工具数据为空');
            return;
        }
        console.log('[Favorites] 点击工具:', tool.name, tool.path);
        this.navigateToTool(tool);
    },
    /**
     * 跳转到工具页面
     */
    navigateToTool: function (tool) {
        if (!tool.path) {
            wx.showToast({
                title: '工具页面不存在',
                icon: 'error'
            });
            return;
        }
        wx.navigateTo({
            url: tool.path,
            success: function () {
                console.log('[Favorites] 成功跳转到:', tool.path);
            },
            fail: function (error) {
                console.error('[Favorites] 跳转失败:', error);
                wx.showToast({
                    title: '跳转失败',
                    icon: 'error'
                });
            }
        });
    },
    /**
     * 跳转到首页
     */
    navigateToHome: function () {
        wx.switchTab({
            url: '/pages/index/index'
        });
    }
});
