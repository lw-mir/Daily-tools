// 用户数据存储管理器
import { StorageService } from './storage';
import { LoggerService } from './logger';

// 用户数据接口定义
export interface UserLoginState {
  isLoggedIn: boolean;
  userInfo: ProcessedUserInfo | null;
  loginTime: number;
  expireTime: number;
  refreshToken?: string;
  sessionId?: string;
}

export interface ProcessedUserInfo {
  nickName: string;
  avatarUrl: string;
  gender: number;
  country: string;
  province: string;
  city: string;
  language: string;
  displayName: string;
  avatarValid: boolean;
  location: string;
  processedAt: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'zh-CN' | 'en-US';
  fontSize: 'small' | 'medium' | 'large';
  notifications: {
    enabled: boolean;
    dailyReminder: boolean;
    updateNotice: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
  };
  privacy: {
    dataCollection: boolean;
    usageAnalytics: boolean;
    shareUsageData: boolean;
    allowPersonalization: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reduceMotion: boolean;
    screenReader: boolean;
  };
}

export interface UserActivityData {
  totalUsageTime: number;
  dailyUsage: Record<string, number>; // 日期 -> 使用时长
  sessionCount: number;
  lastActiveTime: number;
  firstUseTime: number;
  streakDays: number;
  longestStreak: number;
}

export interface UserToolData {
  favoriteTools: string[];
  recentTools: Array<{
    toolId: string;
    toolName: string;
    lastUsed: number;
    usageCount: number;
  }>;
  toolUsageStats: Record<string, {
    totalUsage: number;
    totalTime: number;
    averageTime: number;
    lastUsed: number;
    favoriteAt?: number;
  }>;
  toolSettings: Record<string, any>; // 各工具的个性化设置
}

export interface UserDataBackup {
  version: string;
  timestamp: number;
  userInfo: ProcessedUserInfo | null;
  preferences: UserPreferences;
  activityData: UserActivityData;
  toolData: UserToolData;
  checksum: string;
}

export interface UserDataSyncStatus {
  lastSyncTime: number;
  syncVersion: number;
  needsSync: boolean;
  syncErrors: string[];
  pendingChanges: string[];
}

/**
 * 用户数据存储管理器
 * 专门处理用户相关的数据存储、同步、备份等功能
 */
export class UserDataStorage {
  private static instance: UserDataStorage;
  
  // 存储键名常量
  private static readonly KEYS = {
    LOGIN_STATE: 'user_login_state',
    USER_INFO: 'user_info',
    PREFERENCES: 'user_preferences',
    ACTIVITY_DATA: 'user_activity_data',
    TOOL_DATA: 'user_tool_data',
    BACKUP_DATA: 'user_backup_data',
    SYNC_STATUS: 'user_sync_status',
    ENCRYPTED_DATA: 'user_encrypted_data'
  };

  // 数据版本（用于数据迁移）
  private static readonly DATA_VERSION = '1.0.0';
  
  // 数据过期时间
  private static readonly EXPIRE_TIMES = {
    LOGIN_STATE: 7 * 24 * 60 * 60 * 1000, // 7天
    CACHE_DATA: 24 * 60 * 60 * 1000, // 1天
    BACKUP_RETENTION: 30 * 24 * 60 * 60 * 1000, // 30天
  };

