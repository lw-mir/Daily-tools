import { StorageService } from '../../utils/storage';
import { LoggerService } from '../../utils/logger';
import { formatTime } from '../../utils/index';
import { dataManager } from '../../utils/dataManager';
import { authManager } from '../../utils/authManager';
import { userInfoProcessor } from '../../utils/userInfoProcessor';
import { userDataStorage } from '../../utils/userDataStorage';

interface UserInfo {
  nickName: string;
  avatarUrl: string;
  gender: number;
  country: string;
  province: string;
  city: string;
  language: string;
  displayName?: string;
  avatarValid?: boolean;
  location?: string;
  processedAt?: number;
}

interface UsageStats {
  totalUsage: number;
  toolsUsed: number;
  daysActive: number;
  favorites: number;
}

interface Tool {
  id: string;
  name: string;
  icon: string;
  description?: string;
  lastUsed?: string;
  path: string;
}

interface Theme {
  id: string;
  name: string;
  color: string;
}

interface ProfileData {
  // 用户信息
  userInfo: UserInfo;
  isLoggedIn: boolean;
  loginTimeText: string;
  
  // 登录相关状态
  isLoggingIn: boolean;
  showRetryModal: boolean;
  authErrorMessage: string;
  
  // 统计数据
  stats: UsageStats;
  
  // 收藏和最近使用
  favoriteTools: Tool[];
  recentTools: Tool[];
  
  // 设置
  currentTheme: string;
  notificationEnabled: boolean;
  cacheSize: string;
  
  // 主题选择
  showThemeModal: boolean;
  themes: Theme[];
  
  // 状态
  isLoading: boolean;
  loadingText: string;
  
  // 用户等级和认证
  userLevel: string;
  isVerified: boolean;
}

