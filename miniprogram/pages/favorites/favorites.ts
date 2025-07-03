import { dataManager } from '../../utils/dataManager'

interface Tool {
  id: string
  name: string
  icon: string
  description: string
  category: string
  path: string
  isFavorite: boolean
}

Page({
  data: {
    favoriteTools: [] as Tool[],
    isLoading: false,
    isEmpty: false
  },

  onLoad() {
    console.log('[Favorites] 页面加载')
    this.loadFavorites()
  },

  onShow() {
    console.log('[Favorites] 页面显示')
    this.loadFavorites()
  },

  onPullDownRefresh() {
    console.log('[Favorites] 下拉刷新')
    this.loadFavorites()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  /**
   * 加载收藏列表
   */
  async loadFavorites() {
    this.setData({ isLoading: true })
    
    try {
      // 获取收藏的工具ID列表
      const favoriteToolIds = await dataManager.getFavoriteTools()
      console.log('[Favorites] 收藏的工具ID:', favoriteToolIds)
      
      // 获取所有工具信息
      const allTools = this.getAllTools()
      
      // 筛选出已收藏的工具
      const favoriteTools = allTools.filter(tool => favoriteToolIds.includes(tool.id))
      
      // 更新收藏状态
      favoriteTools.forEach(tool => {
        tool.isFavorite = true
      })
      
      console.log('[Favorites] 收藏的工具列表:', favoriteTools)
      
      this.setData({
        favoriteTools,
        isEmpty: favoriteTools.length === 0,
        isLoading: false
      })
      
    } catch (error) {
      console.error('[Favorites] 加载收藏列表失败:', error)
      this.setData({
        favoriteTools: [],
        isEmpty: true,
        isLoading: false
      })
      
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      })
    }
  },

  /**
   * 获取所有工具列表
   */
  getAllTools(): Tool[] {
    return [
      {
        id: 'calculator',
        name: '计算器',
        icon: '🔢',
        description: '基础数学计算工具',
        category: 'calculator',
        path: '/pages/tools/calculator/calculator',
        isFavorite: true
      },
      {
        id: 'converter',
        name: '单位转换',
        icon: '📏',
        description: '长度、重量、温度等单位转换',
        category: 'converter',
        path: '/pages/tools/converter/converter',
        isFavorite: true
      },
      {
        id: 'foodwheel',
        name: '转盘工具',
        icon: '🎯',
        description: '随机选择和决策转盘',
        category: 'converter',
        path: '/pages/tools/foodwheel/foodwheel',
        isFavorite: true
      },
      {
        id: 'qrcode',
        name: '二维码',
        icon: '📱',
        description: '二维码生成和识别',
        category: 'qrcode',
        path: '/pages/tools/qrcode/qrcode',
        isFavorite: false
      }
    ]
  },

  /**
   * 点击工具项，跳转到对应工具页面
   */
  onToolTap(e: any) {
    const tool = e.currentTarget.dataset.tool
    if (!tool) {
      console.error('[Favorites] 工具数据为空')
      return
    }
    
    console.log('[Favorites] 点击工具:', tool.name, tool.path)
    this.navigateToTool(tool)
  },

  /**
   * 跳转到工具页面
   */
  navigateToTool(tool: Tool) {
    if (!tool.path) {
      wx.showToast({
        title: '工具页面不存在',
        icon: 'error'
      })
      return
    }
    
    wx.navigateTo({
      url: tool.path,
      success: () => {
        console.log('[Favorites] 成功跳转到:', tool.path)
      },
      fail: (error) => {
        console.error('[Favorites] 跳转失败:', error)
        wx.showToast({
          title: '跳转失败',
          icon: 'error'
        })
      }
    })
  },

  /**
   * 跳转到首页
   */
  navigateToHome() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
}) 