  // 默认配置
  private static readonly DEFAULT_PREFERENCES: UserPreferences = {
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

  private static readonly DEFAULT_ACTIVITY_DATA: UserActivityData = {
    totalUsageTime: 0,
    dailyUsage: {},
    sessionCount: 0,
    lastActiveTime: 0,
    firstUseTime: Date.now(),
    streakDays: 0,
    longestStreak: 0,
  };

  private static readonly DEFAULT_TOOL_DATA: UserToolData = {
    favoriteTools: [],
    recentTools: [],
    toolUsageStats: {},
    toolSettings: {},
  };

  private constructor() {}

  static getInstance(): UserDataStorage {
    if (!UserDataStorage.instance) {
      UserDataStorage.instance = new UserDataStorage();
    }
    return UserDataStorage.instance;
  }

  // ==================== 登录状态管理 ====================

  /**
   * 保存用户登录状态
   */
  async saveLoginState(loginState: UserLoginState): Promise<boolean> {
    try {
      const success = await StorageService.setAsync(
        UserDataStorage.KEYS.LOGIN_STATE,
        {
          ...loginState,
          savedAt: Date.now(),
          version: UserDataStorage.DATA_VERSION
        }
      );
      
      if (success) {
        LoggerService.info('用户登录状态保存成功');
        await this.updateSyncStatus(['login_state']);
      }
      
      return success;
    } catch (error) {
      LoggerService.error('保存用户登录状态失败:', error);
      return false;
    }
  }

  /**
   * 获取用户登录状态
   */
  async getLoginState(): Promise<UserLoginState | null> {
    try {
      const data = await StorageService.getAsync(UserDataStorage.KEYS.LOGIN_STATE);
      
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

  /**
   * 清除用户登录状态
   */
  async clearLoginState(): Promise<boolean> {
    try {
      const success = StorageService.remove(UserDataStorage.KEYS.LOGIN_STATE);
      if (success) {
        LoggerService.info('用户登录状态已清除');
        await this.updateSyncStatus(['login_state']);
      }
      return success;
    } catch (error) {
      LoggerService.error('清除用户登录状态失败:', error);
      return false;
    }
  }

  /**
   * 更新用户信息
   */
  async updateUserInfo(userInfo: ProcessedUserInfo): Promise<boolean> {
    try {
      const loginState = await this.getLoginState();
      if (!loginState) {
        LoggerService.warn('用户未登录，无法更新用户信息');
        return false;
      }

      const updatedLoginState: UserLoginState = {
        ...loginState,
        userInfo: {
          ...userInfo,
          processedAt: Date.now()
        }
      };

      return await this.saveLoginState(updatedLoginState);
    } catch (error) {
      LoggerService.error('更新用户信息失败:', error);
      return false;
    }
  }

  // ==================== 用户偏好设置管理 ====================

  /**
   * 保存用户偏好设置
   */
  async saveUserPreferences(preferences: UserPreferences): Promise<boolean> {
    try {
      const success = await StorageService.setAsync(
        UserDataStorage.KEYS.PREFERENCES,
        {
          ...preferences,
          updatedAt: Date.now(),
          version: UserDataStorage.DATA_VERSION
        }
      );
      
      if (success) {
        LoggerService.info('用户偏好设置保存成功');
        await this.updateSyncStatus(['preferences']);
      }
      
      return success;
    } catch (error) {
      LoggerService.error('保存用户偏好设置失败:', error);
      return false;
    }
  }

  /**
   * 获取用户偏好设置
   */
  async getUserPreferences(): Promise<UserPreferences> {
    try {
      const data = await StorageService.getAsync(UserDataStorage.KEYS.PREFERENCES);
      
      if (!data) {
        // 返回默认设置并保存
        await this.saveUserPreferences(UserDataStorage.DEFAULT_PREFERENCES);
        return UserDataStorage.DEFAULT_PREFERENCES;
      }

      // 合并默认设置（处理新增字段）
      const mergedPreferences = this.mergeWithDefaults(
        data,
        UserDataStorage.DEFAULT_PREFERENCES
      );

      return mergedPreferences;
    } catch (error) {
      LoggerService.error('获取用户偏好设置失败:', error);
      return UserDataStorage.DEFAULT_PREFERENCES;
    }
  }

  /**
   * 更新部分用户偏好设置
   */
  async updateUserPreferences(updates: Partial<UserPreferences>): Promise<boolean> {
    try {
      const currentPreferences = await this.getUserPreferences();
      const updatedPreferences = this.deepMerge(currentPreferences, updates);
      
      return await this.saveUserPreferences(updatedPreferences);
    } catch (error) {
      LoggerService.error('更新用户偏好设置失败:', error);
      return false;
    }
  }

  // ==================== 用户活动数据管理 ====================

  /**
   * 保存用户活动数据
   */
  async saveUserActivityData(activityData: UserActivityData): Promise<boolean> {
    try {
      const success = await StorageService.setAsync(
        UserDataStorage.KEYS.ACTIVITY_DATA,
        {
          ...activityData,
          updatedAt: Date.now(),
          version: UserDataStorage.DATA_VERSION
        }
      );
      
      if (success) {
        LoggerService.info('用户活动数据保存成功');
        await this.updateSyncStatus(['activity_data']);
      }
      
      return success;
    } catch (error) {
      LoggerService.error('保存用户活动数据失败:', error);
      return false;
    }
  }

  /**
   * 获取用户活动数据
   */
  async getUserActivityData(): Promise<UserActivityData> {
    try {
      const data = await StorageService.getAsync(UserDataStorage.KEYS.ACTIVITY_DATA);
      
      if (!data) {
        await this.saveUserActivityData(UserDataStorage.DEFAULT_ACTIVITY_DATA);
        return UserDataStorage.DEFAULT_ACTIVITY_DATA;
      }

      return data;
    } catch (error) {
      LoggerService.error('获取用户活动数据失败:', error);
      return UserDataStorage.DEFAULT_ACTIVITY_DATA;
    }
  }

  /**
   * 记录用户活动
   */
  async recordUserActivity(duration: number): Promise<boolean> {
    try {
      const activityData = await this.getUserActivityData();
      const today = this.getDateString(new Date());
      const now = Date.now();

      // 更新活动数据
      const updatedActivityData: UserActivityData = {
        ...activityData,
        totalUsageTime: activityData.totalUsageTime + duration,
        dailyUsage: {
          ...activityData.dailyUsage,
          [today]: (activityData.dailyUsage[today] || 0) + duration
        },
        sessionCount: activityData.sessionCount + 1,
        lastActiveTime: now
      };

      // 计算连续使用天数
      const streak = this.calculateStreak(updatedActivityData.dailyUsage);
      updatedActivityData.streakDays = streak.current;
      updatedActivityData.longestStreak = Math.max(streak.longest, updatedActivityData.longestStreak);

      return await this.saveUserActivityData(updatedActivityData);
    } catch (error) {
      LoggerService.error('记录用户活动失败:', error);
      return false;
    }
  }

  // ==================== 用户工具数据管理 ====================

  /**
   * 保存用户工具数据
   */
  async saveUserToolData(toolData: UserToolData): Promise<boolean> {
    try {
      const success = await StorageService.setAsync(
        UserDataStorage.KEYS.TOOL_DATA,
        {
          ...toolData,
          updatedAt: Date.now(),
          version: UserDataStorage.DATA_VERSION
        }
      );
      
      if (success) {
        LoggerService.info('用户工具数据保存成功');
        await this.updateSyncStatus(['tool_data']);
      }
      
      return success;
    } catch (error) {
      LoggerService.error('保存用户工具数据失败:', error);
      return false;
    }
  }

  /**
   * 获取用户工具数据
   */
  async getUserToolData(): Promise<UserToolData> {
    try {
      const data = await StorageService.getAsync(UserDataStorage.KEYS.TOOL_DATA);
      
      if (!data) {
        await this.saveUserToolData(UserDataStorage.DEFAULT_TOOL_DATA);
        return UserDataStorage.DEFAULT_TOOL_DATA;
      }

      return data;
    } catch (error) {
      LoggerService.error('获取用户工具数据失败:', error);
      return UserDataStorage.DEFAULT_TOOL_DATA;
    }
  }

  /**
   * 添加收藏工具
   */
  async addFavoriteTool(toolId: string): Promise<boolean> {
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

  /**
   * 移除收藏工具
   */
  async removeFavoriteTool(toolId: string): Promise<boolean> {
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

  /**
   * 记录工具使用
   */
  async recordToolUsage(toolId: string, toolName: string, duration?: number): Promise<boolean> {
    try {
      const toolData = await this.getUserToolData();
      const now = Date.now();
      
      // 更新最近使用工具
      const existingRecentIndex = toolData.recentTools.findIndex(tool => tool.toolId === toolId);
      
      if (existingRecentIndex > -1) {
        // 更新现有记录
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

  // ==================== 数据备份和恢复 ====================

  /**
   * 创建数据备份
   */
  async createDataBackup(): Promise<UserDataBackup | null> {
    try {
      const loginState = await this.getLoginState();
      const preferences = await this.getUserPreferences();
      const activityData = await this.getUserActivityData();
      const toolData = await this.getUserToolData();
      
      const backup: UserDataBackup = {
        version: UserDataStorage.DATA_VERSION,
        timestamp: Date.now(),
        userInfo: loginState?.userInfo || null,
        preferences,
        activityData,
        toolData,
        checksum: ''
      };
      
      // 生成校验和
      backup.checksum = this.generateChecksum(backup);
      
      // 保存备份
      await StorageService.setAsync(UserDataStorage.KEYS.BACKUP_DATA, backup);
      
      LoggerService.info('数据备份创建成功');
      return backup;
    } catch (error) {
      LoggerService.error('创建数据备份失败:', error);
      return null;
    }
  }

  /**
   * 恢复数据备份
   */
  async restoreDataBackup(backup: UserDataBackup): Promise<boolean> {
    try {
      // 验证备份数据
      const expectedChecksum = this.generateChecksum({
        ...backup,
        checksum: ''
      });
      
      if (backup.checksum !== expectedChecksum) {
        LoggerService.error('备份数据校验失败');
        return false;
      }
      
      // 恢复数据
      if (backup.userInfo) {
        const loginState: UserLoginState = {
          isLoggedIn: true,
          userInfo: backup.userInfo,
          loginTime: Date.now(),
          expireTime: Date.now() + UserDataStorage.EXPIRE_TIMES.LOGIN_STATE
        };
        await this.saveLoginState(loginState);
      }
      
      await this.saveUserPreferences(backup.preferences);
      await this.saveUserActivityData(backup.activityData);
      await this.saveUserToolData(backup.toolData);
      
      LoggerService.info('数据备份恢复成功');
      return true;
    } catch (error) {
      LoggerService.error('恢复数据备份失败:', error);
      return false;
    }
  }

  // ==================== 数据同步管理 ====================

  /**
   * 获取同步状态
   */
  async getSyncStatus(): Promise<UserDataSyncStatus> {
    try {
      const data = await StorageService.getAsync(UserDataStorage.KEYS.SYNC_STATUS);
      
      if (!data) {
        const defaultStatus: UserDataSyncStatus = {
          lastSyncTime: 0,
          syncVersion: 1,
          needsSync: false,
          syncErrors: [],
          pendingChanges: []
        };
        await StorageService.setAsync(UserDataStorage.KEYS.SYNC_STATUS, defaultStatus);
        return defaultStatus;
      }
      
      return data;
    } catch (error) {
      LoggerService.error('获取同步状态失败:', error);
      return {
        lastSyncTime: 0,
        syncVersion: 1,
        needsSync: false,
        syncErrors: [],
        pendingChanges: []
      };
    }
  }

  /**
   * 更新同步状态
   */
  async updateSyncStatus(changedKeys: string[]): Promise<boolean> {
    try {
      const syncStatus = await this.getSyncStatus();
      
      // 添加待同步的更改
      const newPendingChanges = [...new Set([...syncStatus.pendingChanges, ...changedKeys])];
      
      const updatedStatus: UserDataSyncStatus = {
        ...syncStatus,
        needsSync: newPendingChanges.length > 0,
        pendingChanges: newPendingChanges
      };
      
      await StorageService.setAsync(UserDataStorage.KEYS.SYNC_STATUS, updatedStatus);
      return true;
    } catch (error) {
      LoggerService.error('更新同步状态失败:', error);
      return false;
    }
  }

  // ==================== 数据清理和维护 ====================

  /**
   * 清理过期数据
   */
  async cleanExpiredData(): Promise<boolean> {
    try {
      const now = Date.now();
      
      // 清理过期的登录状态
      const loginState = await this.getLoginState();
      if (loginState && loginState.expireTime < now) {
        await this.clearLoginState();
      }
      
      // 清理过期的活动数据（保留90天）
      const activityData = await this.getUserActivityData();
      const ninetyDaysAgo = now - 90 * 24 * 60 * 60 * 1000;
      
      const filteredDailyUsage: Record<string, number> = {};
      for (const [date, usage] of Object.entries(activityData.dailyUsage)) {
        const dateTime = new Date(date).getTime();
        if (dateTime > ninetyDaysAgo) {
          filteredDailyUsage[date] = usage;
        }
      }
      
      if (Object.keys(filteredDailyUsage).length !== Object.keys(activityData.dailyUsage).length) {
        await this.saveUserActivityData({
          ...activityData,
          dailyUsage: filteredDailyUsage
        });
      }
      
      LoggerService.info('过期数据清理完成');
      return true;
    } catch (error) {
      LoggerService.error('清理过期数据失败:', error);
      return false;
    }
  }

  /**
   * 获取存储使用情况
   */
  async getStorageUsage(): Promise<{
    total: number;
    used: number;
    byCategory: Record<string, number>;
  }> {
    try {
      const storageInfo = StorageService.getInfo();
      const byCategory: Record<string, number> = {};
      
      // 计算各类数据占用
      for (const [category, key] of Object.entries(UserDataStorage.KEYS)) {
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

  /**
   * 清空所有用户数据
   */
  async clearAllUserData(): Promise<boolean> {
    try {
      const clearPromises = Object.values(UserDataStorage.KEYS).map(key => 
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

  // ==================== 辅助方法 ====================

  /**
   * 深度合并对象
   */
  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  /**
   * 合并默认设置
   */
  private mergeWithDefaults(data: any, defaults: any): any {
    const result = { ...defaults };
    
    for (const key in data) {
      if (data[key] && typeof data[key] === 'object' && !Array.isArray(data[key])) {
        result[key] = this.mergeWithDefaults(data[key], defaults[key] || {});
      } else {
        result[key] = data[key];
      }
    }
    
    return result;
  }

  /**
   * 获取日期字符串
   */
  private getDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * 计算连续使用天数
   */
  private calculateStreak(dailyUsage: Record<string, number>): {
    current: number;
    longest: number;
  } {
    const dates = Object.keys(dailyUsage).sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = this.getDateString(new Date());
    
    for (let i = dates.length - 1; i >= 0; i--) {
      const date = dates[i];
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - (dates.length - 1 - i));
      
      if (date === this.getDateString(expectedDate)) {
        tempStreak++;
        if (date === today || i === dates.length - 1) {
          currentStreak = tempStreak;
        }
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
    
    return { current: currentStreak, longest: longestStreak };
  }

  /**
   * 生成校验和
   */
  private generateChecksum(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    
    return Math.abs(hash).toString(16);
  }
}

// 导出单例实例
export const userDataStorage = UserDataStorage.getInstance(); 