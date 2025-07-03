// 用户数据存储管理器 - JavaScript版本
const {
  StorageService
} = require('./storage');
const {
  LoggerService
} = require('./logger');

class UserDataStorage {
  constructor() {
    // 存储键名常量
    this.KEYS = {
      LOGIN_STATE: 'user_login_state',
      USER_INFO: 'user_info',
      PREFERENCES: 'user_preferences',
      TOOL_DATA: 'user_tool_data',
      BACKUP_DATA: 'user_backup_data'
    };

    // 数据版本
    this.DATA_VERSION = '1.0.0';

    // 数据过期时间
    this.EXPIRE_TIMES = {
      LOGIN_STATE: 7 * 24 * 60 * 60 * 1000, // 7天
      CACHE_DATA: 24 * 60 * 60 * 1000, // 1天
    };

    // 默认配置
    this.DEFAULT_PREFERENCES = {
      theme: 'auto',
      language: 'zh-CN',
      fontSize: 'medium',
      notifications: {
        enabled: true,
        dailyReminder: false,
        updateNotice: true,
        soundEnabled: true,
        vibrationEnabled: true,
      },
      privacy: {
        dataCollection: true,
        usageAnalytics: true,
        shareUsageData: false,
        allowPersonalization: true,
      },
      accessibility: {
        highContrast: false,
        reduceMotion: false,
        screenReader: false,
      },
    };

    this.DEFAULT_TOOL_DATA = {
      favoriteTools: [],
      recentTools: [],
      toolUsageStats: {},
      toolSettings: {},
    };
  }

  static getInstance() {
    if (!UserDataStorage.instance) {
      UserDataStorage.instance = new UserDataStorage();
    }
    return UserDataStorage.instance;
  }

  // 登录状态管理
  async saveLoginState(loginState) {
    try {
      const success = await StorageService.setAsync(
        this.KEYS.LOGIN_STATE, {
          ...loginState,
          savedAt: Date.now(),
          version: this.DATA_VERSION
        }
      );

      if (success) {
        LoggerService.info('用户登录状态保存成功');
      }

      return success;
    } catch (error) {
      LoggerService.error('保存用户登录状态失败:', error);
      return false;
    }
  }

  async getLoginState() {
    try {
      const data = await StorageService.getAsync(this.KEYS.LOGIN_STATE);

      if (!data) {
        return null;
      }

      // 检查数据是否过期
      const now = Date.now();
      if (data.expireTime && data.expireTime < now) {
        LoggerService.info('用户登录状态已过期');
        await this.clearLoginState();
        return null;
      }

      return data;
    } catch (error) {
      LoggerService.error('获取用户登录状态失败:', error);
      return null;
    }
  }

  async clearLoginState() {
    try {
      const success = StorageService.remove(this.KEYS.LOGIN_STATE);
      if (success) {
        LoggerService.info('用户登录状态已清除');
      }
      return success;
    } catch (error) {
      LoggerService.error('清除用户登录状态失败:', error);
      return false;
    }
  }

  // 用户偏好设置管理
  async saveUserPreferences(preferences) {
    try {
      const success = await StorageService.setAsync(
        this.KEYS.PREFERENCES, {
          ...preferences,
          updatedAt: Date.now(),
          version: this.DATA_VERSION
        }
      );

      if (success) {
        LoggerService.info('用户偏好设置保存成功');
      }

      return success;
    } catch (error) {
      LoggerService.error('保存用户偏好设置失败:', error);
      return false;
    }
  }

  async getUserPreferences() {
    try {
      const data = await StorageService.getAsync(this.KEYS.PREFERENCES);

      if (!data) {
        await this.saveUserPreferences(this.DEFAULT_PREFERENCES);
        return this.DEFAULT_PREFERENCES;
      }

      return this.mergeWithDefaults(data, this.DEFAULT_PREFERENCES);
    } catch (error) {
      LoggerService.error('获取用户偏好设置失败:', error);
      return this.DEFAULT_PREFERENCES;
    }
  }

  async updateUserPreferences(updates) {
    try {
      const currentPreferences = await this.getUserPreferences();
      const updatedPreferences = this.mergeWithDefaults(updates, currentPreferences);

      return await this.saveUserPreferences(updatedPreferences);
    } catch (error) {
      LoggerService.error('更新用户偏好设置失败:', error);
      return false;
    }
  }

  // 工具数据管理
  async saveUserToolData(toolData) {
    try {
      const success = await StorageService.setAsync(
        this.KEYS.TOOL_DATA, {
          ...toolData,
          updatedAt: Date.now(),
          version: this.DATA_VERSION
        }
      );

      if (success) {
        LoggerService.info('用户工具数据保存成功');
      }

      return success;
    } catch (error) {
      LoggerService.error('保存用户工具数据失败:', error);
      return false;
    }
  }

