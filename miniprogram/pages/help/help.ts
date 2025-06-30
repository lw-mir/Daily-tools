// help.ts
interface HelpSection {
  id: string
  title: string
  icon: string
  items: HelpItem[]
}

interface HelpItem {
  id: string
  question: string
  answer: string
  type: 'text' | 'steps' | 'tips'
  steps?: string[]
  tips?: string[]
}

interface ContactInfo {
  type: string
  label: string
  value: string
  icon: string
}

Page({
  data: {
    searchText: '',
    helpSections: [] as HelpSection[],
    filteredSections: [] as HelpSection[],
    contactInfo: [] as ContactInfo[],
    appInfo: {
      version: '1.0.0',
      updateTime: '2024-01-15'
    }
  },

  onLoad() {
    console.log('[Help] 页面加载')
    this.loadHelpData()
    this.loadContactInfo()
  },

  onShow() {
    console.log('[Help] 页面显示')
  },

  onPullDownRefresh() {
    console.log('[Help] 下拉刷新')
    this.loadHelpData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  /**
   * 加载帮助数据
   */
  loadHelpData() {
    try {
      const helpSections: HelpSection[] = [
        {
          id: 'getting-started',
          title: '快速开始',
          icon: '🚀',
          items: [
            {
              id: 'how-to-use',
              question: '如何使用这个小程序？',
              answer: '本小程序提供多种日常工具，您可以通过首页选择需要的工具，或者通过分类页面浏览所有工具。',
              type: 'text'
            },
            {
              id: 'first-steps',
              question: '新手入门步骤',
              answer: '按照以下步骤开始使用：',
              type: 'steps',
              steps: [
                '在首页浏览可用的工具',
                '点击感兴趣的工具进入使用',
                '可以收藏常用工具便于快速访问',
                '查看使用历史了解您的使用习惯'
              ]
            }
          ]
        },
        {
          id: 'features',
          title: '功能介绍',
          icon: '⚡',
          items: [
            {
              id: 'calculator',
              question: '计算器功能说明',
              answer: '支持基础数学运算，包括加减乘除、百分比计算等。具有历史记录功能，方便查看之前的计算结果。',
              type: 'text'
            },
            {
              id: 'converter',
              question: '单位转换功能',
              answer: '支持多种单位转换：',
              type: 'tips',
              tips: [
                '长度单位：米、厘米、英寸、英尺等',
                '重量单位：公斤、克、磅、盎司等',
                '温度单位：摄氏度、华氏度、开尔文',
                '面积单位：平方米、平方英尺等'
              ]
            },
            {
              id: 'favorites',
              question: '收藏功能如何使用？',
              answer: '在任何工具页面点击收藏按钮，即可将工具添加到收藏列表。通过"我的收藏"页面可以快速访问收藏的工具。',
              type: 'text'
            },
            {
              id: 'history',
              question: '使用历史记录',
              answer: '系统会自动记录您使用工具的历史，包括使用时间、使用时长等信息。可以在历史页面查看和管理这些记录。',
              type: 'text'
            }
          ]
        },
        {
          id: 'faq',
          title: '常见问题',
          icon: '❓',
          items: [
            {
              id: 'data-sync',
              question: '数据会同步到云端吗？',
              answer: '目前所有数据都存储在本地，不会上传到云端。这样可以保护您的隐私，但也意味着删除小程序会丢失数据。',
              type: 'text'
            },
            {
              id: 'offline-use',
              question: '可以离线使用吗？',
              answer: '大部分功能都支持离线使用，包括计算器、单位转换等。只有需要网络的功能（如二维码识别）才需要联网。',
              type: 'text'
            },
            {
              id: 'data-export',
              question: '如何导出我的数据？',
              answer: '在历史记录页面提供数据导出功能，可以将使用记录导出为文本格式保存。',
              type: 'text'
            },
            {
              id: 'performance',
              question: '小程序运行缓慢怎么办？',
              answer: '尝试以下解决方法：',
              type: 'steps',
              steps: [
                '重启小程序',
                '清理小程序缓存数据',
                '检查微信版本是否为最新',
                '重启微信应用'
              ]
            }
          ]
        },
        {
          id: 'privacy',
          title: '隐私与安全',
          icon: '🔒',
          items: [
            {
              id: 'data-privacy',
              question: '隐私保护说明',
              answer: '我们重视您的隐私保护：',
              type: 'tips',
              tips: [
                '所有数据仅存储在您的设备本地',
                '不会收集或上传任何个人信息',
                '不会访问您的通讯录、相册等敏感权限',
                '使用过程中产生的数据完全由您控制'
              ]
            }
          ]
        }
      ]

      this.setData({
        helpSections,
        filteredSections: helpSections
      })

      console.log('[Help] 帮助数据加载完成')
    } catch (error) {
      console.error('[Help] 加载帮助数据失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      })
    }
  },

  /**
   * 加载联系信息
   */
  loadContactInfo() {
    const contactInfo: ContactInfo[] = [
      {
        type: 'feedback',
        label: '意见反馈',
        value: '点击提交反馈',
        icon: '💬'
      },
      {
        type: 'email',
        label: '邮箱联系',
        value: 'support@example.com',
        icon: '📧'
      },
      {
        type: 'version',
        label: '当前版本',
        value: this.data.appInfo.version,
        icon: '📱'
      }
    ]

    this.setData({ contactInfo })
  },

  /**
   * 搜索输入处理
   */
  onSearchInput(e: any) {
    const searchText = e.detail.value
    this.setData({ searchText })
    this.filterHelpContent(searchText)
  },

  /**
   * 搜索确认处理
   */
  onSearchConfirm(e: any) {
    const searchText = e.detail.value
    this.filterHelpContent(searchText)
  },

  /**
   * 过滤帮助内容
   */
  filterHelpContent(searchText: string) {
    const { helpSections } = this.data
    
    if (!searchText.trim()) {
      this.setData({ filteredSections: helpSections })
      return
    }

    const filtered = helpSections.map(section => {
      const filteredItems = section.items.filter(item => {
        const questionMatch = item.question.toLowerCase().includes(searchText.toLowerCase())
        const answerMatch = item.answer.toLowerCase().includes(searchText.toLowerCase())
        const stepsMatch = item.steps?.some(step => 
          step.toLowerCase().includes(searchText.toLowerCase())
        )
        const tipsMatch = item.tips?.some(tip => 
          tip.toLowerCase().includes(searchText.toLowerCase())
        )

        return questionMatch || answerMatch || stepsMatch || tipsMatch
      })

      return filteredItems.length > 0 ? { ...section, items: filteredItems } : null
    }).filter(section => section !== null) as HelpSection[]

    this.setData({ filteredSections: filtered })
    console.log('[Help] 搜索结果:', filtered.length)
  },

  /**
   * 帮助项点击处理
   */
  onHelpItemTap(e: any) {
    const { sectionId, itemId } = e.currentTarget.dataset
    console.log('[Help] 点击帮助项:', sectionId, itemId)

    // 可以添加展开/收起逻辑或跳转到详细页面
    wx.showToast({
      title: '查看详情',
      icon: 'none'
    })
  },

  /**
   * 联系方式点击处理
   */
  onContactTap(e: any) {
    const contact = e.currentTarget.dataset.contact as ContactInfo
    console.log('[Help] 点击联系方式:', contact.type)

    switch (contact.type) {
      case 'feedback':
        this.showFeedbackDialog()
        break
      case 'email':
        wx.setClipboardData({
          data: contact.value,
          success: () => {
            wx.showToast({
              title: '邮箱已复制',
              icon: 'success'
            })
          }
        })
        break
      case 'version':
        wx.showToast({
          title: `版本 ${contact.value}`,
          icon: 'none'
        })
        break
    }
  },

  /**
   * 显示反馈对话框
   */
  showFeedbackDialog() {
    wx.showModal({
      title: '意见反馈',
      content: '感谢您的反馈！您可以通过邮箱联系我们，或在小程序评价中留下您的建议。',
      confirmText: '好的',
      showCancel: false
    })
  },

  /**
   * 清除搜索
   */
  onClearSearch() {
    this.setData({
      searchText: '',
      filteredSections: this.data.helpSections
    })
  }
}) 