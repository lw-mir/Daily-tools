import { dataManager } from '../../../utils/dataManager'

interface ContentType {
  id: string
  name: string
  icon: string
  inputLabel: string
  placeholder: string
}

interface QuickInput {
  id: string
  label: string
  content: string
}

interface ScanResult {
  type: string
  typeLabel: string
  content: string
  time: string
}

interface HistoryItem {
  id: string
  type: 'generate' | 'scan'
  content: string
  result?: string
  time: string
}

Page({
  data: {
    // 收藏相关
    isFavorite: false,
    
    // 功能切换
    currentTab: 'generate' as 'generate' | 'scan' | 'history',
    
    // 生成二维码相关
    contentTypes: [
      {
        id: 'text',
        name: '文本',
        icon: '📝',
        inputLabel: '输入文本内容',
        placeholder: '请输入要生成二维码的文本内容'
      },
      {
        id: 'url',
        name: '网址',
        icon: '🔗',
        inputLabel: '输入网址',
        placeholder: '请输入网址，如：https://www.example.com'
      },
      {
        id: 'wifi',
        name: 'WiFi',
        icon: '📶',
        inputLabel: 'WiFi信息',
        placeholder: '格式：WIFI:T:WPA;S:网络名称;P:密码;;'
      },
      {
        id: 'contact',
        name: '联系人',
        icon: '👤',
        inputLabel: '联系人信息',
        placeholder: '格式：BEGIN:VCARD\\nFN:姓名\\nTEL:电话\\nEND:VCARD'
      }
    ] as ContentType[],
    contentType: 'text',
    contentTypeIndex: 0,
    inputContent: '',
    maxLength: 1000,
    quickInputs: [] as QuickInput[],
    
    // 二维码生成结果
    qrCodeUrl: '',
    displayContent: '',
    generateTime: '',
    isGenerating: false,
    
    // 扫描相关
    scanResult: null as ScanResult | null,
    
    // 历史记录
    history: [] as HistoryItem[]
  },

  onLoad() {
    console.log('[QRCode] 页面加载')
    this.checkFavoriteStatus()
    this.loadHistory()
    this.updateQuickInputs()
  },

  onShow() {
    console.log('[QRCode] 页面显示')
    this.checkFavoriteStatus()
  },

  onPullDownRefresh() {
    console.log('[QRCode] 下拉刷新')
    this.loadHistory()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  /**
   * 检查收藏状态
   */
  async checkFavoriteStatus() {
    try {
      const isFavorite = await dataManager.isFavorite('qrcode')
      this.setData({ isFavorite })
    } catch (error) {
      console.error('[QRCode] 检查收藏状态失败:', error)
    }
  },

  /**
   * 切换收藏状态
   */
  async onToggleFavorite() {
    try {
      const result = await dataManager.toggleFavorite('qrcode')
      this.setData({ isFavorite: result.isFavorite })
      
      wx.showToast({
        title: result.isFavorite ? '已收藏' : '已取消收藏',
        icon: 'success',
        duration: 1500
      })
    } catch (error) {
      console.error('[QRCode] 切换收藏状态失败:', error)
      wx.showToast({
        title: '操作失败',
        icon: 'error'
      })
    }
  },

  /**
   * 功能标签切换
   */
  onTabChange(e: any) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ currentTab: tab })
  },

  /**
   * 内容类型切换
   */
  onContentTypeChange(e: any) {
    const type = e.currentTarget.dataset.type
    const index = this.data.contentTypes.findIndex(item => item.id === type)
    
    this.setData({
      contentType: type,
      contentTypeIndex: index,
      inputContent: ''
    })
    
    this.updateQuickInputs()
  },

  /**
   * 更新快捷输入选项
   */
  updateQuickInputs() {
    let quickInputs: QuickInput[] = []
    
    switch (this.data.contentType) {
      case 'url':
        quickInputs = [
          { id: '1', label: '百度', content: 'https://www.baidu.com' },
          { id: '2', label: '微信', content: 'https://weixin.qq.com' },
          { id: '3', label: '淘宝', content: 'https://www.taobao.com' }
        ]
        break
      case 'wifi':
        quickInputs = [
          { id: '1', label: '示例WiFi', content: 'WIFI:T:WPA;S:MyWiFi;P:12345678;;' }
        ]
        break
      case 'contact':
        quickInputs = [
          { id: '1', label: '示例联系人', content: 'BEGIN:VCARD\nFN:张三\nTEL:13800138000\nEND:VCARD' }
        ]
        break
    }
    
    this.setData({ quickInputs })
  },

  /**
   * 内容输入
   */
  onContentInput(e: any) {
    const content = e.detail.value
    this.setData({ inputContent: content })
  },

  /**
   * 快捷输入
   */
  onQuickInput(e: any) {
    const content = e.currentTarget.dataset.content
    this.setData({ inputContent: content })
  },

  /**
   * 生成二维码
   */
  async onGenerateQR() {
    if (!this.data.inputContent.trim()) {
      wx.showToast({
        title: '请输入内容',
        icon: 'error'
      })
      return
    }

    try {
      this.setData({ isGenerating: true })
      
      // 模拟二维码生成（实际项目中需要调用真实的二维码生成API）
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const qrCodeUrl = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`
      const generateTime = new Date().toLocaleString()
      
      this.setData({
        qrCodeUrl,
        displayContent: this.data.inputContent,
        generateTime,
        isGenerating: false
      })
      
      // 保存到历史记录
      this.saveToHistory('generate', this.data.inputContent, qrCodeUrl)
      
      wx.showToast({
        title: '生成成功',
        icon: 'success'
      })
      
    } catch (error) {
      console.error('[QRCode] 生成二维码失败:', error)
      this.setData({ isGenerating: false })
      wx.showToast({
        title: '生成失败',
        icon: 'error'
      })
    }
  },

  /**
   * 保存二维码
   */
  onSaveQR() {
    if (!this.data.qrCodeUrl) return
    
    wx.showToast({
      title: '保存功能开发中',
      icon: 'none'
    })
  },

  /**
   * 分享二维码
   */
  onShareQR() {
    if (!this.data.qrCodeUrl) return
    
    wx.showToast({
      title: '分享功能开发中',
      icon: 'none'
    })
  },

  /**
   * 长按二维码
   */
  onLongPressQR() {
    wx.showActionSheet({
      itemList: ['保存到相册', '分享给朋友'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.onSaveQR()
        } else if (res.tapIndex === 1) {
          this.onShareQR()
        }
      }
    })
  },

  /**
   * 开始扫描
   */
  onStartScan() {
    wx.scanCode({
      success: (res) => {
        const scanResult: ScanResult = {
          type: this.detectContentType(res.result),
          typeLabel: this.getTypeLabel(this.detectContentType(res.result)),
          content: res.result,
          time: new Date().toLocaleString()
        }
        
        this.setData({ scanResult })
        this.saveToHistory('scan', res.result)
        
        wx.showToast({
          title: '扫描成功',
          icon: 'success'
        })
      },
      fail: (error) => {
        console.error('[QRCode] 扫描失败:', error)
        wx.showToast({
          title: '扫描失败',
          icon: 'error'
        })
      }
    })
  },

  /**
   * 检测内容类型
   */
  detectContentType(content: string): string {
    if (content.startsWith('http://') || content.startsWith('https://')) {
      return 'url'
    } else if (content.startsWith('WIFI:')) {
      return 'wifi'
    } else if (content.startsWith('BEGIN:VCARD')) {
      return 'contact'
    } else {
      return 'text'
    }
  },

  /**
   * 获取类型标签
   */
  getTypeLabel(type: string): string {
    const typeMap: Record<string, string> = {
      text: '文本',
      url: '网址',
      wifi: 'WiFi',
      contact: '联系人'
    }
    return typeMap[type] || '未知'
  },

  /**
   * 复制扫描结果
   */
  onCopyScanResult() {
    if (!this.data.scanResult) return
    
    wx.setClipboardData({
      data: this.data.scanResult.content,
      success: () => {
        wx.showToast({
          title: '已复制',
          icon: 'success'
        })
      }
    })
  },

  /**
   * 打开网址
   */
  onOpenUrl() {
    if (!this.data.scanResult || this.data.scanResult.type !== 'url') return
    
    wx.showModal({
      title: '打开网址',
      content: `确定要打开 ${this.data.scanResult.content} 吗？`,
      success: (res) => {
        if (res.confirm) {
          // 在小程序中无法直接打开外部网址，可以复制到剪贴板
          wx.setClipboardData({
            data: this.data.scanResult!.content,
            success: () => {
              wx.showToast({
                title: '网址已复制，请在浏览器中打开',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      }
    })
  },

  /**
   * 保存到历史记录
   */
  saveToHistory(type: 'generate' | 'scan', content: string, result?: string) {
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      type,
      content,
      result,
      time: new Date().toLocaleString()
    }
    
    const history = [historyItem, ...this.data.history.slice(0, 49)] // 最多保存50条
    this.setData({ history })
    
    // 保存到本地存储
    wx.setStorageSync('qrcode_history', history)
  },

  /**
   * 加载历史记录
   */
  loadHistory() {
    try {
      const history = wx.getStorageSync('qrcode_history') || []
      this.setData({ history })
    } catch (error) {
      console.error('[QRCode] 加载历史记录失败:', error)
    }
  },

  /**
   * 选择历史记录
   */
  onSelectHistory(e: any) {
    const item = e.currentTarget.dataset.item as HistoryItem
    
    if (item.type === 'generate') {
      // 切换到生成标签并填入内容
      this.setData({
        currentTab: 'generate',
        inputContent: item.content
      })
    } else {
      // 切换到扫描标签并显示结果
      const scanResult: ScanResult = {
        type: this.detectContentType(item.content),
        typeLabel: this.getTypeLabel(this.detectContentType(item.content)),
        content: item.content,
        time: item.time
      }
      
      this.setData({
        currentTab: 'scan',
        scanResult
      })
    }
  },

  /**
   * 清空历史记录
   */
  onClearHistory() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ history: [] })
          wx.removeStorageSync('qrcode_history')
          wx.showToast({
            title: '已清空',
            icon: 'success'
          })
        }
      }
    })
  }
}) 