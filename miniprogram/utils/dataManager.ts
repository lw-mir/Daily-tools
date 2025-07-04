/**
 * 数据管理器
 * 统一管理应用的所有数据存储和操作
 */
import { StorageService } from './storage'

// 数据模型接口定义
export interface UserProfile {
  id?: string
  nickName: string
  avatarUrl: string
  gender: number
  city: string
  province: string
  country: string
  language: string
  isLoggedIn: boolean
  loginTime?: number
}

export interface ToolUsageRecord {
  toolId: string
  toolName: string
  category: string
  timestamp: number
  duration?: number // 使用时长（毫秒）
  data?: any // 工具特定数据
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto'
  language: 'zh-CN' | 'en-US'
  notifications: {
    enabled: boolean
    dailyReminder: boolean
    updateNotice: boolean
  }
  privacy: {
    dataCollection: boolean
    usageAnalytics: boolean
  }
  performance: {
    enableCache: boolean
    preloadTools: boolean
  }
}

export interface CalculatorHistory {
  id: string
  expression: string
  result: string
  timestamp: number
  type: 'basic' | 'scientific'
}

export interface ConversionHistory {
  id: string
  fromValue: number
  fromUnit: string
  toValue: number
  toUnit: string
  category: string
  timestamp: number
}

export interface AppStatistics {
  totalUsageTime: number // 总使用时长
  totalSessions: number // 总会话数
  toolUsageCount: Record<string, number> // 各工具使用次数
  dailyUsage: Record<string, number> // 每日使用时长
  firstUseTime: number // 首次使用时间
  lastUseTime: number // 最后使用时间
  activeDays: number // 活跃天数
}

/**
 * 数据管理器类
 */
export class DataManager {
  private static instance: DataManager
  private initialized: boolean

  constructor() {
    this.initialized = false
  }

  // 存储键名常量
  private static readonly KEYS = {
    USER_PROFILE: 'user_profile',
    USER_SETTINGS: 'user_settings',
    RECENT_TOOLS: 'recent_tools',
    FAVORITE_TOOLS: 'favorite_tools',
    USAGE_HISTORY: 'usage_history',
    CALCULATOR_HISTORY: 'calculator_history',
    CONVERSION_HISTORY: 'conversion_history',
    APP_STATISTICS: 'app_statistics',
    CACHE_DATA: 'cache_data'
  }

  // 默认设置
  private static readonly DEFAULT_SETTINGS: UserSettings = {
    theme: 'auto',
    language: 'zh-CN',
    notifications: {
      enabled: true,
      dailyReminder: false,
      updateNotice: true
    },
    privacy: {
      dataCollection: true,
      usageAnalytics: true
    },
    performance: {
      enableCache: true,
      preloadTools: false
    }
  }

  private static readonly DEFAULT_STATISTICS: AppStatistics = {
    totalUsageTime: 0,
    totalSessions: 0,
    toolUsageCount: {},
    dailyUsage: {},
    firstUseTime: Date.now(),
    lastUseTime: Date.now(),
    activeDays: 0
  }

