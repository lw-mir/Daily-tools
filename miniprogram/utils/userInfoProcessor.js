// 用户信息处理器 - JavaScript版本
const {
  LoggerService
} = require('./logger');

class UserInfoProcessor {
  constructor() {
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

  static getInstance() {
    if (!UserInfoProcessor.instance) {
      UserInfoProcessor.instance = new UserInfoProcessor();
    }
    return UserInfoProcessor.instance;
  }

  /**
   * 处理原始用户信息
   */
  async processUserInfo(rawUserInfo) {
    try {
      LoggerService.info('开始处理用户信息:', rawUserInfo);

      // 1. 验证用户信息
      const validation = this.validateUserInfo(rawUserInfo);
      if (!validation.isValid) {
        LoggerService.warn('用户信息验证失败:', validation.errors);
      }

      // 2. 处理昵称
      const processedNickName = this.processNickName(rawUserInfo.nickName);

      // 3. 验证和处理头像
      const avatarResult = await this.validateAndProcessAvatar(rawUserInfo.avatarUrl);

      // 4. 处理地理位置信息
      const location = this.formatLocation(rawUserInfo.country, rawUserInfo.province, rawUserInfo.city);

      // 5. 生成显示名称
      const displayName = this.generateDisplayName(processedNickName, rawUserInfo.gender);

      const processedInfo = {
        nickName: processedNickName,
        avatarUrl: avatarResult.url,
        gender: this.validateGender(rawUserInfo.gender),
        country: this.sanitizeText(rawUserInfo.country),
        province: this.sanitizeText(rawUserInfo.province),
        city: this.sanitizeText(rawUserInfo.city),
        language: this.validateLanguage(rawUserInfo.language),
        displayName,
        avatarValid: avatarResult.isValid,
        location,
        processedAt: Date.now()
      };

      LoggerService.info('用户信息处理完成:', processedInfo);
      return processedInfo;

    } catch (error) {
      LoggerService.error('处理用户信息失败:', error);
      throw new Error('用户信息处理失败');
    }
  }

  /**
   * 验证用户信息完整性
   */
  validateUserInfo(userInfo) {
    const errors = [];
    const warnings = [];

    // 检查必填字段
    if (!userInfo.nickName || userInfo.nickName.trim() === '') {
      errors.push('昵称不能为空');
    }

    if (!userInfo.avatarUrl || userInfo.avatarUrl.trim() === '') {
      warnings.push('头像URL为空');
    }

    // 检查昵称长度
    if (userInfo.nickName && userInfo.nickName.length > this.MAX_NICKNAME_LENGTH) {
      warnings.push(`昵称过长，将被截断到${this.MAX_NICKNAME_LENGTH}个字符`);
    }

    // 检查性别值
    if (userInfo.gender !== undefined && ![0, 1, 2].includes(userInfo.gender)) {
      warnings.push('性别值无效，将使用默认值');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 处理用户昵称
   */
  processNickName(nickName) {
    if (!nickName || typeof nickName !== 'string') {
      return '微信用户';
    }

    // 去除首尾空格
    let processed = nickName.trim();

    // 长度限制
    if (processed.length > this.MAX_NICKNAME_LENGTH) {
      processed = processed.substring(0, this.MAX_NICKNAME_LENGTH);
      LoggerService.info(`昵称被截断: ${nickName} -> ${processed}`);
    }

    // 敏感词过滤
    const filteredNickName = this.filterSensitiveWords(processed);
    if (filteredNickName !== processed) {
      LoggerService.info(`昵称包含敏感词: ${processed} -> ${filteredNickName}`);
      processed = filteredNickName;
    }

    // 如果处理后为空，使用默认昵称
    if (processed.length === 0) {
      processed = '微信用户';
    }

    return processed;
  }

  /**
   * 敏感词过滤
   */
  filterSensitiveWords(text) {
    let filtered = text;

    this.SENSITIVE_WORDS.forEach(word => {
      const regex = new RegExp(word, 'gi');
      filtered = filtered.replace(regex, '*'.repeat(word.length));
    });

    return filtered;
  }

  /**
   * 验证和处理头像URL
   */
  async validateAndProcessAvatar(avatarUrl) {
    try {
      // 检查URL格式
      if (!avatarUrl || !this.isValidUrl(avatarUrl)) {
        return {
          isValid: false,
          url: this.getRandomDefaultAvatar(),
          fallbackUrl: this.getRandomDefaultAvatar(),
          needsRefresh: false
        };
      }

      // 检查是否为微信头像URL
      if (!this.isWechatAvatarUrl(avatarUrl)) {
        LoggerService.warn('非微信头像URL:', avatarUrl);
        return {
          isValid: false,
          url: this.getRandomDefaultAvatar(),
          fallbackUrl: this.getRandomDefaultAvatar(),
          needsRefresh: false
        };
      }

      // 尝试验证头像可访问性
      const isAccessible = await this.checkAvatarAccessibility(avatarUrl);

      if (isAccessible) {
        return {
          isValid: true,
          url: avatarUrl,
          fallbackUrl: this.getRandomDefaultAvatar(),
          needsRefresh: false
        };
      } else {
        LoggerService.warn('头像URL不可访问:', avatarUrl);
        return {
          isValid: false,
          url: this.getRandomDefaultAvatar(),
          fallbackUrl: this.getRandomDefaultAvatar(),
          needsRefresh: true
        };
      }

    } catch (error) {
      LoggerService.error('头像验证失败:', error);
      return {
        isValid: false,
        url: this.getRandomDefaultAvatar(),
        fallbackUrl: this.getRandomDefaultAvatar(),
        needsRefresh: false
      };
    }
  }

  /**
   * 检查URL格式
   */
  isValidUrl(url) {
    try {
      const urlPattern = /^https?:\/\/.+/;
      return urlPattern.test(url);
    } catch (error) {
      return false;
    }
  }

  /**
   * 检查是否为微信头像URL
   */
  isWechatAvatarUrl(url) {
    const wechatDomains = [
      'wx.qlogo.cn',
      'thirdwx.qlogo.cn',
      'mmhead.qpic.cn'
    ];

    return wechatDomains.some(domain => url.includes(domain));
  }

  /**
   * 检查头像可访问性
   */
  async checkAvatarAccessibility(url) {
    return new Promise((resolve) => {
      // 在小程序中，我们无法直接检查URL可访问性
      // 这里使用简单的格式验证作为替代
      const timeout = setTimeout(() => {
        resolve(true); // 默认认为可访问
      }, 1000);

      // 清理超时
      clearTimeout(timeout);
      resolve(true);
    });
  }

  /**
   * 获取随机默认头像
   */
  getRandomDefaultAvatar() {
    const index = Math.floor(Math.random() * this.DEFAULT_AVATARS.length);
    return this.DEFAULT_AVATARS[index];
  }

  /**
   * 验证性别值
   */
  validateGender(gender) {
    if ([0, 1, 2].includes(gender)) {
      return gender;
    }
    return 0; // 默认为未知
  }

  /**
   * 验证语言代码
   */
  validateLanguage(language) {
    const supportedLanguages = ['zh_CN', 'zh_TW', 'en'];
    if (supportedLanguages.includes(language)) {
      return language;
    }
    return 'zh_CN'; // 默认简体中文
  }

  /**
   * 格式化地理位置
   */
  formatLocation(country, province, city) {
    const parts = [
      this.sanitizeText(country),
      this.sanitizeText(province),
      this.sanitizeText(city)
    ].filter(part => part && part !== '');

    if (parts.length === 0) {
      return '未知';
    }

    // 去重相邻重复的地名
    const uniqueParts = parts.filter((part, index) =>
      index === 0 || part !== parts[index - 1]
    );

    return uniqueParts.join(' ');
  }

  /**
   * 生成显示名称
   */
  generateDisplayName(nickName, gender) {
    const genderEmoji = this.getGenderEmoji(gender);
    return `${genderEmoji} ${nickName}`;
  }

  /**
   * 获取性别表情符号
   */
  getGenderEmoji(gender) {
    switch (gender) {
      case 1:
        return '👨'; // 男性
      case 2:
        return '👩'; // 女性
      default:
        return '👤'; // 未知
    }
  }

  /**
   * 文本清理
   */
  sanitizeText(text) {
    if (!text || typeof text !== 'string') {
      return '';
    }

    return text.trim()
      .replace(/[<>\"'&]/g, '') // 移除HTML特殊字符
      .replace(/\s+/g, ' '); // 压缩空白字符
  }

  /**
   * 检查用户信息是否需要更新
   */
  isUserInfoOutdated(lastUpdate) {
    const now = Date.now();
    const daysSinceUpdate = (now - lastUpdate) / (24 * 60 * 60 * 1000);
    return daysSinceUpdate > 7; // 7天后认为过期
  }

  /**
   * 生成用户信息摘要
   */
  generateUserSummary(userInfo) {
    const parts = [
      `昵称: ${userInfo.nickName}`,
      `位置: ${userInfo.location}`,
      `性别: ${this.getGenderText(userInfo.gender)}`,
      `头像: ${userInfo.avatarValid ? '有效' : '无效'}`
    ];

    return parts.join(' | ');
  }

  /**
   * 获取性别文本
   */
  getGenderText(gender) {
    switch (gender) {
      case 1:
        return '男';
      case 2:
        return '女';
      default:
        return '未知';
    }
  }

  /**
   * 比较两个用户信息是否相同
   */
  compareUserInfo(info1, info2) {
    const keys = ['nickName', 'avatarUrl', 'gender', 'country', 'province', 'city'];
    return keys.every(key => info1[key] === info2[key]);
  }

  /**
   * 获取用户信息变更摘要
   */
  getUserInfoChanges(oldInfo, newInfo) {
    const changes = [];

    if (oldInfo.nickName !== newInfo.nickName) {
      changes.push(`昵称: ${oldInfo.nickName} -> ${newInfo.nickName}`);
    }

    if (oldInfo.avatarUrl !== newInfo.avatarUrl) {
      changes.push('头像已更新');
    }

    if (oldInfo.location !== newInfo.location) {
      changes.push(`位置: ${oldInfo.location} -> ${newInfo.location}`);
    }

    return changes;
  }
}

// 导出单例实例
const userInfoProcessor = UserInfoProcessor.getInstance();

module.exports = {
  UserInfoProcessor,
  userInfoProcessor
};