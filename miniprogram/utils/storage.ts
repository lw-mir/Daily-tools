/**
 * 存储服务工具类
 * 封装微信小程序的存储API，提供统一的数据存储接口
 */
export class StorageService {
  private static readonly PREFIX = 'dailytools_'

  /**
   * 初始化存储服务
   */
  static init() {
    console.log('StorageService 初始化完成')
  }

  /**
   * 存储数据
   * @param key 存储键名
   * @param value 存储值
   */
  static set(key: string, value: any): boolean {
    try {
      const fullKey = this.PREFIX + key
      wx.setStorageSync(fullKey, value)
      return true
    } catch (error) {
      console.error(`存储数据失败: ${key}`, error)
      return false
    }
  }

  /**
   * 获取数据
   * @param key 存储键名
   * @param defaultValue 默认值
   */
  static get<T = any>(key: string, defaultValue?: T): T {
    try {
      const fullKey = this.PREFIX + key
      const value = wx.getStorageSync(fullKey)
      return value !== '' ? value : defaultValue
    } catch (error) {
      console.error(`获取数据失败: ${key}`, error)
      return defaultValue as T
    }
  }

  /**
   * 删除数据
   * @param key 存储键名
   */
  static remove(key: string): boolean {
    try {
      const fullKey = this.PREFIX + key
      wx.removeStorageSync(fullKey)
      return true
    } catch (error) {
      console.error(`删除数据失败: ${key}`, error)
      return false
    }
  }

  /**
   * 清空所有数据
   */
  static clear(): boolean {
    try {
      wx.clearStorageSync()
      return true
    } catch (error) {
      console.error('清空存储失败', error)
      return false
    }
  }

  /**
   * 获取存储信息
   */
  static getInfo(): any {
    try {
      return wx.getStorageInfoSync()
    } catch (error) {
      console.error('获取存储信息失败', error)
      return {
        keys: [],
        currentSize: 0,
        limitSize: 0
      }
    }
  }

  /**
   * 异步存储数据
   * @param key 存储键名
   * @param value 存储值
   */
  static async setAsync(key: string, value: any): Promise<boolean> {
    return new Promise((resolve) => {
      const fullKey = this.PREFIX + key
      wx.setStorage({
        key: fullKey,
        data: value,
        success: () => resolve(true),
        fail: (error) => {
          console.error(`异步存储数据失败: ${key}`, error)
          resolve(false)
        }
      })
    })
  }

  /**
   * 异步获取数据
   * @param key 存储键名
   * @param defaultValue 默认值
   */
  static async getAsync<T = any>(key: string, defaultValue?: T): Promise<T> {
    return new Promise((resolve) => {
      const fullKey = this.PREFIX + key
      wx.getStorage({
        key: fullKey,
        success: (res) => resolve(res.data),
        fail: () => resolve(defaultValue as T)
      })
    })
  }
} 