  /**
   * 获取单例实例
   */
  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager()
    }
    return DataManager.instance
  }

  /**
   * 初始化数据管理器
   */
  async init(): Promise<void> {
    if (this.initialized) return

    try {
      // 初始化存储服务
      StorageService.init()

      // 检查并初始化默认数据
      await this.initializeDefaultData()

      // 清理过期数据
      await this.cleanExpiredData()

      this.initialized = true
      console.log('DataManager 初始化完成')
    } catch (error) {
      console.error('DataManager 初始化失败:', error)
      throw error
    }
  }

  /**
   * 初始化默认数据
   */
  private async initializeDefaultData(): Promise<void> {
    // 初始化用户设置
    const settings = await this.getUserSettings()
    if (!settings) {
      await this.saveUserSettings(DataManager.DEFAULT_SETTINGS)
    }

    // 初始化统计数据
    const statistics = await this.getAppStatistics()
    if (!statistics) {
      await this.saveAppStatistics(DataManager.DEFAULT_STATISTICS)
    }

    // 初始化空数组
    const recentTools = await this.getRecentTools()
    if (!recentTools) {
      await this.saveRecentTools([])
    }

    const favoriteTools = await this.getFavoriteTools()
    if (!favoriteTools) {
      await this.saveFavoriteTools([])
    }
  }

  /**
   * 清理过期数据
   */
  private async cleanExpiredData(): Promise<void> {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000

    // 清理30天前的使用历史
    const usageHistory = await this.getUsageHistory()
    if (usageHistory) {
      const filteredHistory = usageHistory.filter(record => record.timestamp > thirtyDaysAgo)
      if (filteredHistory.length !== usageHistory.length) {
        await this.saveUsageHistory(filteredHistory)
      }
    }

    // 清理30天前的计算器历史
    const calculatorHistory = await this.getCalculatorHistory()
    if (calculatorHistory) {
      const filteredHistory = calculatorHistory.filter(record => record.timestamp > thirtyDaysAgo)
      if (filteredHistory.length !== calculatorHistory.length) {
        await this.saveCalculatorHistory(filteredHistory)
      }
    }

    // 清理30天前的转换历史
    const conversionHistory = await this.getConversionHistory()
    if (conversionHistory) {
      const filteredHistory = conversionHistory.filter(record => record.timestamp > thirtyDaysAgo)
      if (filteredHistory.length !== conversionHistory.length) {
        await this.saveConversionHistory(filteredHistory)
      }
    }
  }

  // ===== 用户资料管理 =====

  /**
   * 获取用户资料
   */
  async getUserProfile(): Promise<UserProfile | null> {
    return await StorageService.getAsync(DataManager.KEYS.USER_PROFILE)
  }

  /**
   * 保存用户资料
   */
  async saveUserProfile(profile: UserProfile): Promise<boolean> {
    return await StorageService.setAsync(DataManager.KEYS.USER_PROFILE, profile)
  }

  /**
   * 更新用户登录状态
   */
  async updateLoginStatus(isLoggedIn: boolean): Promise<boolean> {
    const profile = await this.getUserProfile()
    if (profile) {
      profile.isLoggedIn = isLoggedIn
      profile.loginTime = isLoggedIn ? Date.now() : undefined
      return await this.saveUserProfile(profile)
    }
    return false
  }

  // ===== 用户设置管理 =====

  /**
   * 获取用户设置
   */
  async getUserSettings(): Promise<UserSettings | null> {
    return await StorageService.getAsync(DataManager.KEYS.USER_SETTINGS)
  }

  /**
   * 保存用户设置
   */
  async saveUserSettings(settings: UserSettings): Promise<boolean> {
    return await StorageService.setAsync(DataManager.KEYS.USER_SETTINGS, settings)
  }

  /**
   * 更新单个设置项
   */
  async updateSetting(key: keyof UserSettings, value: UserSettings[keyof UserSettings]): Promise<boolean> {
    const settings = await this.getUserSettings() || DataManager.DEFAULT_SETTINGS
    ;(settings as any)[key] = value
    return await this.saveUserSettings(settings)
  }

  // ===== 最近使用工具管理 =====

  /**
   * 获取最近使用工具
   */
  async getRecentTools(): Promise<string[]> {
    return await StorageService.getAsync(DataManager.KEYS.RECENT_TOOLS, [])
  }

  /**
   * 保存最近使用工具
   */
  async saveRecentTools(tools: string[]): Promise<boolean> {
    return await StorageService.setAsync(DataManager.KEYS.RECENT_TOOLS, tools)
  }

  /**
   * 添加最近使用工具
   */
  async addRecentTool(toolId: string): Promise<boolean> {
    const recentTools = await this.getRecentTools()
    const index = recentTools.indexOf(toolId)
    
    // 如果已存在，先移除
    if (index > -1) {
      recentTools.splice(index, 1)
    }
    
    // 添加到开头
    recentTools.unshift(toolId)
    
    // 限制数量为10个
    if (recentTools.length > 10) {
      recentTools.splice(10)
    }
    
    return await this.saveRecentTools(recentTools)
  }

  /**
   * 清空最近使用工具
   */
  async clearRecentTools(): Promise<boolean> {
    return await this.saveRecentTools([])
  }

  // ===== 收藏工具管理 =====

  /**
   * 获取收藏工具
   */
  async getFavoriteTools(): Promise<string[]> {
    return await StorageService.getAsync(DataManager.KEYS.FAVORITE_TOOLS, [])
  }

  /**
   * 保存收藏工具
   */
  async saveFavoriteTools(tools: string[]): Promise<boolean> {
    return await StorageService.setAsync(DataManager.KEYS.FAVORITE_TOOLS, tools)
  }

  /**
   * 切换收藏状态
   */
  async toggleFavorite(toolId: string): Promise<{ success: boolean; isFavorite: boolean; message?: string }> {
    const favoriteTools = await this.getFavoriteTools()
    const index = favoriteTools.indexOf(toolId)
    
    if (index > -1) {
      // 已收藏，取消收藏
      favoriteTools.splice(index, 1)
      const success = await this.saveFavoriteTools(favoriteTools)
      return { success, isFavorite: false }
    } else {
      // 未收藏，添加收藏
      if (favoriteTools.length >= 20) {
        return { success: false, isFavorite: false, message: '最多收藏20个工具' }
      }
      
      favoriteTools.push(toolId)
      const success = await this.saveFavoriteTools(favoriteTools)
      return { success, isFavorite: true }
    }
  }

  /**
   * 检查是否已收藏
   */
  async isFavorite(toolId: string): Promise<boolean> {
    const favoriteTools = await this.getFavoriteTools()
    return favoriteTools.includes(toolId)
  }

  // ===== 使用历史管理 =====

  /**
   * 获取使用历史
   */
  async getUsageHistory(): Promise<ToolUsageRecord[]> {
    return await StorageService.getAsync(DataManager.KEYS.USAGE_HISTORY, [])
  }

  /**
   * 保存使用历史
   */
  async saveUsageHistory(history: ToolUsageRecord[]): Promise<boolean> {
    return await StorageService.setAsync(DataManager.KEYS.USAGE_HISTORY, history)
  }

  /**
   * 添加使用记录
   */
  async addUsageRecord(record: Omit<ToolUsageRecord, 'timestamp'>): Promise<boolean> {
    const history = await this.getUsageHistory()
    const newRecord: ToolUsageRecord = {
      ...record,
      timestamp: Date.now()
    }
    
    history.unshift(newRecord)
    
    // 限制历史记录数量为1000条
    if (history.length > 1000) {
      history.splice(1000)
    }
    
    // 同时更新统计数据
    await this.updateStatistics(record.toolId, record.duration)
    
    return await this.saveUsageHistory(history)
  }

  /**
   * 清空使用历史
   */
  async clearUsageHistory(): Promise<boolean> {
    return await this.saveUsageHistory([])
  }

  // ===== 计算器历史管理 =====

  /**
   * 获取计算器历史
   */
  async getCalculatorHistory(): Promise<CalculatorHistory[]> {
    return await StorageService.getAsync(DataManager.KEYS.CALCULATOR_HISTORY, [])
  }

  /**
   * 保存计算器历史
   */
  async saveCalculatorHistory(history: CalculatorHistory[]): Promise<boolean> {
    return await StorageService.setAsync(DataManager.KEYS.CALCULATOR_HISTORY, history)
  }

  /**
   * 添加计算器记录
   */
  async addCalculatorRecord(record: Omit<CalculatorHistory, 'id' | 'timestamp'>): Promise<boolean> {
    const history = await this.getCalculatorHistory()
    const newRecord: CalculatorHistory = {
      ...record,
      id: Date.now().toString(),
      timestamp: Date.now()
    }
    
    history.unshift(newRecord)
    
    // 限制历史记录数量为100条
    if (history.length > 100) {
      history.splice(100)
    }
    
    return await this.saveCalculatorHistory(history)
  }

  /**
   * 清空计算器历史
   */
  async clearCalculatorHistory(): Promise<boolean> {
    return await this.saveCalculatorHistory([])
  }

  // ===== 转换历史管理 =====

  /**
   * 获取转换历史
   */
  async getConversionHistory(): Promise<ConversionHistory[]> {
    return await StorageService.getAsync(DataManager.KEYS.CONVERSION_HISTORY, [])
  }

  /**
   * 保存转换历史
   */
  async saveConversionHistory(history: ConversionHistory[]): Promise<boolean> {
    return await StorageService.setAsync(DataManager.KEYS.CONVERSION_HISTORY, history)
  }

  /**
   * 添加转换记录
   */
  async addConversionRecord(record: Omit<ConversionHistory, 'id' | 'timestamp'>): Promise<boolean> {
    const history = await this.getConversionHistory()
    const newRecord: ConversionHistory = {
      ...record,
      id: Date.now().toString(),
      timestamp: Date.now()
    }
    
    history.unshift(newRecord)
    
    // 限制历史记录数量为100条
    if (history.length > 100) {
      history.splice(100)
    }
    
    return await this.saveConversionHistory(history)
  }

  /**
   * 清空转换历史
   */
  async clearConversionHistory(): Promise<boolean> {
    return await this.saveConversionHistory([])
  }

  // ===== 统计数据管理 =====

  /**
   * 获取应用统计数据
   */
  async getAppStatistics(): Promise<AppStatistics | null> {
    return await StorageService.getAsync(DataManager.KEYS.APP_STATISTICS)
  }

  /**
   * 保存应用统计数据
   */
  async saveAppStatistics(statistics: AppStatistics): Promise<boolean> {
    return await StorageService.setAsync(DataManager.KEYS.APP_STATISTICS, statistics)
  }

  /**
   * 更新统计数据
   */
  async updateStatistics(toolId: string, duration?: number): Promise<boolean> {
    const statistics = await this.getAppStatistics() || DataManager.DEFAULT_STATISTICS
    const today = new Date().toDateString()
    
    // 更新工具使用次数
    statistics.toolUsageCount[toolId] = (statistics.toolUsageCount[toolId] || 0) + 1
    
    // 更新总会话数
    statistics.totalSessions += 1
    
    // 更新使用时长
    if (duration) {
      statistics.totalUsageTime += duration
      statistics.dailyUsage[today] = (statistics.dailyUsage[today] || 0) + duration
    }
    
    // 更新最后使用时间
    statistics.lastUseTime = Date.now()
    
    // 更新活跃天数
    // const firstUseDate = new Date(statistics.firstUseTime).toDateString()
    // const daysDiff = Math.floor((Date.now() - statistics.firstUseTime) / (24 * 60 * 60 * 1000))
    const uniqueDays = Object.keys(statistics.dailyUsage).length
    statistics.activeDays = Math.max(uniqueDays, 1)
    
    return await this.saveAppStatistics(statistics)
  }

  // ===== 缓存管理 =====

  /**
   * 获取缓存数据
   */
  async getCacheData(key: string): Promise<any> {
    const cacheData = await StorageService.getAsync<Record<string, any>>(DataManager.KEYS.CACHE_DATA, {})
    return cacheData[key]
  }

  /**
   * 设置缓存数据
   */
  async setCacheData(key: string, value: any, expireTime?: number): Promise<boolean> {
    const cacheData = await StorageService.getAsync<Record<string, any>>(DataManager.KEYS.CACHE_DATA, {})
    cacheData[key] = {
      value,
      timestamp: Date.now(),
      expireTime: expireTime || (Date.now() + 24 * 60 * 60 * 1000) // 默认24小时过期
    }
    return await StorageService.setAsync(DataManager.KEYS.CACHE_DATA, cacheData)
  }

  /**
   * 清理过期缓存
   */
  async cleanExpiredCache(): Promise<boolean> {
    const cacheData = await StorageService.getAsync<Record<string, any>>(DataManager.KEYS.CACHE_DATA, {})
    const now = Date.now()
    const cleanedData: Record<string, any> = {}
    
    Object.keys(cacheData).forEach(key => {
      const item = cacheData[key]
      if (item.expireTime > now) {
        cleanedData[key] = item
      }
    })
    
    return await StorageService.setAsync(DataManager.KEYS.CACHE_DATA, cleanedData)
  }

  // ===== 数据导出导入 =====

  /**
   * 导出所有数据
   */
  async exportAllData(): Promise<any> {
    const data = {
      userProfile: await this.getUserProfile(),
      userSettings: await this.getUserSettings(),
      recentTools: await this.getRecentTools(),
      favoriteTools: await this.getFavoriteTools(),
      usageHistory: await this.getUsageHistory(),
      calculatorHistory: await this.getCalculatorHistory(),
      conversionHistory: await this.getConversionHistory(),
      appStatistics: await this.getAppStatistics(),
      exportTime: Date.now(),
      version: '1.0.0'
    }
    
    return data
  }

  /**
   * 导入数据
   */
  async importData(data: any): Promise<boolean> {
    try {
      if (data.userProfile) await this.saveUserProfile(data.userProfile)
      if (data.userSettings) await this.saveUserSettings(data.userSettings)
      if (data.recentTools) await this.saveRecentTools(data.recentTools)
      if (data.favoriteTools) await this.saveFavoriteTools(data.favoriteTools)
      if (data.usageHistory) await this.saveUsageHistory(data.usageHistory)
      if (data.calculatorHistory) await this.saveCalculatorHistory(data.calculatorHistory)
      if (data.conversionHistory) await this.saveConversionHistory(data.conversionHistory)
      if (data.appStatistics) await this.saveAppStatistics(data.appStatistics)
      
      return true
    } catch (error) {
      console.error('导入数据失败:', error)
      return false
    }
  }

  /**
   * 获取存储使用情况
   */
  async getStorageUsage(): Promise<{ used: number; total: number; percentage: number }> {
    const info = StorageService.getInfo()
    return {
      used: info.currentSize || 0,
      total: info.limitSize || 10 * 1024, // 微信小程序默认10MB
      percentage: info.limitSize ? (info.currentSize / info.limitSize) * 100 : 0
    }
  }

  /**
   * 清理所有数据
   */
  async clearAllData(): Promise<boolean> {
    try {
      const keys = Object.values(DataManager.KEYS)
      for (const key of keys) {
        StorageService.remove(key)
      }
      
      // 重新初始化默认数据
      await this.initializeDefaultData()
      
      return true
    } catch (error) {
      console.error('清理数据失败:', error)
      return false
    }
  }

  /**
   * 获取用户统计数据
   */
  async getUserStats(): Promise<{
    totalUsage: number;
    toolsUsed: number;
    daysActive: number;
    favorites: number;
  } | null> {
    try {
      const [statistics, favoriteTools, usageHistory] = await Promise.all([
        this.getAppStatistics(),
        this.getFavoriteTools(),
        this.getUsageHistory()
      ]);

      if (!statistics || !favoriteTools || !usageHistory) {
        return null;
      }

      const toolsUsed = Object.keys(statistics.toolUsageCount).length;
      const daysActive = Object.keys(statistics.dailyUsage).length;

      return {
        totalUsage: statistics.totalSessions,
        toolsUsed,
        daysActive,
        favorites: favoriteTools.length
      };
    } catch (error) {
      console.error('Failed to get user stats:', error);
      return null;
    }
  }

  /**
   * 记录工具使用
   */
  async recordToolUsage(toolId: string, toolName?: string): Promise<boolean> {
    try {
      const record: Omit<ToolUsageRecord, 'timestamp'> = {
        toolId,
        toolName: toolName || toolId,
        category: 'general'
      };

      await this.addUsageRecord(record);
      await this.updateStatistics(toolId);
      await this.addRecentTool(toolId);

      return true;
    } catch (error) {
      console.error('Failed to record tool usage:', error);
      return false;
    }
  }

  /**
   * 移除收藏工具
   */
  async removeFavoriteTool(toolId: string): Promise<boolean> {
    try {
      const favoriteTools = await this.getFavoriteTools();
      if (!favoriteTools) return false;

      const updatedTools = favoriteTools.filter(id => id !== toolId);
      return await this.saveFavoriteTools(updatedTools);
    } catch (error) {
      console.error('Failed to remove favorite tool:', error);
      return false;
    }
  }

  /**
   * 更新用户设置
   */
  async updateUserSettings(updates: Partial<UserSettings>): Promise<boolean> {
    try {
      const currentSettings = await this.getUserSettings();
      if (!currentSettings) return false;

      const updatedSettings = { ...currentSettings, ...updates };
      return await this.saveUserSettings(updatedSettings);
    } catch (error) {
      console.error('Failed to update user settings:', error);
      return false;
    }
  }

  /**
   * 获取缓存信息
   */
  async getCacheInfo(): Promise<{ size: number; items: number } | null> {
    try {
      const storageUsage = await this.getStorageUsage();
      return {
        size: storageUsage.used,
        items: Object.keys(wx.getStorageInfoSync().keys).length
      };
    } catch (error) {
      console.error('Failed to get cache info:', error);
      return null;
    }
  }

  /**
   * 清理缓存
   */
  async clearCache(): Promise<boolean> {
    try {
      // 清理过期缓存
      await this.cleanExpiredCache();
      
      // 清理30天前的使用历史
      const usageHistory = await this.getUsageHistory();
      if (usageHistory) {
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const filteredHistory = usageHistory.filter(record => record.timestamp > thirtyDaysAgo);
        await this.saveUsageHistory(filteredHistory);
      }

      return true;
    } catch (error) {
      console.error('Failed to clear cache:', error);
      return false;
    }
  }

  /**
   * 获取最近使用工具（带时间戳）
   */
  async getRecentToolsWithTimestamp(limit: number = 5): Promise<Array<{toolId: string, timestamp: number}>> {
    try {
      const usageHistory = await this.getUsageHistory();
      if (!usageHistory) return [];

      // 按时间戳排序并去重
      const recentMap = new Map<string, number>();
      usageHistory
        .sort((a, b) => b.timestamp - a.timestamp)
        .forEach(record => {
          if (!recentMap.has(record.toolId)) {
            recentMap.set(record.toolId, record.timestamp);
          }
        });

      return Array.from(recentMap.entries())
        .map(([toolId, timestamp]) => ({ toolId, timestamp }))
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to get recent tools with timestamp:', error);
      return [];
    }
  }
}

// 导出单例实例
export const dataManager = DataManager.getInstance() 