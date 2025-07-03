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
var dataManager_1 = require("../../../utils/dataManager");
Page({
    data: {
        // 收藏相关
        isFavorite: false,
        // 功能切换
        currentTab: 'generate',
        // 生成二维码相关
        contentTypes: [
            {
                id: 'text',
                name: '文本',
                icon: '📝',
                inputLabel: '输入文本内容',
                placeholder: '请输入要生成二维码的文本内容'
            },
            {
                id: 'url',
                name: '网址',
                icon: '🔗',
                inputLabel: '输入网址',
                placeholder: '请输入网址，如：https://www.example.com'
            },
            {
                id: 'wifi',
                name: 'WiFi',
                icon: '📶',
                inputLabel: 'WiFi信息',
                placeholder: '格式：WIFI:T:WPA;S:网络名称;P:密码;;'
            },
            {
                id: 'contact',
                name: '联系人',
                icon: '👤',
                inputLabel: '联系人信息',
                placeholder: '格式：BEGIN:VCARD\\nFN:姓名\\nTEL:电话\\nEND:VCARD'
            }
        ],
        contentType: 'text',
        contentTypeIndex: 0,
        inputContent: '',
        maxLength: 1000,
        quickInputs: [],
        // 二维码生成结果
        qrCodeUrl: '',
        displayContent: '',
        generateTime: '',
        isGenerating: false,
        // 扫描相关
        scanResult: null,
        // 历史记录
        history: []
    },
    onLoad: function () {
        console.log('[QRCode] 页面加载');
        this.checkFavoriteStatus();
        this.loadHistory();
        this.updateQuickInputs();
    },
    onShow: function () {
        console.log('[QRCode] 页面显示');
        this.checkFavoriteStatus();
    },
    onPullDownRefresh: function () {
        console.log('[QRCode] 下拉刷新');
        this.loadHistory();
        setTimeout(function () {
            wx.stopPullDownRefresh();
        }, 1000);
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
                        return [4 /*yield*/, dataManager_1.dataManager.isFavorite('qrcode')];
                    case 1:
                        isFavorite = _a.sent();
                        this.setData({ isFavorite: isFavorite });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('[QRCode] 检查收藏状态失败:', error_1);
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
                        return [4 /*yield*/, dataManager_1.dataManager.toggleFavorite('qrcode')];
                    case 1:
                        result = _a.sent();
                        this.setData({ isFavorite: result.isFavorite });
                        wx.showToast({
                            title: result.isFavorite ? '已收藏' : '已取消收藏',
                            icon: 'success',
                            duration: 1500
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error('[QRCode] 切换收藏状态失败:', error_2);
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
    /**
     * 功能标签切换
     */
    onTabChange: function (e) {
        var tab = e.currentTarget.dataset.tab;
        this.setData({ currentTab: tab });
    },
    /**
     * 内容类型切换
     */
    onContentTypeChange: function (e) {
        var type = e.currentTarget.dataset.type;
        var index = this.data.contentTypes.findIndex(function (item) { return item.id === type; });
        this.setData({
            contentType: type,
            contentTypeIndex: index,
            inputContent: ''
        });
        this.updateQuickInputs();
    },
    /**
     * 更新快捷输入选项
     */
    updateQuickInputs: function () {
        var quickInputs = [];
        switch (this.data.contentType) {
            case 'url':
                quickInputs = [
                    { id: '1', label: '百度', content: 'https://www.baidu.com' },
                    { id: '2', label: '微信', content: 'https://weixin.qq.com' },
                    { id: '3', label: '淘宝', content: 'https://www.taobao.com' }
                ];
                break;
            case 'wifi':
                quickInputs = [
                    { id: '1', label: '示例WiFi', content: 'WIFI:T:WPA;S:MyWiFi;P:12345678;;' }
                ];
                break;
            case 'contact':
                quickInputs = [
                    { id: '1', label: '示例联系人', content: 'BEGIN:VCARD\nFN:张三\nTEL:13800138000\nEND:VCARD' }
                ];
                break;
        }
        this.setData({ quickInputs: quickInputs });
    },
    /**
     * 内容输入
     */
    onContentInput: function (e) {
        var content = e.detail.value;
        this.setData({ inputContent: content });
    },
    /**
     * 快捷输入
     */
    onQuickInput: function (e) {
        var content = e.currentTarget.dataset.content;
        this.setData({ inputContent: content });
    },
    /**
     * 生成二维码
     */
    onGenerateQR: function () {
        return __awaiter(this, void 0, void 0, function () {
            var qrCodeUrl, generateTime, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.data.inputContent.trim()) {
                            wx.showToast({
                                title: '请输入内容',
                                icon: 'error'
                            });
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        this.setData({ isGenerating: true });
                        // 模拟二维码生成（实际项目中需要调用真实的二维码生成API）
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 2:
                        // 模拟二维码生成（实际项目中需要调用真实的二维码生成API）
                        _a.sent();
                        qrCodeUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
                        generateTime = new Date().toLocaleString();
                        this.setData({
                            qrCodeUrl: qrCodeUrl,
                            displayContent: this.data.inputContent,
                            generateTime: generateTime,
                            isGenerating: false
                        });
                        // 保存到历史记录
                        this.saveToHistory('generate', this.data.inputContent, qrCodeUrl);
                        wx.showToast({
                            title: '生成成功',
                            icon: 'success'
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.error('[QRCode] 生成二维码失败:', error_3);
                        this.setData({ isGenerating: false });
                        wx.showToast({
                            title: '生成失败',
                            icon: 'error'
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 保存二维码
     */
    onSaveQR: function () {
        if (!this.data.qrCodeUrl)
            return;
        wx.showToast({
            title: '保存功能开发中',
            icon: 'none'
        });
    },
    /**
     * 分享二维码
     */
    onShareQR: function () {
        if (!this.data.qrCodeUrl)
            return;
        wx.showToast({
            title: '分享功能开发中',
            icon: 'none'
        });
    },
    /**
     * 长按二维码
     */
    onLongPressQR: function () {
        var _this = this;
        wx.showActionSheet({
            itemList: ['保存到相册', '分享给朋友'],
            success: function (res) {
                if (res.tapIndex === 0) {
                    _this.onSaveQR();
                }
                else if (res.tapIndex === 1) {
                    _this.onShareQR();
                }
            }
        });
    },
    /**
     * 开始扫描
     */
    onStartScan: function () {
        var _this = this;
        wx.scanCode({
            success: function (res) {
                var scanResult = {
                    type: _this.detectContentType(res.result),
                    typeLabel: _this.getTypeLabel(_this.detectContentType(res.result)),
                    content: res.result,
                    time: new Date().toLocaleString()
                };
                _this.setData({ scanResult: scanResult });
                _this.saveToHistory('scan', res.result);
                wx.showToast({
                    title: '扫描成功',
                    icon: 'success'
                });
            },
            fail: function (error) {
                console.error('[QRCode] 扫描失败:', error);
                wx.showToast({
                    title: '扫描失败',
                    icon: 'error'
                });
            }
        });
    },
    /**
     * 检测内容类型
     */
    detectContentType: function (content) {
        if (content.startsWith('http://') || content.startsWith('https://')) {
            return 'url';
        }
        else if (content.startsWith('WIFI:')) {
            return 'wifi';
        }
        else if (content.startsWith('BEGIN:VCARD')) {
            return 'contact';
        }
        else {
            return 'text';
        }
    },
    /**
     * 获取类型标签
     */
    getTypeLabel: function (type) {
        var typeMap = {
            text: '文本',
            url: '网址',
            wifi: 'WiFi',
            contact: '联系人'
        };
        return typeMap[type] || '未知';
    },
    /**
     * 复制扫描结果
     */
    onCopyScanResult: function () {
        if (!this.data.scanResult)
            return;
        wx.setClipboardData({
            data: this.data.scanResult.content,
            success: function () {
                wx.showToast({
                    title: '已复制',
                    icon: 'success'
                });
            }
        });
    },
    /**
     * 打开网址
     */
    onOpenUrl: function () {
        var _this = this;
        if (!this.data.scanResult || this.data.scanResult.type !== 'url')
            return;
        wx.showModal({
            title: '打开网址',
            content: "\u786E\u5B9A\u8981\u6253\u5F00 " + this.data.scanResult.content + " \u5417\uFF1F",
            success: function (res) {
                if (res.confirm) {
                    // 在小程序中无法直接打开外部网址，可以复制到剪贴板
                    wx.setClipboardData({
                        data: _this.data.scanResult.content,
                        success: function () {
                            wx.showToast({
                                title: '网址已复制，请在浏览器中打开',
                                icon: 'none',
                                duration: 2000
                            });
                        }
                    });
                }
            }
        });
    },
    /**
     * 保存到历史记录
     */
    saveToHistory: function (type, content, result) {
        var historyItem = {
            id: Date.now().toString(),
            type: type,
            content: content,
            result: result,
            time: new Date().toLocaleString()
        };
        var history = __spreadArrays([historyItem], this.data.history.slice(0, 49)); // 最多保存50条
        this.setData({ history: history });
        // 保存到本地存储
        wx.setStorageSync('qrcode_history', history);
    },
    /**
     * 加载历史记录
     */
    loadHistory: function () {
        try {
            var history = wx.getStorageSync('qrcode_history') || [];
            this.setData({ history: history });
        }
        catch (error) {
            console.error('[QRCode] 加载历史记录失败:', error);
        }
    },
    /**
     * 选择历史记录
     */
    onSelectHistory: function (e) {
        var item = e.currentTarget.dataset.item;
        if (item.type === 'generate') {
            // 切换到生成标签并填入内容
            this.setData({
                currentTab: 'generate',
                inputContent: item.content
            });
        }
        else {
            // 切换到扫描标签并显示结果
            var scanResult = {
                type: this.detectContentType(item.content),
                typeLabel: this.getTypeLabel(this.detectContentType(item.content)),
                content: item.content,
                time: item.time
            };
            this.setData({
                currentTab: 'scan',
                scanResult: scanResult
            });
        }
    },
    /**
     * 清空历史记录
     */
    onClearHistory: function () {
        var _this = this;
        wx.showModal({
            title: '确认清空',
            content: '确定要清空所有历史记录吗？',
            success: function (res) {
                if (res.confirm) {
                    _this.setData({ history: [] });
                    wx.removeStorageSync('qrcode_history');
                    wx.showToast({
                        title: '已清空',
                        icon: 'success'
                    });
                }
            }
        });
    }
});
