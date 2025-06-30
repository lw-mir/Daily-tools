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

interface FavoriteStats {
  total: number
  byCategory: Record<string, number>
}

Page({
  data: {
    searchText: '',
    selectedCategory: 'all',
    favoriteTools: [] as Tool[],
    filteredTools: [] as Tool[],
    categories: [
      { id: 'all', name: '全部', count: 0 },
      { id: 'calculator', name: '计算工具', count: 0 },
      { id: 'converter', name: '转换工具', count: 0 },
      { id: 'qrcode', name: '二维码', count: 0 },
      { id: 'text', name: '文本工具', count: 0 },
      { id: 'image', name: '图像工具', count: 0 },
      { id: 'network', name: '网络工具', count: 0 }
    ],
    stats: {
      total: 0,
      byCategory: {}
    } as FavoriteStats,
    isLoading: false,
    isEmpty: false,
    selectedItems: [] as string[],
    isSelectMode: false
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
   * 加载收藏的工具
   */
  async loadFavorites() {
    try {
      this.setData({ isLoading: true })
      
      const favoriteIds = await dataManager.getFavoriteTools()
      const allTools = this.getAllTools()
      
      const favoriteTools = allTools.filter(tool => favoriteIds.includes(tool.id))
      
      // 更新统计信息
      const stats = this.calculateStats(favoriteTools)
      const categories = this.updateCategoryCount(favoriteTools)
      
      this.setData({
        favoriteTools,
        filteredTools: favoriteTools,
        stats,
        categories,
        isEmpty: favoriteTools.length === 0,
        isLoading: false
      })
      
      this.filterTools()
      
    } catch (error) {
      console.error('[Favorites] 加载收藏失败:', error)
      this.setData({ isLoading: false })
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
   * 计算统计信息
   */
  calculateStats(tools: Tool[]): FavoriteStats {
    const byCategory: Record<string, number> = {}
    
    tools.forEach(tool => {
      byCategory[tool.category] = (byCategory[tool.category] || 0) + 1
    })
    
    return {
      total: tools.length,
      byCategory
    }
  },

  /**
   * 更新分类计数
   */
  updateCategoryCount(tools: Tool[]) {
    const categories = [...this.data.categories]
    
    categories.forEach(category => {
      if (category.id === 'all') {
        category.count = tools.length
      } else {
        category.count = tools.filter(tool => tool.category === category.id).length
      }
    })
    
    return categories
  },

  /**
   * 搜索输入
   */
  onSearchInput(e: any) {
    const searchText = e.detail.value
    this.setData({ searchText })
    this.filterTools()
  },

  /**
   * 搜索确认
   */
  onSearchConfirm() {
    this.filterTools()
  },

  /**
   * 清除搜索
   */
  onClearSearch() {
    this.setData({ searchText: '' })
    this.filterTools()
  },

  /**
   * 分类筛选
   */
  onCategoryFilter(e: any) {
    const category = e.currentTarget.dataset.category
    this.setData({ selectedCategory: category })
    this.filterTools()
  },

  /**
   * 筛选工具
   */
  filterTools() {
    const { favoriteTools, searchText, selectedCategory } = this.data
    let filtered = [...favoriteTools]
    
    // 分类筛选
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tool => tool.category === selectedCategory)
    }
    
    // 搜索筛选
    if (searchText.trim()) {
      const keyword = searchText.trim().toLowerCase()
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(keyword) ||
        tool.description.toLowerCase().includes(keyword)
      )
    }
    
    this.setData({ filteredTools: filtered })
  },

  /**
   * 点击工具
   */
  onToolTap(e: any) {
    const tool = e.currentTarget.dataset.tool as Tool
    
    if (this.data.isSelectMode) {
      this.toggleSelectItem(tool.id)
    } else {
      this.navigateToTool(tool)
    }
  },

  /**
   * 导航到工具页面
   */
  navigateToTool(tool: Tool) {
    console.log('[Favorites] 导航到工具:', tool.name)
    
    // 添加使用记录
    dataManager.addUsageRecord({
      toolId: tool.id,
      toolName: tool.name,
      category: tool.category
    })
    
    wx.navigateTo({
      url: tool.path,
      fail: (error) => {
        console.error('[Favorites] 导航失败:', error)
        wx.showToast({
          title: '页面不存在',
          icon: 'error'
        })
      }
    })
  },

  /**
   * 取消收藏
   */
  async onRemoveFavorite(e: any) {
    e.stopPropagation()
    const tool = e.currentTarget.dataset.tool as Tool
    
    try {
      await dataManager.toggleFavorite(tool.id)
      
      wx.showToast({
        title: '已取消收藏',
        icon: 'success'
      })
      
      // 重新加载收藏列表
      this.loadFavorites()
      
    } catch (error) {
      console.error('[Favorites] 取消收藏失败:', error)
      wx.showToast({
        title: '操作失败',
        icon: 'error'
      })
    }
  },

  /**
   * 进入选择模式
   */
  onEnterSelectMode() {
    this.setData({
      isSelectMode: true,
      selectedItems: []
    })
  },

  /**
   * 退出选择模式
   */
  onExitSelectMode() {
    this.setData({
      isSelectMode: false,
      selectedItems: []
    })
  },

  /**
   * 切换选择项
   */
  toggleSelectItem(toolId: string) {
    const selectedItems = [...this.data.selectedItems]
    const index = selectedItems.indexOf(toolId)
    
    if (index > -1) {
      selectedItems.splice(index, 1)
    } else {
      selectedItems.push(toolId)
    }
    
    this.setData({ selectedItems })
  },

  /**
   * 全选
   */
  onSelectAll() {
    const allIds = this.data.filteredTools.map(tool => tool.id)
    this.setData({ selectedItems: allIds })
  },

  /**
   * 批量取消收藏
   */
  async onBatchRemove() {
    const { selectedItems } = this.data
    
    if (selectedItems.length === 0) {
      wx.showToast({
        title: '请选择要移除的工具',
        icon: 'none'
      })
      return
    }
    
    wx.showModal({
      title: '确认操作',
      content: `确定要取消收藏 ${selectedItems.length} 个工具吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            for (const toolId of selectedItems) {
              await dataManager.toggleFavorite(toolId)
            }
            
            wx.showToast({
              title: '批量操作完成',
              icon: 'success'
            })
            
            this.onExitSelectMode()
            this.loadFavorites()
            
          } catch (error) {
            console.error('[Favorites] 批量操作失败:', error)
            wx.showToast({
              title: '操作失败',
              icon: 'error'
            })
          }
        }
      }
    })
  }
}) 