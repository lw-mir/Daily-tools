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
exports.StorageService = void 0;
/**
 * 存储服务工具类
 * 封装微信小程序的存储API，提供统一的数据存储接口
 */
var StorageService = /** @class */ (function () {
    function StorageService() {
    }
    /**
     * 初始化存储服务
     */
    StorageService.init = function () {
        console.log('StorageService 初始化完成');
    };
    /**
     * 存储数据
     * @param key 存储键名
     * @param value 存储值
     */
    StorageService.set = function (key, value) {
        try {
            var fullKey = this.PREFIX + key;
            wx.setStorageSync(fullKey, value);
            return true;
        }
        catch (error) {
            console.error("\u5B58\u50A8\u6570\u636E\u5931\u8D25: " + key, error);
            return false;
        }
    };
    /**
     * 获取数据
     * @param key 存储键名
     * @param defaultValue 默认值
     */
    StorageService.get = function (key, defaultValue) {
        try {
            var fullKey = this.PREFIX + key;
            var value = wx.getStorageSync(fullKey);
            return value !== '' ? value : defaultValue;
        }
        catch (error) {
            console.error("\u83B7\u53D6\u6570\u636E\u5931\u8D25: " + key, error);
            return defaultValue;
        }
    };
    /**
     * 删除数据
     * @param key 存储键名
     */
    StorageService.remove = function (key) {
        try {
            var fullKey = this.PREFIX + key;
            wx.removeStorageSync(fullKey);
            return true;
        }
        catch (error) {
            console.error("\u5220\u9664\u6570\u636E\u5931\u8D25: " + key, error);
            return false;
        }
    };
    /**
     * 清空所有数据
     */
    StorageService.clear = function () {
        try {
            wx.clearStorageSync();
            return true;
        }
        catch (error) {
            console.error('清空存储失败', error);
            return false;
        }
    };
    /**
     * 获取存储信息
     */
    StorageService.getInfo = function () {
        try {
            return wx.getStorageInfoSync();
        }
        catch (error) {
            console.error('获取存储信息失败', error);
            return {
                keys: [],
                currentSize: 0,
                limitSize: 0
            };
        }
    };
    /**
     * 异步存储数据
     * @param key 存储键名
     * @param value 存储值
     */
    StorageService.setAsync = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var fullKey = _this.PREFIX + key;
                        wx.setStorage({
                            key: fullKey,
                            data: value,
                            success: function () { return resolve(true); },
                            fail: function (error) {
                                console.error("\u5F02\u6B65\u5B58\u50A8\u6570\u636E\u5931\u8D25: " + key, error);
                                resolve(false);
                            }
                        });
                    })];
            });
        });
    };
    /**
     * 异步获取数据
     * @param key 存储键名
     * @param defaultValue 默认值
     */
    StorageService.getAsync = function (key, defaultValue) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var fullKey = _this.PREFIX + key;
                        wx.getStorage({
                            key: fullKey,
                            success: function (res) { return resolve(res.data); },
                            fail: function () { return resolve(defaultValue); }
                        });
                    })];
            });
        });
    };
    StorageService.PREFIX = 'dailytools_';
    return StorageService;
}());
exports.StorageService = StorageService;
