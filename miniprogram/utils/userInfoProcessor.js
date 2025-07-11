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
exports.userInfoProcessor = exports.UserInfoProcessor = void 0;
// 用户信息处理器
var logger_1 = require("./logger");
var UserInfoProcessor = /** @class */ (function () {
    function UserInfoProcessor() {
        // 敏感词列表（简化版）
        this.SENSITIVE_WORDS = [
            '管理员', 'admin', '客服', '官方', '系统',
            '测试', 'test', '微信', 'wechat', '腾讯'
        ];
        // 默认头像URLs
        this.DEFAULT_AVATARS = [
            '/images/default-avatar-1.png',
            '/images/default-avatar-2.png',
            '/images/default-avatar-3.png'
        ];
        // 昵称最大长度
        this.MAX_NICKNAME_LENGTH = 20;
        // 头像URL缓存时间（24小时）
        this.AVATAR_CACHE_TIME = 24 * 60 * 60 * 1000;
    }
    UserInfoProcessor.getInstance = function () {
        if (!UserInfoProcessor.instance) {
            UserInfoProcessor.instance = new UserInfoProcessor();
        }
        return UserInfoProcessor.instance;
    };
    /**
     * 处理原始用户信息
     */
    UserInfoProcessor.prototype.processUserInfo = function (rawUserInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var validation, processedNickName, avatarResult, location, displayName, processedInfo, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        logger_1.LoggerService.info('开始处理用户信息:', rawUserInfo);
                        validation = this.validateUserInfo(rawUserInfo);
                        if (!validation.isValid) {
                            logger_1.LoggerService.warn('用户信息验证失败:', validation.errors);
                        }
                        processedNickName = this.processNickName(rawUserInfo.nickName);
                        return [4 /*yield*/, this.validateAndProcessAvatar(rawUserInfo.avatarUrl)];
                    case 1:
                        avatarResult = _a.sent();
                        location = this.formatLocation(rawUserInfo.country, rawUserInfo.province, rawUserInfo.city);
                        displayName = this.generateDisplayName(processedNickName, rawUserInfo.gender);
                        processedInfo = {
                            nickName: processedNickName,
                            avatarUrl: avatarResult.url,
                            gender: this.validateGender(rawUserInfo.gender),
                            country: this.sanitizeText(rawUserInfo.country),
                            province: this.sanitizeText(rawUserInfo.province),
                            city: this.sanitizeText(rawUserInfo.city),
                            language: this.validateLanguage(rawUserInfo.language),
                            displayName: displayName,
                            avatarValid: avatarResult.isValid,
                            location: location,
                            processedAt: Date.now()
                        };
                        logger_1.LoggerService.info('用户信息处理完成:', processedInfo);
                        return [2 /*return*/, processedInfo];
                    case 2:
                        error_1 = _a.sent();
                        logger_1.LoggerService.error('处理用户信息失败:', error_1);
                        throw new Error('用户信息处理失败');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 验证用户信息完整性
     */
    UserInfoProcessor.prototype.validateUserInfo = function (userInfo) {
        var errors = [];
        var warnings = [];
        // 检查必填字段
        if (!userInfo.nickName || userInfo.nickName.trim() === '') {
            errors.push('昵称不能为空');
        }
        if (!userInfo.avatarUrl || userInfo.avatarUrl.trim() === '') {
            warnings.push('头像URL为空');
        }
        // 检查昵称长度
        if (userInfo.nickName && userInfo.nickName.length > this.MAX_NICKNAME_LENGTH) {
            warnings.push("\u6635\u79F0\u8FC7\u957F\uFF0C\u5C06\u88AB\u622A\u65AD\u5230" + this.MAX_NICKNAME_LENGTH + "\u4E2A\u5B57\u7B26");
        }
        // 检查性别值
        if (userInfo.gender !== undefined && ![0, 1, 2].includes(userInfo.gender)) {
            warnings.push('性别值无效，将使用默认值');
        }
        return {
            isValid: errors.length === 0,
            errors: errors,
            warnings: warnings
        };
    };
    /**
     * 处理用户昵称
     */
    UserInfoProcessor.prototype.processNickName = function (nickName) {
        if (!nickName || typeof nickName !== 'string') {
            return '微信用户';
        }
        // 去除首尾空格
        var processed = nickName.trim();
        // 长度限制
        if (processed.length > this.MAX_NICKNAME_LENGTH) {
            processed = processed.substring(0, this.MAX_NICKNAME_LENGTH);
            logger_1.LoggerService.info("\u6635\u79F0\u88AB\u622A\u65AD: " + nickName + " -> " + processed);
        }
        // 敏感词过滤
        var filteredNickName = this.filterSensitiveWords(processed);
        if (filteredNickName !== processed) {
            logger_1.LoggerService.info("\u6635\u79F0\u5305\u542B\u654F\u611F\u8BCD: " + processed + " -> " + filteredNickName);
            processed = filteredNickName;
        }
        // 如果处理后为空，使用默认昵称
        if (processed.length === 0) {
            processed = '微信用户';
        }
        return processed;
    };
    /**
     * 敏感词过滤
     */
    UserInfoProcessor.prototype.filterSensitiveWords = function (text) {
        var filtered = text;
        this.SENSITIVE_WORDS.forEach(function (word) {
            var regex = new RegExp(word, 'gi');
            filtered = filtered.replace(regex, '*'.repeat(word.length));
        });
        return filtered;
    };
    /**
     * 验证和处理头像URL
     */
    UserInfoProcessor.prototype.validateAndProcessAvatar = function (avatarUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var isAccessible, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // 检查URL格式
                        if (!avatarUrl || !this.isValidUrl(avatarUrl)) {
                            return [2 /*return*/, {
                                    isValid: false,
                                    url: this.getRandomDefaultAvatar(),
                                    fallbackUrl: this.getRandomDefaultAvatar(),
                                    needsRefresh: false
                                }];
                        }
                        // 检查是否为微信头像URL
                        if (!this.isWechatAvatarUrl(avatarUrl)) {
                            logger_1.LoggerService.warn('非微信头像URL:', avatarUrl);
                            return [2 /*return*/, {
                                    isValid: false,
                                    url: this.getRandomDefaultAvatar(),
                                    fallbackUrl: this.getRandomDefaultAvatar(),
                                    needsRefresh: false
                                }];
                        }
                        return [4 /*yield*/, this.checkAvatarAccessibility(avatarUrl)];
                    case 1:
                        isAccessible = _a.sent();
                        if (isAccessible) {
                            return [2 /*return*/, {
                                    isValid: true,
                                    url: avatarUrl,
                                    fallbackUrl: this.getRandomDefaultAvatar(),
                                    needsRefresh: false
                                }];
                        }
                        else {
                            logger_1.LoggerService.warn('头像URL不可访问:', avatarUrl);
                            return [2 /*return*/, {
                                    isValid: false,
                                    url: this.getRandomDefaultAvatar(),
                                    fallbackUrl: this.getRandomDefaultAvatar(),
                                    needsRefresh: true
                                }];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        logger_1.LoggerService.error('头像验证失败:', error_2);
                        return [2 /*return*/, {
                                isValid: false,
                                url: this.getRandomDefaultAvatar(),
                                fallbackUrl: this.getRandomDefaultAvatar(),
                                needsRefresh: false
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 检查URL格式
     */
    UserInfoProcessor.prototype.isValidUrl = function (url) {
        try {
            var urlPattern = /^https?:\/\/.+/;
            return urlPattern.test(url);
        }
        catch (_a) {
            return false;
        }
    };
    /**
     * 检查是否为微信头像URL
     */
    UserInfoProcessor.prototype.isWechatAvatarUrl = function (url) {
        var wechatDomains = [
            'wx.qlogo.cn',
            'thirdwx.qlogo.cn',
            'mmhead.qpic.cn'
        ];
        return wechatDomains.some(function (domain) { return url.includes(domain); });
    };
    /**
     * 检查头像可访问性
     */
    UserInfoProcessor.prototype.checkAvatarAccessibility = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        // 在小程序中，我们无法直接检查URL可访问性
                        // 这里使用简单的格式验证作为替代
                        var timeout = setTimeout(function () {
                            resolve(true); // 默认认为可访问
                        }, 1000);
                        // 清理超时
                        clearTimeout(timeout);
                        resolve(true);
                    })];
            });
        });
    };
    /**
     * 获取随机默认头像
     */
    UserInfoProcessor.prototype.getRandomDefaultAvatar = function () {
        var index = Math.floor(Math.random() * this.DEFAULT_AVATARS.length);
        return this.DEFAULT_AVATARS[index];
    };
    /**
     * 验证性别值
     */
    UserInfoProcessor.prototype.validateGender = function (gender) {
        if ([0, 1, 2].includes(gender)) {
            return gender;
        }
        return 0; // 默认为未知
    };
    /**
     * 验证语言代码
     */
    UserInfoProcessor.prototype.validateLanguage = function (language) {
        var supportedLanguages = ['zh_CN', 'zh_TW', 'en'];
        if (supportedLanguages.includes(language)) {
            return language;
        }
        return 'zh_CN'; // 默认简体中文
    };
    /**
     * 格式化地理位置
     */
    UserInfoProcessor.prototype.formatLocation = function (country, province, city) {
        var parts = [
            this.sanitizeText(country),
            this.sanitizeText(province),
            this.sanitizeText(city)
        ].filter(function (part) { return part && part !== ''; });
        if (parts.length === 0) {
            return '未知';
        }
        // 去重相邻重复的地名
        var uniqueParts = parts.filter(function (part, index) {
            return index === 0 || part !== parts[index - 1];
        });
        return uniqueParts.join(' ');
    };
    /**
     * 生成显示名称
     */
    UserInfoProcessor.prototype.generateDisplayName = function (nickName, gender) {
        var genderEmoji = this.getGenderEmoji(gender);
        return genderEmoji + " " + nickName;
    };
    /**
     * 获取性别表情符号
     */
    UserInfoProcessor.prototype.getGenderEmoji = function (gender) {
        switch (gender) {
            case 1: return '👨'; // 男性
            case 2: return '👩'; // 女性
            default: return '👤'; // 未知
        }
    };
    /**
     * 文本清理
     */
    UserInfoProcessor.prototype.sanitizeText = function (text) {
        if (!text || typeof text !== 'string') {
            return '';
        }
        return text.trim()
            .replace(/[<>\"'&]/g, '') // 移除HTML特殊字符
            .replace(/\s+/g, ' '); // 压缩空白字符
    };
    /**
     * 检查用户信息是否需要更新
     */
    UserInfoProcessor.prototype.isUserInfoOutdated = function (lastUpdate) {
        var now = Date.now();
        var daysSinceUpdate = (now - lastUpdate) / (24 * 60 * 60 * 1000);
        return daysSinceUpdate > 7; // 7天后认为过期
    };
    /**
     * 生成用户信息摘要
     */
    UserInfoProcessor.prototype.generateUserSummary = function (userInfo) {
        var parts = [
            "\u6635\u79F0: " + userInfo.nickName,
            "\u4F4D\u7F6E: " + userInfo.location,
            "\u6027\u522B: " + this.getGenderText(userInfo.gender),
            "\u5934\u50CF: " + (userInfo.avatarValid ? '有效' : '无效')
        ];
        return parts.join(' | ');
    };
    /**
     * 获取性别文本
     */
    UserInfoProcessor.prototype.getGenderText = function (gender) {
        switch (gender) {
            case 1: return '男';
            case 2: return '女';
            default: return '未知';
        }
    };
    /**
     * 比较两个用户信息是否相同
     */
    UserInfoProcessor.prototype.compareUserInfo = function (info1, info2) {
        var keys = [
            'nickName', 'avatarUrl', 'gender', 'country', 'province', 'city'
        ];
        return keys.every(function (key) { return info1[key] === info2[key]; });
    };
    /**
     * 获取用户信息变更摘要
     */
    UserInfoProcessor.prototype.getUserInfoChanges = function (oldInfo, newInfo) {
        var changes = [];
        if (oldInfo.nickName !== newInfo.nickName) {
            changes.push("\u6635\u79F0: " + oldInfo.nickName + " -> " + newInfo.nickName);
        }
        if (oldInfo.avatarUrl !== newInfo.avatarUrl) {
            changes.push('头像已更新');
        }
        if (oldInfo.location !== newInfo.location) {
            changes.push("\u4F4D\u7F6E: " + oldInfo.location + " -> " + newInfo.location);
        }
        return changes;
    };
    return UserInfoProcessor;
}());
exports.UserInfoProcessor = UserInfoProcessor;
// 导出单例实例
exports.userInfoProcessor = UserInfoProcessor.getInstance();
