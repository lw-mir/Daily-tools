"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
/**
 * 存储服务工具类
 * 封装微信小程序的存储API，提供统一的数据存储接口
 */
class StorageService {
    /**
     * 初始化存储服务
     */
    static init() {
        console.log('StorageService 初始化完成');
    }
    /**
     * 存储数据
     * @param key 存储键名
     * @param value 存储值
     */
    static set(key, value) {
        try {
            const fullKey = this.PREFIX + key;
            wx.setStorageSync(fullKey, value);
            return true;
        }
        catch (error) {
            console.error(`存储数据失败: ${key}`, error);
            return false;
        }
    }
    /**
     * 获取数据
     * @param key 存储键名
     * @param defaultValue 默认值
     */
    static get(key, defaultValue) {
        try {
            const fullKey = this.PREFIX + key;
            const value = wx.getStorageSync(fullKey);
            return value !== '' ? value : defaultValue;
        }
        catch (error) {
            console.error(`获取数据失败: ${key}`, error);
            return defaultValue;
        }
    }
    /**
     * 删除数据
     * @param key 存储键名
     */
    static remove(key) {
        try {
            const fullKey = this.PREFIX + key;
            wx.removeStorageSync(fullKey);
            return true;
        }
        catch (error) {
            console.error(`删除数据失败: ${key}`, error);
            return false;
        }
    }
    /**
     * 清空所有数据
     */
    static clear() {
        try {
            wx.clearStorageSync();
            return true;
        }
        catch (error) {
            console.error('清空存储失败', error);
            return false;
        }
    }
    /**
     * 获取存储信息
     */
    static getInfo() {
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
    }
    /**
     * 异步存储数据
     * @param key 存储键名
     * @param value 存储值
     */
    static async setAsync(key, value) {
        return new Promise((resolve) => {
            const fullKey = this.PREFIX + key;
            wx.setStorage({
                key: fullKey,
                data: value,
                success: () => resolve(true),
                fail: (error) => {
                    console.error(`异步存储数据失败: ${key}`, error);
                    resolve(false);
                }
            });
        });
    }
    /**
     * 异步获取数据
     * @param key 存储键名
     * @param defaultValue 默认值
     */
    static async getAsync(key, defaultValue) {
        return new Promise((resolve) => {
            const fullKey = this.PREFIX + key;
            wx.getStorage({
                key: fullKey,
                success: (res) => resolve(res.data),
                fail: () => resolve(defaultValue)
            });
        });
    }
}
exports.StorageService = StorageService;
StorageService.PREFIX = 'dailytools_';