  async getUserToolData() {
    try {
      const data = await StorageService.getAsync(this.KEYS.TOOL_DATA);

      if (!data) {
        await this.saveUserToolData(this.DEFAULT_TOOL_DATA);
        return this.DEFAULT_TOOL_DATA;
      }

      return data;
    } catch (error) {
      LoggerService.error('获取用户工具数据失败:', error);
      return this.DEFAULT_TOOL_DATA;
    }
  }

  async addFavoriteTool(toolId) {
    try {
      const toolData = await this.getUserToolData();

      if (!toolData.favoriteTools.includes(toolId)) {
        toolData.favoriteTools.push(toolId);

        // 更新工具统计
        if (!toolData.toolUsageStats[toolId]) {
          toolData.toolUsageStats[toolId] = {
            totalUsage: 0,
            totalTime: 0,
            averageTime: 0,
            lastUsed: 0
          };
        }
        toolData.toolUsageStats[toolId].favoriteAt = Date.now();

        return await this.saveUserToolData(toolData);
      }

      return true;
    } catch (error) {
      LoggerService.error('添加收藏工具失败:', error);
      return false;
    }
  }

  async removeFavoriteTool(toolId) {
    try {
      const toolData = await this.getUserToolData();
      const index = toolData.favoriteTools.indexOf(toolId);

      if (index > -1) {
        toolData.favoriteTools.splice(index, 1);

        // 更新工具统计
        if (toolData.toolUsageStats[toolId]) {
          delete toolData.toolUsageStats[toolId].favoriteAt;
        }

        return await this.saveUserToolData(toolData);
      }

      return true;
    } catch (error) {
      LoggerService.error('移除收藏工具失败:', error);
      return false;
    }
  }

  async recordToolUsage(toolId, toolName, duration) {
    try {
      const toolData = await this.getUserToolData();
      const now = Date.now();

      // 更新最近使用工具
      const existingRecentIndex = toolData.recentTools.findIndex(tool => tool.toolId === toolId);

      if (existingRecentIndex > -1) {
        toolData.recentTools[existingRecentIndex] = {
          ...toolData.recentTools[existingRecentIndex],
          lastUsed: now,
          usageCount: toolData.recentTools[existingRecentIndex].usageCount + 1
        };

        // 移到最前面
        const recentTool = toolData.recentTools.splice(existingRecentIndex, 1)[0];
        toolData.recentTools.unshift(recentTool);
      } else {
        // 添加新记录
        toolData.recentTools.unshift({
          toolId,
          toolName,
          lastUsed: now,
          usageCount: 1
        });
      }

      // 限制最近使用工具数量
      if (toolData.recentTools.length > 20) {
        toolData.recentTools = toolData.recentTools.slice(0, 20);
      }

      // 更新工具使用统计
      if (!toolData.toolUsageStats[toolId]) {
        toolData.toolUsageStats[toolId] = {
          totalUsage: 0,
          totalTime: 0,
          averageTime: 0,
          lastUsed: 0
        };
      }

      const stats = toolData.toolUsageStats[toolId];
      stats.totalUsage += 1;
      stats.lastUsed = now;

      if (duration) {
        stats.totalTime += duration;
        stats.averageTime = stats.totalTime / stats.totalUsage;
      }

      return await this.saveUserToolData(toolData);
    } catch (error) {
      LoggerService.error('记录工具使用失败:', error);
      return false;
    }
  }

  // 数据清理
  async clearAllUserData() {
    try {
      const clearPromises = Object.values(this.KEYS).map(key =>
        StorageService.remove(key)
      );

      await Promise.all(clearPromises);

      LoggerService.info('所有用户数据已清空');
      return true;
    } catch (error) {
      LoggerService.error('清空用户数据失败:', error);
      return false;
    }
  }

  // 获取存储使用情况
  async getStorageUsage() {
    try {
      const storageInfo = StorageService.getInfo();
      const byCategory = {};

      // 计算各类数据占用
      for (const [category, key] of Object.entries(this.KEYS)) {
        try {
          const data = await StorageService.getAsync(key);
          if (data) {
            byCategory[category] = JSON.stringify(data).length;
          }
        } catch (error) {
          byCategory[category] = 0;
        }
      }

      return {
        total: storageInfo.limitSize || 10 * 1024 * 1024, // 默认10MB
        used: storageInfo.currentSize || 0,
        byCategory
      };
    } catch (error) {
      LoggerService.error('获取存储使用情况失败:', error);
      return {
        total: 0,
        used: 0,
        byCategory: {}
      };
    }
  }

  // 辅助方法
  mergeWithDefaults(data, defaults) {
    const result = {
      ...defaults
    };

    for (const key in data) {
      if (data[key] && typeof data[key] === 'object' && !Array.isArray(data[key])) {
        result[key] = this.mergeWithDefaults(data[key], defaults[key] || {});
      } else {
        result[key] = data[key];
      }
    }

    return result;
  }
}

// 导出
module.exports = {
  UserDataStorage,
  userDataStorage: UserDataStorage.getInstance()
};