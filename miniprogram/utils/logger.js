"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
/**
 * 日志服务工具类
 * 提供统一的日志记录功能
 */
var LoggerService = /** @class */ (function () {
    function LoggerService() {
    }
    /**
     * 初始化日志服务
     */
    LoggerService.init = function () {
        console.log('LoggerService 初始化完成');
        // 加载本地日志
        try {
            var savedLogs = wx.getStorageSync('dailytools_logs') || [];
            this.logs = savedLogs;
        }
        catch (error) {
            console.error('加载本地日志失败', error);
        }
    };
    /**
     * 记录信息日志
     * @param message 日志消息
     * @param data 附加数据
     */
    LoggerService.info = function (message, data) {
        this.addLog('info', message, data);
        console.log("[INFO] " + message, data);
    };
    /**
     * 记录警告日志
     * @param message 日志消息
     * @param data 附加数据
     */
    LoggerService.warn = function (message, data) {
        this.addLog('warn', message, data);
        console.warn("[WARN] " + message, data);
    };
    /**
     * 记录错误日志
     * @param message 日志消息
     * @param data 附加数据
     */
    LoggerService.error = function (message, data) {
        this.addLog('error', message, data);
        console.error("[ERROR] " + message, data);
    };
    /**
     * 记录调试日志
     * @param message 日志消息
     * @param data 附加数据
     */
    LoggerService.debug = function (message, data) {
        if (this.isDebug) {
            this.addLog('debug', message, data);
            console.log("[DEBUG] " + message, data);
        }
    };
    /**
     * 添加日志条目
     * @param level 日志级别
     * @param message 日志消息
     * @param data 附加数据
     */
    LoggerService.addLog = function (level, message, data) {
        var logEntry = {
            timestamp: Date.now(),
            level: level,
            message: message,
            data: data
        };
        this.logs.unshift(logEntry);
        // 限制日志数量
        if (this.logs.length > this.MAX_LOGS) {
            this.logs = this.logs.slice(0, this.MAX_LOGS);
        }
        // 异步保存日志
        this.saveLogs();
    };
    /**
     * 保存日志到本地存储
     */
    LoggerService.saveLogs = function () {
        try {
            wx.setStorage({
                key: 'dailytools_logs',
                data: this.logs,
                fail: function (error) {
                    console.error('保存日志失败', error);
                }
            });
        }
        catch (error) {
            console.error('保存日志失败', error);
        }
    };
    /**
     * 获取所有日志
     */
    LoggerService.getLogs = function () {
        return __spreadArrays(this.logs);
    };
    /**
     * 清空日志
     */
    LoggerService.clearLogs = function () {
        this.logs = [];
        try {
            wx.removeStorageSync('dailytools_logs');
            console.log('日志已清空');
        }
        catch (error) {
            console.error('清空日志失败', error);
        }
    };
    /**
     * 设置调试模式
     * @param debug 是否开启调试模式
     */
    LoggerService.setDebugMode = function (debug) {
        this.isDebug = debug;
        this.info('调试模式设置', { debug: debug });
    };
    /**
     * 导出日志为字符串
     */
    LoggerService.exportLogs = function () {
        return this.logs.map(function (log) {
            var time = new Date(log.timestamp).toLocaleString();
            var data = log.data ? JSON.stringify(log.data) : '';
            return "[" + time + "] [" + log.level.toUpperCase() + "] " + log.message + " " + data;
        }).join('\n');
    };
    LoggerService.MAX_LOGS = 100;
    LoggerService.logs = [];
    LoggerService.isDebug = true;
    return LoggerService;
}());
exports.LoggerService = LoggerService;