Page({
  data: {
    userInfo: {
      nickName: '',
      avatarUrl: '',
      gender: 0,
      country: '',
      province: '',
      city: '',
      language: ''
    },
    isLoggedIn: false,
    loginTimeText: '',
    
    // 登录相关状态
    isLoggingIn: false,
    showRetryModal: false,
    authErrorMessage: '',
    
    stats: {
      totalUsage: 0,
      toolsUsed: 0,
      daysActive: 0,
      favorites: 0
    },
    
    favoriteTools: [],
    recentTools: [],
    
    currentTheme: '默认',
    notificationEnabled: true,
    cacheSize: '0KB',
    
    showThemeModal: false,
    themes: [
      { id: 'default', name: '默认', color: '#667eea' },
      { id: 'dark', name: '深色', color: '#2c3e50' },
      { id: 'green', name: '清新绿', color: '#27ae60' },
      { id: 'purple', name: '优雅紫', color: '#8e44ad' },
      { id: 'orange', name: '活力橙', color: '#e67e22' }
    ],
    
    isLoading: false,
    loadingText: '加载中...',
    
    // 用户等级和认证
    userLevel: 'VIP',
    isVerified: true
  } as ProfileData,

  onLoad() {
    LoggerService.info('Profile page loaded');
    this.initProfile();
  },

  onShow() {
    // 每次显示时刷新数据
    this.checkLoginStatus();
    this.loadUserData();
    this.loadStats();
    this.loadFavoriteTools();
    this.loadRecentTools();
    this.loadSettings();
  },

  onUnload() {
    LoggerService.info('Profile page unloaded');
  },

  // 初始化个人中心
  initProfile() {
    this.setData({ isLoading: true, loadingText: '加载个人信息...' });
    
    try {
      // 检查登录状态
      this.checkLoginStatus();
      
      // 加载各项数据
      this.loadUserData();
      this.loadStats();
      this.loadFavoriteTools();
      this.loadRecentTools();
      this.loadSettings();
      this.calculateCacheSize();
      
    } catch (error) {
      LoggerService.error('Failed to initialize profile:', error);
    } finally {
      this.setData({ isLoading: false });
    }
  },

  // 检查登录状态
  checkLoginStatus() {
    try {
      const isLoggedIn = authManager.isLoggedIn();
      const userInfo = authManager.getUserInfo();
      
      if (isLoggedIn && userInfo) {
        // 格式化登录时间
        const loginState = authManager.getLoginStateInfo();
        const loginTimeText = loginState ? 
          formatTime(loginState.loginTime) : '';
        
        this.setData({
          isLoggedIn: true,
          userInfo,
          loginTimeText
        });
        
        LoggerService.info('用户已登录:', userInfo);
        
        // 验证用户信息
        this.validateUserInfo(userInfo);
      } else {
        this.setData({
          isLoggedIn: false,
          userInfo: {
            nickName: '',
            avatarUrl: '',
            gender: 0,
            country: '',
            province: '',
            city: '',
            language: ''
          },
          loginTimeText: ''
        });
        
        LoggerService.info('用户未登录');
      }
    } catch (error) {
      LoggerService.error('检查登录状态失败:', error);
    }
  },

  // 验证用户信息
  async validateUserInfo(userInfo: UserInfo) {
    try {
      const validation = await userInfoProcessor.validateUserInfo(userInfo);
      
      if (!validation.isValid) {
        LoggerService.warn('用户信息验证失败:', validation.errors);
        
        // 如果有严重错误，可以考虑重新获取用户信息
        if (validation.errors.some(error => error.includes('头像') || error.includes('昵称'))) {
          LoggerService.info('尝试刷新用户信息');
          await this.refreshUserInfo();
        }
      }
      
      if (validation.warnings.length > 0) {
        LoggerService.warn('用户信息警告:', validation.warnings);
      }
    } catch (error) {
      LoggerService.error('验证用户信息时出错:', error);
    }
  },

  // 刷新用户信息
  async refreshUserInfo() {
    try {
      if (!authManager.isLoggedIn()) {
        return;
      }

      const currentUserInfo = authManager.getUserInfo();
      if (!currentUserInfo) {
        return;
      }

      // 重新处理用户信息
      const refreshedUserInfo = await userInfoProcessor.processUserInfo(currentUserInfo);
      
      // 更新登录状态
      const loginState = authManager.getLoginStateInfo();
      if (loginState) {
        loginState.userInfo = refreshedUserInfo;
        authManager.saveLoginState(loginState);
        
        // 更新页面数据
        this.setData({
          userInfo: refreshedUserInfo
        });
        
        LoggerService.info('用户信息已刷新:', refreshedUserInfo);
      }
    } catch (error) {
      LoggerService.error('刷新用户信息失败:', error);
    }
  },

  // 微信授权登录
  async onLogin() {
    if (this.data.isLoggingIn) return;
    
    this.setData({ isLoggingIn: true });
    
    try {
      LoggerService.info('开始微信授权登录');
      
      const result = await authManager.login();
      
      if (result.success && result.userInfo) {
        // 登录成功
        const loginState = authManager.getLoginStateInfo();
        const loginTimeText = loginState ? 
          formatTime(loginState.loginTime) : '';
        
        this.setData({
          isLoggedIn: true,
          userInfo: result.userInfo,
          loginTimeText,
          isLoggingIn: false
        });
        
        // 重新加载用户相关数据
        this.loadStats();
        this.loadFavoriteTools();
        this.loadRecentTools();
        
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 2000
        });
        
        LoggerService.info('微信授权登录成功');
        
      } else {
        // 登录失败
        this.setData({
          isLoggingIn: false,
          showRetryModal: true,
          authErrorMessage: result.error || '登录失败，请重试'
        });
        
        LoggerService.warn('微信授权登录失败:', result.error);
      }
      
    } catch (error) {
      this.setData({
        isLoggingIn: false,
        showRetryModal: true,
        authErrorMessage: '网络错误，请检查网络连接'
      });
      
      LoggerService.error('微信授权登录异常:', error);
    }
  },

  // 头像加载成功
  onAvatarLoad() {
    LoggerService.info('用户头像加载成功');
  },

  // 头像加载失败，使用默认头像
  onAvatarError() {
    LoggerService.warn('用户头像加载失败，使用默认头像');
    const defaultAvatars = [
      '/images/default-avatar-1.png',
      '/images/default-avatar-2.png', 
      '/images/default-avatar-3.png'
    ];
    const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
    
    this.setData({
      'userInfo.avatarUrl': randomAvatar
    });
  },

  // 显示用户详细信息
  showUserInfoDetail() {
    if (!this.data.isLoggedIn || !this.data.userInfo) return;
    
    const userInfo = this.data.userInfo;
    const genderText = userInfo.gender === 1 ? '男' : userInfo.gender === 2 ? '女' : '未知';
    const details = [
      `昵称：${userInfo.nickName || '未设置'}`,
      `性别：${genderText}`,
      `城市：${userInfo.city || '未知'}`,
      `省份：${userInfo.province || '未知'}`,
      `国家：${userInfo.country || '未知'}`,
      `语言：${userInfo.language || '未知'}`,
      `登录时间：${this.data.loginTimeText || '未知'}`
    ].join('\n');
    
    wx.showModal({
      title: '用户信息详情',
      content: details,
      showCancel: false,
      confirmText: '确定'
    });
  },

  // 退出登录
  onLogout() {
    wx.showModal({
      title: '确认退出',
      content: '退出登录后将无法查看个人数据，确定要退出吗？',
      success: (res) => {
        if (res.confirm) {
          authManager.logout();
          
          this.setData({
            isLoggedIn: false,
            userInfo: {
              nickName: '',
              avatarUrl: '',
              gender: 0,
              country: '',
              province: '',
              city: '',
              language: ''
            },
            loginTimeText: '',
            favoriteTools: [],
            recentTools: [],
            stats: {
              totalUsage: 0,
              toolsUsed: 0,
              daysActive: 0,
              favorites: 0
            }
          });
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success',
            duration: 1500
          });
          
          LoggerService.info('用户退出登录');
        }
      }
    });
  },

  // 重试登录
  async onRetryLogin() {
    this.setData({ showRetryModal: false });
    await this.onLogin();
  },

  // 关闭重试弹窗
  onCloseRetryModal() {
    this.setData({ showRetryModal: false });
  },

  // 加载用户数据
  async loadUserData() {
    if (!this.data.isLoggedIn) return;
    
    try {
      const userProfile = await dataManager.getUserProfile();
      if (userProfile) {
        this.setData({
          userInfo: {
            nickName: userProfile.nickName || '',
            avatarUrl: userProfile.avatarUrl || '',
            gender: userProfile.gender || 0,
            country: userProfile.country || '',
            province: userProfile.province || '',
            city: userProfile.city || '',
            language: userProfile.language || ''
          }
        });
      }
    } catch (error) {
      LoggerService.error('Failed to load user data:', error);
    }
  },

  // 加载统计数据
  async loadStats() {
    if (!this.data.isLoggedIn) {
      this.setData({
        stats: {
          totalUsage: 0,
          toolsUsed: 0,
          daysActive: 0,
          favorites: 0
        }
      });
      return;
    }
    
    try {
      const stats = await dataManager.getUserStats();
      if (stats) {
        this.setData({ stats });
      }
    } catch (error) {
      LoggerService.error('Failed to load stats:', error);
      this._loadStatsOld();
    }
  },

  // 旧版统计数据加载（兼容）
  _loadStatsOld() {
    try {
      const favoriteTools = StorageService.get('favorite_tools') || [];
      const usageHistory = StorageService.get('usage_history') || [];
      const recentTools = StorageService.get('recent_tools') || [];

      const toolsUsed = new Set(usageHistory.map((item: any) => item.toolId)).size;
      const daysActive = new Set(usageHistory.map((item: any) => 
        new Date(item.timestamp).toDateString()
      )).size;

      this.setData({
        stats: {
          totalUsage: usageHistory.length,
          toolsUsed,
          daysActive,
          favorites: favoriteTools.length
        }
      });
    } catch (error) {
      LoggerService.error('Failed to load old stats:', error);
    }
  },

  // 加载收藏工具
  async loadFavoriteTools() {
    if (!this.data.isLoggedIn) {
      this.setData({ favoriteTools: [] });
      return;
    }
    
    try {
      const favoriteIds = await dataManager.getFavoriteTools();
      const favoriteTools = this.getToolsById(favoriteIds);
      this.setData({ favoriteTools });
    } catch (error) {
      LoggerService.error('Failed to load favorite tools:', error);
    }
  },

  // 加载最近使用工具
  async loadRecentTools() {
    if (!this.data.isLoggedIn) {
      this.setData({ recentTools: [] });
      return;
    }
    
    try {
      const recentHistory = await dataManager.getRecentToolsWithTimestamp(5);
      const recentTools = recentHistory.map(item => {
        const tool = this.getToolsById([item.toolId])[0];
        if (tool) {
          return {
            ...tool,
            lastUsed: this.formatLastUsed(item.timestamp)
          };
        }
        return null;
      }).filter(Boolean) as Tool[];
      
      this.setData({ recentTools });
    } catch (error) {
      LoggerService.error('Failed to load recent tools:', error);
    }
  },

  // 根据ID获取工具信息
  getToolsById(toolIds: string[]): Tool[] {
    const allTools = [
      { id: 'calculator', name: '计算器', icon: '🧮', description: '科学计算器', path: '/pages/tools/calculator/calculator' },
      { id: 'converter', name: '单位转换', icon: '🔄', description: '长度、重量等单位转换', path: '/pages/tools/converter/converter' },
      { id: 'qrcode', name: '二维码', icon: '📱', description: '二维码生成与识别', path: '/pages/tools/qrcode/qrcode' },
      { id: 'foodwheel', name: '今天吃什么', icon: '🍽️', description: '随机推荐美食', path: '/pages/tools/foodwheel/foodwheel' }
    ];

    return toolIds.map(id => allTools.find(tool => tool.id === id)).filter(Boolean) as Tool[];
  },

  // 格式化最后使用时间
  formatLastUsed(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    
    if (diff < minute) {
      return '刚刚';
    } else if (diff < hour) {
      return `${Math.floor(diff / minute)}分钟前`;
    } else if (diff < day) {
      return `${Math.floor(diff / hour)}小时前`;
    } else {
      return `${Math.floor(diff / day)}天前`;
    }
  },

  // 加载设置
  async loadSettings() {
    try {
      const settings = await dataManager.getUserSettings();
      if (settings) {
        this.setData({
          currentTheme: this.getThemeName(settings.theme),
          notificationEnabled: settings.notifications.enabled
        });
      }
    } catch (error) {
      LoggerService.error('Failed to load settings:', error);
    }
  },

  // 获取主题名称
  getThemeName(themeId: string): string {
    const theme = this.data.themes.find(t => t.id === themeId);
    return theme ? theme.name : '默认';
  },

  // 计算缓存大小
  async calculateCacheSize() {
    try {
      const cacheInfo = await dataManager.getCacheInfo();
      if (cacheInfo) {
        const sizeInKB = Math.round(cacheInfo.size / 1024);
        const sizeText = sizeInKB > 1024 ? 
          `${(sizeInKB / 1024).toFixed(1)}MB` : 
          `${sizeInKB}KB`;
        
        this.setData({ cacheSize: sizeText });
      }
    } catch (error) {
      LoggerService.error('Failed to calculate cache size:', error);
      
      // 简单估算
      try {
        const keys = ['favorite_tools', 'recent_tools', 'usage_history', 'user_settings'];
        let totalSize = 0;
        
        keys.forEach(key => {
          const data = StorageService.get(key);
          if (data) {
            totalSize += JSON.stringify(data).length;
          }
        });
        
        const sizeInKB = Math.round(totalSize / 1024);
        this.setData({ cacheSize: `${sizeInKB}KB` });
      } catch (estimateError) {
        LoggerService.error('Failed to estimate cache size:', estimateError);
        this.setData({ cacheSize: '未知' });
      }
    }
  },

  // 工具点击事件
  onToolTap(e: WechatMiniprogram.TouchEvent) {
    const tool = e.currentTarget.dataset.tool;
    if (tool && tool.path) {
      // 记录使用历史
      if (this.data.isLoggedIn) {
        dataManager.recordToolUsage(tool.id).catch(error => {
          LoggerService.error('Failed to record tool usage:', error);
        });
      }
      
      wx.navigateTo({
        url: tool.path,
        fail: (error) => {
          LoggerService.error('Failed to navigate to tool:', error);
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none',
            duration: 2000
          });
        }
      });
    }
  },

  // 取消收藏
  async onUnfavorite(e: WechatMiniprogram.TouchEvent) {
    if (!this.data.isLoggedIn) return;
    
    const tool = e.currentTarget.dataset.tool;
    if (tool) {
      try {
        await dataManager.removeFavoriteTool(tool.id);
        await this.loadFavoriteTools();
        await this.loadStats();
        
        wx.showToast({
          title: '已取消收藏',
          icon: 'success',
          duration: 1500
        });
      } catch (error) {
        LoggerService.error('Failed to unfavorite tool:', error);
        wx.showToast({
          title: '操作失败',
          icon: 'none',
          duration: 2000
        });
      }
    }
  },

  // 管理收藏
  onManageFavorites() {
    if (!this.data.isLoggedIn) {
      this.onLogin();
      return;
    }
    
    wx.navigateTo({
      url: '/pages/favorites/favorites',
      fail: (error) => {
        LoggerService.error('Failed to navigate to favorites:', error);
      }
    });
  },

  // 清空最近使用
  onClearRecent() {
    if (!this.data.isLoggedIn) return;
    
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有使用记录吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await dataManager.clearRecentTools();
            this.setData({ recentTools: [] });
            
            wx.showToast({
              title: '已清空记录',
              icon: 'success',
              duration: 1500
            });
          } catch (error) {
            LoggerService.error('Failed to clear recent tools:', error);
            wx.showToast({
              title: '操作失败',
              icon: 'none',
              duration: 2000
            });
          }
        }
      }
    });
  },

  // 主题设置
  onThemeSetting() {
    this.setData({ showThemeModal: true });
  },

  // 关闭主题弹窗
  onCloseThemeModal() {
    this.setData({ showThemeModal: false });
  },

  // 选择主题
  async onThemeSelect(e: WechatMiniprogram.TouchEvent) {
    const theme = e.currentTarget.dataset.theme;
    if (theme) {
      try {
        await dataManager.updateUserSettings({ theme: theme.id });
        
        this.setData({
          currentTheme: theme.name,
          showThemeModal: false
        });
        
        wx.showToast({
          title: `已切换到${theme.name}`,
          icon: 'success',
          duration: 1500
        });
        
        LoggerService.info('Theme changed to:', theme.name);
      } catch (error) {
        LoggerService.error('Failed to update theme:', error);
        wx.showToast({
          title: '设置失败',
          icon: 'none',
          duration: 2000
        });
      }
    }
  },

  // 语言设置
  onLanguageSetting() {
    wx.showToast({
      title: '暂不支持多语言',
      icon: 'none',
      duration: 2000
    });
  },

  // 通知设置变更
  async onNotificationChange(e: WechatMiniprogram.SwitchChange) {
    const enabled = e.detail.value;
    
    try {
      await dataManager.updateUserSettings({ 
        notifications: {
          enabled,
          dailyReminder: false,
          updateNotice: true
        }
      });
      
      this.setData({ notificationEnabled: enabled });
      
      wx.showToast({
        title: enabled ? '已开启通知' : '已关闭通知',
        icon: 'success',
        duration: 1500
      });
      
      LoggerService.info('Notification setting changed to:', enabled);
    } catch (error) {
      LoggerService.error('Failed to update notification setting:', error);
      
      // 回滚设置
      this.setData({ notificationEnabled: !enabled });
      
      wx.showToast({
        title: '设置失败',
        icon: 'none',
        duration: 2000
      });
    }
  },

  // 缓存设置
  onCacheSetting() {
    wx.showActionSheet({
      itemList: ['清理缓存', '查看缓存详情'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.clearCache();
        } else if (res.tapIndex === 1) {
          this.showCacheDetails();
        }
      }
    });
  },

  // 清理缓存
  async clearCache() {
    wx.showModal({
      title: '清理缓存',
      content: '清理缓存不会影响您的收藏和设置，确定要继续吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await dataManager.clearCache();
            await this.calculateCacheSize();
            
            wx.showToast({
              title: '缓存已清理',
              icon: 'success',
              duration: 2000
            });
            
            LoggerService.info('Cache cleared successfully');
          } catch (error) {
            LoggerService.error('Failed to clear cache:', error);
            wx.showToast({
              title: '清理失败',
              icon: 'none',
              duration: 2000
            });
          }
        }
      }
    });
  },

  // 显示缓存详情
  showCacheDetails() {
    wx.showModal({
      title: '缓存详情',
      content: `当前缓存大小: ${this.data.cacheSize}\n\n缓存包含：\n• 工具使用记录\n• 收藏列表\n• 个人设置\n• 临时数据`,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 意见反馈
  onFeedback() {
    wx.showModal({
      title: '意见反馈',
      content: '如有问题或建议，请通过以下方式联系我们：\n\n邮箱：feedback@dailytools.com\n微信群：扫码加入用户群',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 关于我们
  onAbout() {
    wx.showModal({
      title: '关于 Dailytools',
      content: 'Dailytools v1.0.0\n\n一个简单实用的工具集合小程序\n\n© 2024 Dailytools Team',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 分享应用
  onShare() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 分享给朋友
  onShareAppMessage() {
    return {
      title: 'Dailytools - 实用工具集合',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.jpg'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: 'Dailytools - 实用工具集合',
      imageUrl: '/images/share-cover.jpg'
    };
  },

  // 显示存储使用情况
  async showStorageUsage() {
    try {
      wx.showLoading({ title: '获取存储信息...' });
      
      const storageUsage = await userDataStorage.getStorageUsage();
      const usagePercentage = ((storageUsage.used / storageUsage.total) * 100).toFixed(2);
      
      let detailText = `总容量: ${(storageUsage.total / 1024 / 1024).toFixed(2)} MB\n`;
      detailText += `已使用: ${(storageUsage.used / 1024).toFixed(2)} KB\n`;
      detailText += `使用率: ${usagePercentage}%\n\n`;
      detailText += `各类数据占用:\n`;
      
      for (const [category, size] of Object.entries(storageUsage.byCategory)) {
        const sizeKB = (size / 1024).toFixed(2);
        detailText += `${category}: ${sizeKB} KB\n`;
      }

      wx.hideLoading();
      
      wx.showModal({
        title: '存储使用情况',
        content: detailText,
        showCancel: false,
        confirmText: '确定'
      });
    } catch (error) {
      wx.hideLoading();
      LoggerService.error('获取存储使用情况失败:', error);
      wx.showToast({
        title: '获取失败',
        icon: 'error'
      });
    }
  },

  // 管理用户偏好设置
  async manageUserPreferences() {
    try {
      const preferences = await userDataStorage.getUserPreferences();
      
      const options = ['主题设置', '语言设置', '通知设置', '隐私设置'];
      
      wx.showActionSheet({
        itemList: options,
        success: async (res) => {
          switch (res.tapIndex) {
            case 0: // 主题设置
              this.showUserThemeSettings(preferences);
              break;
            case 1: // 语言设置
              this.showUserLanguageSettings(preferences);
              break;
            case 2: // 通知设置
              this.showUserNotificationSettings(preferences);
              break;
            case 3: // 隐私设置
              this.showUserPrivacySettings(preferences);
              break;
          }
        }
      });
    } catch (error) {
      LoggerService.error('获取用户偏好设置失败:', error);
      wx.showToast({
        title: '获取设置失败',
        icon: 'error'
      });
    }
  },

  // 用户主题设置
  showUserThemeSettings(preferences: any) {
    const themes = ['自动', '浅色', '深色'];
    
    wx.showActionSheet({
      itemList: themes,
      success: async (res) => {
        const newTheme = ['auto', 'light', 'dark'][res.tapIndex];
        await userDataStorage.updateUserPreferences({
          theme: newTheme as 'auto' | 'light' | 'dark'
        });
        
        wx.showToast({
          title: '主题已更新',
          icon: 'success'
        });
      }
    });
  },

  // 用户语言设置
  showUserLanguageSettings(preferences: any) {
    const languages = ['简体中文', 'English'];
    
    wx.showActionSheet({
      itemList: languages,
      success: async (res) => {
        const newLanguage = ['zh-CN', 'en-US'][res.tapIndex];
        await userDataStorage.updateUserPreferences({
          language: newLanguage as 'zh-CN' | 'en-US'
        });
        
        wx.showToast({
          title: '语言已更新',
          icon: 'success'
        });
      }
    });
  },

  // 用户通知设置
  showUserNotificationSettings(preferences: any) {
    const notifications = preferences.notifications;
    const options = [
      `通知总开关: ${notifications.enabled ? '开启' : '关闭'}`,
      `每日提醒: ${notifications.dailyReminder ? '开启' : '关闭'}`,
      `更新通知: ${notifications.updateNotice ? '开启' : '关闭'}`
    ];
    
    wx.showActionSheet({
      itemList: options,
      success: async (res) => {
        const keys = ['enabled', 'dailyReminder', 'updateNotice'];
        const key = keys[res.tapIndex];
        
        await userDataStorage.updateUserPreferences({
          notifications: {
            ...notifications,
            [key]: !notifications[key]
          }
        });
        
        wx.showToast({
          title: '设置已更新',
          icon: 'success'
        });
      }
    });
  },

  // 用户隐私设置
  showUserPrivacySettings(preferences: any) {
    const privacy = preferences.privacy;
    const options = [
      `数据收集: ${privacy.dataCollection ? '允许' : '禁止'}`,
      `使用分析: ${privacy.usageAnalytics ? '允许' : '禁止'}`,
      `数据共享: ${privacy.shareUsageData ? '允许' : '禁止'}`
    ];
    
    wx.showActionSheet({
      itemList: options,
      success: async (res) => {
        const keys = ['dataCollection', 'usageAnalytics', 'shareUsageData'];
        const key = keys[res.tapIndex];
        
        await userDataStorage.updateUserPreferences({
          privacy: {
            ...privacy,
            [key]: !privacy[key]
          }
        });
        
        wx.showToast({
          title: '隐私设置已更新',
          icon: 'success'
        });
      }
    });
  }
}); 