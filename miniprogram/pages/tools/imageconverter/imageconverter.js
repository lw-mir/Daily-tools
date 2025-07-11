"use strict";
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
var util_1 = require("../../../utils/util");
Page({
    data: {
        // 基础状态
        isLoading: false,
        loadingText: '处理中...',
        isFavorite: false,
        // 图片相关
        currentImage: null,
        processedImage: null,
        // 转换选项
        conversionOptions: [
            { id: 'format', name: '格式', icon: '🔄' },
            { id: 'crop', name: '裁剪', icon: '✂️' },
            { id: 'compress', name: '压缩', icon: '📦' },
            { id: 'rename', name: '重命名', icon: '🏷️' }
        ],
        currentOption: 'format',
        // 格式转换
        outputFormat: 'jpg',
        outputQuality: 80,
        // 裁剪设置
        cropRatios: [
            { id: 'free', name: '自由', ratio: 0 },
            { id: 'square', name: '1:1', ratio: 1 },
            { id: 'photo', name: '4:3', ratio: 4 / 3 },
            { id: 'wide', name: '16:9', ratio: 16 / 9 },
            { id: 'portrait', name: '3:4', ratio: 3 / 4 },
            { id: 'cinema', name: '21:9', ratio: 21 / 9 }
        ],
        selectedCropRatio: 'free',
        // 重命名
        outputFileName: '',
        // 历史记录
        history: []
    },
    dataManager: null,
    onLoad: function () {
        this.dataManager = new dataManager_1.DataManager();
        this.loadFavoriteStatus();
        this.loadHistory();
    },
    // 加载收藏状态
    loadFavoriteStatus: function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var isFavorite, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ((_a = this.dataManager) === null || _a === void 0 ? void 0 : _a.isFavorite('imageconverter'))];
                    case 1:
                        isFavorite = (_b.sent()) || false;
                        this.setData({ isFavorite: isFavorite });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        console.error('加载收藏状态失败:', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // 加载历史记录
    loadHistory: function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var history, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ((_a = this.dataManager) === null || _a === void 0 ? void 0 : _a.getCacheData('imageconverter_history'))];
                    case 1:
                        history = (_b.sent()) || [];
                        this.setData({ history: history });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        console.error('加载历史记录失败:', error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // 切换收藏状态
    onToggleFavorite: function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var isFavorite, result, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        isFavorite = this.data.isFavorite;
                        return [4 /*yield*/, ((_a = this.dataManager) === null || _a === void 0 ? void 0 : _a.toggleFavorite('imageconverter'))];
                    case 1:
                        result = _b.sent();
                        if (result === null || result === void 0 ? void 0 : result.success) {
                            this.setData({ isFavorite: result.isFavorite });
                            wx.showToast({
                                title: result.isFavorite ? '已添加收藏' : '已取消收藏',
                                icon: 'success',
                                duration: 1500
                            });
                        }
                        else {
                            wx.showToast({
                                title: (result === null || result === void 0 ? void 0 : result.message) || '操作失败',
                                icon: 'error'
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _b.sent();
                        console.error('切换收藏状态失败:', error_3);
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
    // 选择图片
    onChooseImage: function () {
        var _this = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                var tempFilePath = res.tempFilePaths[0];
                _this.analyzeImage(tempFilePath);
            },
            fail: function (error) {
                console.error('选择图片失败:', error);
                wx.showToast({
                    title: '选择图片失败',
                    icon: 'error'
                });
            }
        });
    },
    // 分析图片信息
    analyzeImage: function (imagePath) {
        var _this = this;
        wx.getImageInfo({
            src: imagePath,
            success: function (res) {
                var fileName = "image_" + Date.now();
                var format = _this.getImageFormat(imagePath);
                var sizeText = _this.formatFileSize(res.width * res.height * 4); // 估算大小
                var imageInfo = {
                    path: imagePath,
                    name: fileName,
                    format: format,
                    width: res.width,
                    height: res.height,
                    size: res.width * res.height * 4,
                    sizeText: sizeText
                };
                _this.setData({
                    currentImage: imageInfo,
                    processedImage: null,
                    outputFileName: fileName,
                    outputFormat: format === 'PNG' ? 'png' : 'jpg'
                });
            },
            fail: function (error) {
                console.error('获取图片信息失败:', error);
                wx.showToast({
                    title: '获取图片信息失败',
                    icon: 'error'
                });
            }
        });
    },
    // 获取图片格式
    getImageFormat: function (path) {
        var _a;
        var extension = (_a = path.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        switch (extension) {
            case 'png':
                return 'PNG';
            case 'jpg':
            case 'jpeg':
                return 'JPG';
            case 'gif':
                return 'GIF';
            default:
                return 'JPG';
        }
    },
    // 格式化文件大小
    formatFileSize: function (bytes) {
        if (bytes < 1024)
            return bytes + ' B';
        if (bytes < 1024 * 1024)
            return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },
    // 切换转换选项
    onOptionChange: function (e) {
        var option = e.currentTarget.dataset.option;
        this.setData({ currentOption: option });
    },
    // 切换输出格式
    onFormatChange: function (e) {
        var format = e.currentTarget.dataset.format;
        this.setData({ outputFormat: format });
    },
    // 调整质量
    onQualityChange: function (e) {
        var quality = e.detail.value;
        this.setData({ outputQuality: quality });
    },
    // 切换裁剪比例
    onCropRatioChange: function (e) {
        var ratio = e.currentTarget.dataset.ratio;
        this.setData({ selectedCropRatio: ratio });
    },
    // 输入文件名
    onFileNameInput: function (e) {
        var fileName = e.detail.value;
        this.setData({ outputFileName: fileName });
    },
    // 处理图片
    onProcessImage: function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, currentImage, currentOption, validation, processedImage, _c, actualSize, error_4;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = this.data, currentImage = _b.currentImage, currentOption = _b.currentOption;
                        if (!currentImage)
                            return [2 /*return*/];
                        validation = this.validateProcessParams();
                        if (!validation.valid) {
                            wx.showToast({
                                title: validation.message || '参数错误',
                                icon: 'error'
                            });
                            return [2 /*return*/];
                        }
                        // 添加触觉反馈
                        wx.vibrateShort({
                            type: 'light'
                        });
                        this.setData({
                            isLoading: true,
                            loadingText: this.getLoadingText(currentOption)
                        });
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 16, 17, 18]);
                        processedImage = void 0;
                        _c = currentOption;
                        switch (_c) {
                            case 'format': return [3 /*break*/, 2];
                            case 'crop': return [3 /*break*/, 4];
                            case 'compress': return [3 /*break*/, 6];
                            case 'rename': return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 10];
                    case 2: return [4 /*yield*/, this.convertFormat(currentImage)];
                    case 3:
                        processedImage = _d.sent();
                        return [3 /*break*/, 11];
                    case 4: return [4 /*yield*/, this.cropImage(currentImage)];
                    case 5:
                        processedImage = _d.sent();
                        return [3 /*break*/, 11];
                    case 6: return [4 /*yield*/, this.compressImage(currentImage)];
                    case 7:
                        processedImage = _d.sent();
                        return [3 /*break*/, 11];
                    case 8: return [4 /*yield*/, this.renameImage(currentImage)];
                    case 9:
                        processedImage = _d.sent();
                        return [3 /*break*/, 11];
                    case 10: throw new Error('未知的处理选项');
                    case 11:
                        if (!(processedImage.path !== currentImage.path)) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.getImageFileSize(processedImage.path)];
                    case 12:
                        actualSize = _d.sent();
                        if (actualSize > 0) {
                            processedImage.size = actualSize;
                            processedImage.sizeText = this.formatFileSize(actualSize);
                        }
                        _d.label = 13;
                    case 13:
                        this.setData({ processedImage: processedImage });
                        return [4 /*yield*/, this.saveToHistory(currentImage, processedImage, currentOption)];
                    case 14:
                        _d.sent();
                        wx.showToast({
                            title: '处理完成',
                            icon: 'success'
                        });
                        // 添加使用记录
                        return [4 /*yield*/, ((_a = this.dataManager) === null || _a === void 0 ? void 0 : _a.addUsageRecord({
                                toolId: 'imageconverter',
                                toolName: '图片转换',
                                category: 'tools'
                            }))];
                    case 15:
                        // 添加使用记录
                        _d.sent();
                        return [3 /*break*/, 18];
                    case 16:
                        error_4 = _d.sent();
                        console.error('处理图片失败:', error_4);
                        wx.showToast({
                            title: error_4 instanceof Error ? error_4.message : '处理失败',
                            icon: 'error'
                        });
                        return [3 /*break*/, 18];
                    case 17:
                        this.setData({ isLoading: false });
                        return [7 /*endfinally*/];
                    case 18: return [2 /*return*/];
                }
            });
        });
    },
    // 格式转换
    convertFormat: function (imageInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var _a = _this.data, outputFormat = _a.outputFormat, outputQuality = _a.outputQuality;
                        // 如果格式相同且质量为100%，直接返回原图
                        if (imageInfo.format.toLowerCase() === outputFormat.toLowerCase() && outputQuality >= 100) {
                            resolve(__assign(__assign({}, imageInfo), { name: _this.data.outputFileName + "." + outputFormat }));
                            return;
                        }
                        // 创建canvas进行格式转换
                        var query = wx.createSelectorQuery().in(_this);
                        query.select('#imageCanvas').fields({ node: true, size: true }).exec(function (res) {
                            if (!res[0] || !res[0].node) {
                                // 如果没有canvas节点，使用compressImage API进行格式转换
                                _this.fallbackConvertFormat(imageInfo, outputFormat, outputQuality, resolve, reject);
                                return;
                            }
                            var canvas = res[0].node;
                            var ctx = canvas.getContext('2d');
                            // 设置canvas尺寸
                            var dpr = wx.getSystemInfoSync().pixelRatio;
                            canvas.width = imageInfo.width * dpr;
                            canvas.height = imageInfo.height * dpr;
                            ctx.scale(dpr, dpr);
                            // 创建图片对象
                            var img = canvas.createImage();
                            img.onload = function () {
                                try {
                                    // 清空canvas
                                    ctx.clearRect(0, 0, imageInfo.width, imageInfo.height);
                                    // 绘制图片
                                    ctx.drawImage(img, 0, 0, imageInfo.width, imageInfo.height);
                                    // 导出图片 - 使用Canvas 2D API
                                    wx.canvasToTempFilePath({
                                        canvas: canvas,
                                        fileType: outputFormat,
                                        quality: outputQuality / 100,
                                        success: function (canvasRes) {
                                            _this.getProcessedImageInfo(canvasRes.tempFilePath, outputFormat, _this.data.outputFileName + "." + outputFormat, resolve, reject);
                                        },
                                        fail: function (error) {
                                            console.error('Canvas导出失败:', error);
                                            // 降级到API方式
                                            _this.fallbackConvertFormat(imageInfo, outputFormat, outputQuality, resolve, reject);
                                        }
                                    });
                                }
                                catch (error) {
                                    console.error('Canvas处理失败:', error);
                                    _this.fallbackConvertFormat(imageInfo, outputFormat, outputQuality, resolve, reject);
                                }
                            };
                            img.onerror = function (error) {
                                console.error('图片加载失败:', error);
                                _this.fallbackConvertFormat(imageInfo, outputFormat, outputQuality, resolve, reject);
                            };
                            img.src = imageInfo.path;
                        });
                    })];
            });
        });
    },
    // 降级格式转换方法
    fallbackConvertFormat: function (imageInfo, outputFormat, outputQuality, resolve, reject) {
        var _this = this;
        wx.compressImage({
            src: imageInfo.path,
            quality: outputQuality,
            compressedWidth: imageInfo.width,
            compressedHeight: imageInfo.height,
            success: function (compressRes) {
                _this.getProcessedImageInfo(compressRes.tempFilePath, outputFormat, _this.data.outputFileName + "." + outputFormat, resolve, reject);
            },
            fail: function (error) {
                console.error('压缩图片失败:', error);
                reject(error);
            }
        });
    },
    // 获取处理后图片信息的通用方法
    getProcessedImageInfo: function (filePath, format, name, resolve, reject) {
        var _this = this;
        wx.getImageInfo({
            src: filePath,
            success: function (imageRes) {
                wx.getFileSystemManager().getFileInfo({
                    filePath: filePath,
                    success: function (fileRes) {
                        var processedImage = {
                            path: filePath,
                            format: format.toUpperCase(),
                            name: name,
                            width: imageRes.width,
                            height: imageRes.height,
                            size: fileRes.size,
                            sizeText: _this.formatFileSize(fileRes.size)
                        };
                        resolve(processedImage);
                    },
                    fail: function () {
                        // 如果获取文件大小失败，使用估算值
                        var estimatedSize = imageRes.width * imageRes.height * 4;
                        var processedImage = {
                            path: filePath,
                            format: format.toUpperCase(),
                            name: name,
                            width: imageRes.width,
                            height: imageRes.height,
                            size: estimatedSize,
                            sizeText: _this.formatFileSize(estimatedSize)
                        };
                        resolve(processedImage);
                    }
                });
            },
            fail: function (error) {
                console.error('获取图片信息失败:', error);
                reject(error);
            }
        });
    },
    // 裁剪图片
    cropImage: function (imageInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var _a;
                        var _b = _this.data, selectedCropRatio = _b.selectedCropRatio, cropRatios = _b.cropRatios;
                        var ratio = ((_a = cropRatios.find(function (r) { return r.id === selectedCropRatio; })) === null || _a === void 0 ? void 0 : _a.ratio) || 0;
                        var cropWidth = imageInfo.width;
                        var cropHeight = imageInfo.height;
                        var cropX = 0;
                        var cropY = 0;
                        if (ratio > 0) {
                            if (imageInfo.width / imageInfo.height > ratio) {
                                // 宽度过大，需要裁剪宽度
                                cropWidth = imageInfo.height * ratio;
                                cropX = (imageInfo.width - cropWidth) / 2;
                            }
                            else {
                                // 高度过大，需要裁剪高度
                                cropHeight = imageInfo.width / ratio;
                                cropY = (imageInfo.height - cropHeight) / 2;
                            }
                        }
                        // 使用canvas进行裁剪
                        var query = wx.createSelectorQuery().in(_this);
                        query.select('#imageCanvas').fields({ node: true, size: true }).exec(function (res) {
                            if (!res[0] || !res[0].node) {
                                // 如果没有canvas节点，返回计算后的信息（模拟裁剪）
                                var processedImage = __assign(__assign({}, imageInfo), { width: Math.round(cropWidth), height: Math.round(cropHeight), name: _this.data.outputFileName + "_cropped", sizeText: _this.formatFileSize(cropWidth * cropHeight * 4) });
                                resolve(processedImage);
                                return;
                            }
                            var canvas = res[0].node;
                            var ctx = canvas.getContext('2d');
                            // 设置canvas尺寸为裁剪后的尺寸
                            var dpr = wx.getSystemInfoSync().pixelRatio;
                            var finalWidth = Math.round(cropWidth);
                            var finalHeight = Math.round(cropHeight);
                            canvas.width = finalWidth * dpr;
                            canvas.height = finalHeight * dpr;
                            ctx.scale(dpr, dpr);
                            // 创建图片对象
                            var img = canvas.createImage();
                            img.onload = function () {
                                try {
                                    // 清空canvas
                                    ctx.clearRect(0, 0, finalWidth, finalHeight);
                                    // 绘制裁剪后的图片
                                    ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, // 源图片的裁剪区域
                                    0, 0, finalWidth, finalHeight // 目标canvas的绘制区域
                                    );
                                    // 导出裁剪后的图片
                                    wx.canvasToTempFilePath({
                                        canvas: canvas,
                                        success: function (canvasRes) {
                                            _this.getProcessedImageInfo(canvasRes.tempFilePath, imageInfo.format, _this.data.outputFileName + "_cropped", resolve, reject);
                                        },
                                        fail: function (error) {
                                            console.error('Canvas裁剪导出失败:', error);
                                            reject(error);
                                        }
                                    });
                                }
                                catch (error) {
                                    console.error('Canvas裁剪处理失败:', error);
                                    reject(error);
                                }
                            };
                            img.onerror = function (error) {
                                console.error('图片加载失败:', error);
                                reject(error);
                            };
                            img.src = imageInfo.path;
                        });
                    })];
            });
        });
    },
    // 压缩图片
    compressImage: function (imageInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var outputQuality = _this.data.outputQuality;
                        // 使用微信API进行图片压缩
                        wx.compressImage({
                            src: imageInfo.path,
                            quality: outputQuality,
                            success: function (compressRes) {
                                _this.getProcessedImageInfo(compressRes.tempFilePath, imageInfo.format, _this.data.outputFileName + "_compressed", resolve, reject);
                            },
                            fail: function (error) {
                                console.error('压缩图片失败:', error);
                                reject(error);
                            }
                        });
                    })];
            });
        });
    },
    // 重命名图片
    renameImage: function (imageInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var outputFileName = _this.data.outputFileName;
                        if (!outputFileName.trim()) {
                            reject(new Error('文件名不能为空'));
                            return;
                        }
                        // 对于重命名，我们需要复制文件以实现真正的重命名
                        // 使用Canvas重新绘制图片，这样可以确保保存时使用新的文件名
                        var query = wx.createSelectorQuery().in(_this);
                        query.select('#imageCanvas').fields({ node: true, size: true }).exec(function (res) {
                            if (!res[0] || !res[0].node) {
                                // 如果没有canvas节点，只更改显示名称
                                var processedImage = __assign(__assign({}, imageInfo), { name: outputFileName.trim(), path: imageInfo.path });
                                resolve(processedImage);
                                return;
                            }
                            var canvas = res[0].node;
                            var ctx = canvas.getContext('2d');
                            // 设置canvas尺寸
                            var dpr = wx.getSystemInfoSync().pixelRatio;
                            canvas.width = imageInfo.width * dpr;
                            canvas.height = imageInfo.height * dpr;
                            ctx.scale(dpr, dpr);
                            // 创建图片对象
                            var img = canvas.createImage();
                            img.onload = function () {
                                try {
                                    // 清空canvas
                                    ctx.clearRect(0, 0, imageInfo.width, imageInfo.height);
                                    // 绘制图片
                                    ctx.drawImage(img, 0, 0, imageInfo.width, imageInfo.height);
                                    // 导出图片
                                    wx.canvasToTempFilePath({
                                        canvas: canvas,
                                        success: function (canvasRes) {
                                            _this.getProcessedImageInfo(canvasRes.tempFilePath, imageInfo.format, outputFileName.trim(), resolve, reject);
                                        },
                                        fail: function (error) {
                                            console.error('Canvas重命名导出失败:', error);
                                            // 降级方案：只更改显示名称
                                            var processedImage = __assign(__assign({}, imageInfo), { name: outputFileName.trim(), path: imageInfo.path });
                                            resolve(processedImage);
                                        }
                                    });
                                }
                                catch (error) {
                                    console.error('Canvas重命名处理失败:', error);
                                    // 降级方案：只更改显示名称
                                    var processedImage = __assign(__assign({}, imageInfo), { name: outputFileName.trim(), path: imageInfo.path });
                                    resolve(processedImage);
                                }
                            };
                            img.onerror = function (error) {
                                console.error('图片加载失败:', error);
                                // 降级方案：只更改显示名称
                                var processedImage = __assign(__assign({}, imageInfo), { name: outputFileName.trim(), path: imageInfo.path });
                                resolve(processedImage);
                            };
                            img.src = imageInfo.path;
                        });
                    })];
            });
        });
    },
    // 保存到相册
    onSaveToAlbum: function () {
        var _this = this;
        var processedImage = this.data.processedImage;
        if (!processedImage) {
            wx.showToast({
                title: '没有可保存的图片',
                icon: 'error'
            });
            return;
        }
        // 检查保存权限
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.writePhotosAlbum'] === false) {
                    // 用户之前拒绝了权限，引导用户手动开启
                    wx.showModal({
                        title: '需要相册权限',
                        content: '需要获得您的同意，才能保存图片到相册',
                        showCancel: true,
                        confirmText: '去设置',
                        success: function (modalRes) {
                            if (modalRes.confirm) {
                                wx.openSetting({
                                    success: function (settingRes) {
                                        if (settingRes.authSetting['scope.writePhotosAlbum']) {
                                            _this.saveImageToAlbum(processedImage.path);
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
                else {
                    // 直接保存或请求权限
                    _this.saveImageToAlbum(processedImage.path);
                }
            },
            fail: function () {
                // 获取设置失败，直接尝试保存
                _this.saveImageToAlbum(processedImage.path);
            }
        });
    },
    // 实际保存图片到相册的方法
    saveImageToAlbum: function (filePath) {
        var _this = this;
        wx.showLoading({
            title: '保存中...',
            mask: true
        });
        wx.saveImageToPhotosAlbum({
            filePath: filePath,
            success: function () {
                wx.hideLoading();
                wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 2000
                });
                // 保存成功后，记录到历史
                if (_this.data.currentImage && _this.data.processedImage) {
                    _this.saveToHistory(_this.data.currentImage, _this.data.processedImage, _this.data.currentOption);
                }
            },
            fail: function (error) {
                wx.hideLoading();
                console.error('保存到相册失败:', error);
                var errorMsg = '保存失败';
                if (error.errMsg.includes('auth deny')) {
                    errorMsg = '保存失败，请授权相册权限';
                }
                else if (error.errMsg.includes('system permission denied')) {
                    errorMsg = '保存失败，请在系统设置中开启相册权限';
                }
                wx.showModal({
                    title: '保存失败',
                    content: errorMsg,
                    showCancel: false,
                    confirmText: '确定'
                });
            }
        });
    },
    // 重新处理
    onResetImage: function () {
        this.setData({
            processedImage: null,
            currentOption: 'format'
        });
    },
    // 保存到历史记录
    saveToHistory: function (original, processed, operation) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var historyItem, existingHistory, updatedHistory, error_5;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        historyItem = {
                            id: Date.now().toString(),
                            operation: this.getOperationName(operation),
                            time: util_1.formatTime(new Date(Date.now())),
                            originalImage: original,
                            processedImage: processed
                        };
                        return [4 /*yield*/, ((_a = this.dataManager) === null || _a === void 0 ? void 0 : _a.getCacheData('imageconverter_history'))];
                    case 1:
                        existingHistory = (_c.sent()) || [];
                        updatedHistory = __spreadArrays([historyItem], existingHistory).slice(0, 50) // 只保留最近50条记录
                        ;
                        // 保存更新后的历史记录
                        return [4 /*yield*/, ((_b = this.dataManager) === null || _b === void 0 ? void 0 : _b.setCacheData('imageconverter_history', updatedHistory))];
                    case 2:
                        // 保存更新后的历史记录
                        _c.sent();
                        this.setData({ history: updatedHistory });
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _c.sent();
                        console.error('保存历史记录失败:', error_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    // 获取操作名称
    getOperationName: function (operation) {
        var operationMap = {
            'format': '格式转换',
            'crop': '图片裁剪',
            'compress': '图片压缩',
            'rename': '重命名'
        };
        return operationMap[operation] || operation;
    },
    // 清空历史记录
    onClearHistory: function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ((_a = this.dataManager) === null || _a === void 0 ? void 0 : _a.setCacheData('imageconverter_history', []))];
                    case 1:
                        _b.sent();
                        this.setData({ history: [] });
                        wx.showToast({
                            title: '已清空历史',
                            icon: 'success'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _b.sent();
                        console.error('清空历史记录失败:', error_6);
                        wx.showToast({
                            title: '清空失败',
                            icon: 'error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // 检查图片格式是否支持
    isSupportedFormat: function (format) {
        var supportedFormats = ['jpg', 'jpeg', 'png', 'webp'];
        return supportedFormats.includes(format.toLowerCase());
    },
    // 获取图片实际文件大小
    getImageFileSize: function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        wx.getFileSystemManager().getFileInfo({
                            filePath: filePath,
                            success: function (res) {
                                resolve(res.size || 0);
                            },
                            fail: function () {
                                resolve(0);
                            }
                        });
                    })];
            });
        });
    },
    // 验证处理参数
    validateProcessParams: function () {
        var _a = this.data, currentOption = _a.currentOption, outputFileName = _a.outputFileName, selectedCropRatio = _a.selectedCropRatio;
        switch (currentOption) {
            case 'rename':
                if (!outputFileName.trim()) {
                    return { valid: false, message: '请输入文件名' };
                }
                if (outputFileName.length > 50) {
                    return { valid: false, message: '文件名过长' };
                }
                break;
            case 'crop':
                if (!selectedCropRatio) {
                    return { valid: false, message: '请选择裁剪比例' };
                }
                break;
        }
        return { valid: true };
    },
    // 获取加载文本
    getLoadingText: function (option) {
        var textMap = {
            'format': '格式转换中...',
            'crop': '图片裁剪中...',
            'compress': '图片压缩中...',
            'rename': '重命名中...'
        };
        return textMap[option] || '处理中...';
    }
});
