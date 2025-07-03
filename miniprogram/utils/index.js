"use strict";
/**
 * 通用工具函数
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathUtils = exports.ColorUtils = exports.formatBytes = exports.getFileExtension = exports.isValidEmail = exports.isValidPhone = exports.generateId = exports.deepClone = exports.throttle = exports.debounce = exports.formatTime = void 0;
/**
 * 格式化时间
 * @param timestamp 时间戳
 * @param format 格式化字符串
 */
function formatTime(timestamp, format) {
    if (format === void 0) { format = 'YYYY-MM-DD HH:mm:ss'; }
    var date = new Date(timestamp);
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    var hour = date.getHours().toString().padStart(2, '0');
    var minute = date.getMinutes().toString().padStart(2, '0');
    var second = date.getSeconds().toString().padStart(2, '0');
    return format
        .replace('YYYY', year.toString())
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hour)
        .replace('mm', minute)
        .replace('ss', second);
}
exports.formatTime = formatTime;
/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param delay 延迟时间
 */
function debounce(func, delay) {
    var timeoutId;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(function () { return func.apply(void 0, args); }, delay);
    };
}
exports.debounce = debounce;
/**
 * 节流函数
 * @param func 要节流的函数
 * @param delay 延迟时间
 */
function throttle(func, delay) {
    var lastExecTime = 0;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var currentTime = Date.now();
        if (currentTime - lastExecTime > delay) {
            func.apply(void 0, args);
            lastExecTime = currentTime;
        }
    };
}
exports.throttle = throttle;
/**
 * 深拷贝
 * @param obj 要拷贝的对象
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    if (obj instanceof Array) {
        return obj.map(function (item) { return deepClone(item); });
    }
    if (typeof obj === 'object') {
        var clonedObj = {};
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
    return obj;
}
exports.deepClone = deepClone;
/**
 * 生成唯一ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
exports.generateId = generateId;
/**
 * 验证手机号
 * @param phone 手机号
 */
function isValidPhone(phone) {
    var phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
}
exports.isValidPhone = isValidPhone;
/**
 * 验证邮箱
 * @param email 邮箱
 */
function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
exports.isValidEmail = isValidEmail;
/**
 * 获取文件扩展名
 * @param filename 文件名
 */
function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}
exports.getFileExtension = getFileExtension;
/**
 * 字节转换为可读格式
 * @param bytes 字节数
 */
function formatBytes(bytes) {
    if (bytes === 0)
        return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
exports.formatBytes = formatBytes;
/**
 * 颜色格式转换
 */
exports.ColorUtils = {
    /**
     * RGB转HEX
     */
    rgbToHex: function (r, g, b) {
        return '#' + [r, g, b].map(function (x) {
            var hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    },
    /**
     * HEX转RGB
     */
    hexToRgb: function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
};
/**
 * 数学计算工具
 */
exports.MathUtils = {
    /**
     * 精确加法
     */
    add: function (a, b) {
        var aDecimal = (a.toString().split('.')[1] || '').length;
        var bDecimal = (b.toString().split('.')[1] || '').length;
        var maxDecimal = Math.max(aDecimal, bDecimal);
        var multiplier = Math.pow(10, maxDecimal);
        return (Math.round(a * multiplier) + Math.round(b * multiplier)) / multiplier;
    },
    /**
     * 精确减法
     */
    subtract: function (a, b) {
        return this.add(a, -b);
    },
    /**
     * 精确乘法
     */
    multiply: function (a, b) {
        var aDecimal = (a.toString().split('.')[1] || '').length;
        var bDecimal = (b.toString().split('.')[1] || '').length;
        var multiplier = Math.pow(10, aDecimal + bDecimal);
        return (Math.round(a * Math.pow(10, aDecimal)) * Math.round(b * Math.pow(10, bDecimal))) / multiplier;
    },
    /**
     * 精确除法
     */
    divide: function (a, b) {
        if (b === 0)
            throw new Error('除数不能为零');
        var aDecimal = (a.toString().split('.')[1] || '').length;
        var bDecimal = (b.toString().split('.')[1] || '').length;
        return (Math.round(a * Math.pow(10, aDecimal)) / Math.round(b * Math.pow(10, bDecimal))) * Math.pow(10, bDecimal - aDecimal);
    }
};
