// app.ts
// import { dataManager } from './utils/dataManager'

// 应用配置
const APP_CONFIG = {
  version: '1.0.0',
  name: 'Dailytools',
  description: '日常工具集合',
  maxRecentTools: 10,
  maxFavoriteTools: 20
}

App<IAppOption>({
  globalData: {
    version: APP_CONFIG.version,
    theme: 'light' as 'light' | 'dark',
    recentTools: [] as string[],
    favoriteTools: [] as string[],
    systemInfo: undefined as WechatMiniprogram.SystemInfo | undefined,
    userInfo: undefined as WechatMiniprogram.UserInfo | undefined
  },

  async onLaunch(options: any) {
    console.log('应用启动', options)
    
    try {
      // 动态导入数据管理器
      const { DataManager } = require('./utils/dataManager') as any
      const dataManager = DataManager.getInstance()
      
      // 初始化数据管理器
      await dataManager.init()
      
      // 获取系统信息
      this.getSystemInfo!()

      // 加载用户数据
      await this.loadUserData!()

      // 获取用户登录状态
      this.checkLoginStatus!()
    } catch (error) {
      console.error('应用启动失败:', error)
    }
  },

  onShow(options: any) {
    console.log('应用显示', options)
  },

  onHide() {
    console.log('应用隐藏')
    // 数据管理器会自动处理数据保存
  },

  onError(error: string) {
    console.error('应用错误', error)
  },

  /**
   * 获取系统信息
   */
  getSystemInfo() {
    try {
      const systemInfo = wx.getSystemInfoSync()
      // 存储系统信息到全局数据
      this.globalData.systemInfo = systemInfo
      
      // 根据系统主题设置应用主题
      if (systemInfo.theme) {
        this.globalData.theme = systemInfo.theme
      }
      
      console.log('系统信息获取成功', systemInfo)
    } catch (error) {
      console.error('获取系统信息失败', error)
    }
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    wx.checkSession({
      success: () => {
        console.log('登录状态有效')
      },
      fail: () => {
        console.log('登录状态失效，重新登录')
        this.doLogin!()
      }
    })
  },

  /**
   * 执行登录
   */
  doLogin() {
    wx.login({
      success: (res) => {
        if (res.code) {
          console.log('登录成功', res.code)
          // 这里可以发送 res.code 到后台换取 openId, sessionKey, unionId
        } else {
          console.error('登录失败', res.errMsg)
        }
      },
      fail: (error) => {
        console.error('登录失败', error)
      }
    })
  },

  /**
   * 加载用户数据
   */
  async loadUserData() {
    try {
      const { DataManager } = require('./utils/dataManager') as any
      const dataManager = DataManager.getInstance()
      
      const recentTools = await dataManager.getRecentTools()
      const favoriteTools = await dataManager.getFavoriteTools()
      const settings = await dataManager.getUserSettings()

      this.globalData.recentTools = recentTools
      this.globalData.favoriteTools = favoriteTools
      this.globalData.theme = (settings && settings.theme === 'dark') ? 'dark' : 'light'

      console.log('用户数据加载成功')
    } catch (error) {
      console.error('用户数据加载失败', error)
    }
  },

  /**
   * 添加最近使用工具
   */
  async addRecentTool(toolId: string) {
    try {
      const { DataManager } = require('./utils/dataManager') as any
      const dataManager = DataManager.getInstance()
      
      await dataManager.addRecentTool(toolId)
      // 更新全局数据
      this.globalData.recentTools = await dataManager.getRecentTools()
      console.log('添加最近使用工具', { toolId })
    } catch (error) {
      console.error('添加最近使用工具失败:', error)
    }
  },

  /**
   * 切换收藏工具
   */
  async toggleFavoriteTool(toolId: string) {
    try {
      const { DataManager } = require('./utils/dataManager') as any
      const dataManager = DataManager.getInstance()
      
      const result = await dataManager.toggleFavorite(toolId)
      
      if (result.success) {
        // 更新全局数据
        this.globalData.favoriteTools = await dataManager.getFavoriteTools()
        
        const action = result.isFavorite ? '收藏' : '取消收藏'
        console.log(`${action}工具`, { toolId })
        
        wx.showToast({
          title: `${action}成功`,
          icon: 'success'
        })
      } else if (result.message) {
        wx.showToast({
          title: result.message,
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('切换收藏状态失败:', error)
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      })
    }
  }
})