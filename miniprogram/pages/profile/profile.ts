import { StorageService } from '../../utils/storage';
import { LoggerService } from '../../utils/logger';
import { formatTime } from '../../utils/index';
import { dataManager } from '../../utils/dataManager';

interface UserInfo {
  nickName: string;
  avatarUrl: string;
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
}

Page({
  data: {
    userInfo: {
      nickName: '',
      avatarUrl: ''
    },
    isLoggedIn: false,
    
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
    loadingText: '加载中...'
  } as ProfileData,

  onLoad() {
    LoggerService.info('Profile page loaded');
    this.initProfile();
  },

  onShow() {
    // 每次显示时刷新数据
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
      // 尝试获取用户信息
      this.getUserInfo();
      
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

  // 获取用户信息
  getUserInfo() {
    const userInfo = StorageService.get('user_info');
    if (userInfo) {
      this.setData({
        userInfo,
        isLoggedIn: true
      });
    } else {
      // 尝试从微信获取用户信息
      wx.getUserInfo({
        success: (res) => {
          const userInfo = res.userInfo;
          this.setData({
            userInfo,
            isLoggedIn: true
          });
          StorageService.set('user_info', userInfo);
          LoggerService.info('User info obtained:', userInfo);
        },
        fail: () => {
          LoggerService.info('User info not available');
        }
      });
    }
  },

  // 用户登录
  onGetUserInfo(e: any) {
    if (e.detail.userInfo) {
      const userInfo = e.detail.userInfo;
      this.setData({
        userInfo,
        isLoggedIn: true
      });
      StorageService.set('user_info', userInfo);
      
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500
      });
      
      LoggerService.info('User logged in:', userInfo);
    }
  },

  // 加载用户数据
  async loadUserData() {
    try {
      const userProfile = await dataManager.getUserProfile();
      if (userProfile) {
        this.setData({
          userInfo: {
            nickName: userProfile.nickName,
            avatarUrl: userProfile.avatarUrl
          },
          isLoggedIn: userProfile.isLoggedIn
        });
      }
    } catch (error) {
      LoggerService.error('Failed to load user data:', error);
    }
  },

  // 加载统计数据
  async loadStats() {
    try {
      const statistics = await dataManager.getAppStatistics();
      const favoriteTools = await dataManager.getFavoriteTools();
      
      if (statistics) {
        // 计算活跃天数
        const activeDays = Object.keys(statistics.dailyUsage).length;
        
        this.setData({
          stats: {
            totalUsage: Math.floor(statistics.totalUsageTime / 1000), // 转换为秒
            toolsUsed: Object.keys(statistics.toolUsageCount).length,
            daysActive: activeDays,
            favorites: favoriteTools.length
          }
        });
      }
    } catch (error) {
      LoggerService.error('Failed to load stats:', error);
    }
  },

  // 原有的loadStats方法内容
  _loadStatsOld() {
    try {
      const app = getApp<IAppOption>();
      if (app.globalData && (app.globalData as any).dataManager) {
        const dataManager = (app.globalData as any).dataManager;
        
        // 获取使用统计
        const stats = dataManager.getUsageStats();
        this.setData({ stats });
      } else {
        // 从本地存储获取统计数据
        const localStats = StorageService.get('usage_stats') || {
          totalUsage: 0,
          toolsUsed: 0,
          daysActive: 1,
          favorites: 0
        };
        this.setData({ stats: localStats });
      }
    } catch (error) {
      LoggerService.error('Failed to load stats:', error);
    }
  },

  // 加载收藏工具
  async loadFavoriteTools() {
    try {
      const favoriteIds = await dataManager.getFavoriteTools();
      const favoriteTools = this.getToolsById(favoriteIds);
      
      this.setData({ favoriteTools });
      LoggerService.info('Favorite tools loaded:', favoriteTools.length);
    } catch (error) {
      LoggerService.error('Failed to load favorite tools:', error);
    }
  },

  // 加载最近使用工具
  async loadRecentTools() {
    try {
      const recentIds = await dataManager.getRecentTools();
      const usageHistory = await dataManager.getUsageHistory();
      
      // 获取工具信息并添加最后使用时间
      const recentTools = this.getToolsById(recentIds).map(tool => {
        const lastUsage = usageHistory.find(record => record.toolId === tool.id);
        return {
          ...tool,
          lastUsed: lastUsage ? this.formatLastUsed(lastUsage.timestamp) : '未知'
        };
      });
      
      this.setData({ recentTools });
      LoggerService.info('Recent tools loaded:', recentTools.length);
    } catch (error) {
      LoggerService.error('Failed to load recent tools:', error);
    }
  },

  // 根据ID获取工具信息
  getToolsById(toolIds: string[]): Tool[] {
    // 这里应该有一个工具配置数组，暂时返回模拟数据
    const allTools: Tool[] = [
      { id: 'calculator', name: '计算器', icon: '🔢', path: '/pages/tools/calculator/calculator' },
      { id: 'converter', name: '单位转换', icon: '📏', path: '/pages/tools/converter/converter' },
      { id: 'qrcode', name: '二维码', icon: '📱', path: '/pages/tools/qrcode/qrcode' },
      { id: 'color', name: '颜色工具', icon: '🎨', path: '/pages/tools/color/color' },
      { id: 'text', name: '文本工具', icon: '📝', path: '/pages/tools/text/text' },
      { id: 'time', name: '时间工具', icon: '⏰', path: '/pages/tools/time/time' }
    ];
    
    return toolIds.map(id => allTools.find(tool => tool.id === id)).filter(Boolean) as Tool[];
  },

  // 格式化最后使用时间
  formatLastUsed(timestamp: number): string {
    if (!timestamp) return '未知';
    
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    
    return formatTime(timestamp, 'MM-dd');
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

  // 获取主题显示名称
  getThemeName(themeId: string): string {
    const themeMap: Record<string, string> = {
      'light': '默认',
      'dark': '深色',
      'auto': '跟随系统'
    };
    return themeMap[themeId] || '默认';
  },

  // 计算缓存大小
  async calculateCacheSize() {
    try {
      const storageUsage = await dataManager.getStorageUsage();
      
      // 转换为合适的单位
      let cacheSize: string;
      const sizeInBytes = storageUsage.used;
      
      if (sizeInBytes < 1024) {
        cacheSize = `${sizeInBytes}B`;
      } else if (sizeInBytes < 1024 * 1024) {
        cacheSize = `${(sizeInBytes / 1024).toFixed(1)}KB`;
      } else {
        cacheSize = `${(sizeInBytes / (1024 * 1024)).toFixed(1)}MB`;
      }
      
      this.setData({ cacheSize });
    } catch (error) {
      LoggerService.error('Failed to calculate cache size:', error);
      this.setData({ cacheSize: '未知' });
    }
  },

  // 工具点击
  onToolTap(e: WechatMiniprogram.TouchEvent) {
    const tool = e.currentTarget.dataset.tool as Tool;
    
    if (tool && tool.path) {
      wx.navigateTo({
        url: tool.path,
        success: () => {
          LoggerService.info('Navigated to tool:', tool.name);
        },
        fail: (error) => {
          LoggerService.error('Failed to navigate:', error);
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none',
            duration: 1500
          });
        }
      });
    }
  },

  // 取消收藏
  onUnfavorite(e: WechatMiniprogram.TouchEvent) {
    const tool = e.currentTarget.dataset.tool as Tool;
    
    wx.showModal({
      title: '取消收藏',
      content: `确定要取消收藏"${tool.name}"吗？`,
      success: (res) => {
        if (res.confirm) {
          const app = getApp<IAppOption>();
          if (app.globalData && (app.globalData as any).dataManager) {
            const dataManager = (app.globalData as any).dataManager;
            dataManager.removeFavoriteTool(tool.id);
          }
          
          // 更新本地数据
          const favoriteTools = this.data.favoriteTools.filter(t => t.id !== tool.id);
          this.setData({ favoriteTools });
          
          // 更新统计
          this.loadStats();
          
          wx.showToast({
            title: '已取消收藏',
            icon: 'success',
            duration: 1500
          });
          
          LoggerService.info('Tool unfavorited:', tool.name);
        }
      }
    });
  },

  // 管理收藏
  onManageFavorites() {
    wx.showToast({
      title: '功能开发中...',
      icon: 'none',
      duration: 1500
    });
  },

  // 清空最近使用
  onClearRecent() {
    wx.showModal({
      title: '清空记录',
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
            
            LoggerService.info('Recent tools cleared');
          } catch (error) {
            LoggerService.error('Failed to clear recent tools:', error);
            wx.showToast({
              title: '清空失败',
              icon: 'none',
              duration: 1500
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
    const theme = e.currentTarget.dataset.theme as Theme;
    
    this.setData({ 
      currentTheme: theme.name,
      showThemeModal: false 
    });
    
    try {
      // 保存设置
      await dataManager.updateSetting('theme', theme.id as 'light' | 'dark' | 'auto');
      
      wx.showToast({
        title: `已切换到${theme.name}主题`,
        icon: 'success',
        duration: 1500
      });
      
      LoggerService.info('Theme changed to:', theme.name);
    } catch (error) {
      LoggerService.error('Failed to save theme setting:', error);
    }
  },

  // 语言设置
  onLanguageSetting() {
    wx.showToast({
      title: '暂时只支持中文',
      icon: 'none',
      duration: 1500
    });
  },

  // 通知设置改变
  async onNotificationChange(e: WechatMiniprogram.SwitchChange) {
    const enabled = e.detail.value;
    this.setData({ notificationEnabled: enabled });
    
    try {
      // 保存设置
      const settings = await dataManager.getUserSettings();
      if (settings) {
        settings.notifications.enabled = enabled;
        await dataManager.saveUserSettings(settings);
      }
      
      wx.showToast({
        title: enabled ? '已开启通知' : '已关闭通知',
        icon: 'success',
        duration: 1500
      });
      
      LoggerService.info('Notification setting changed:', enabled);
    } catch (error) {
      LoggerService.error('Failed to save notification setting:', error);
    }
  },

  // 缓存管理
  onCacheSetting() {
    const { cacheSize } = this.data;
    
    wx.showModal({
      title: '缓存管理',
      content: `当前缓存大小：${cacheSize}\n\n清理缓存会删除所有本地数据，包括收藏、历史记录等。确定要清理吗？`,
      confirmText: '清理',
      confirmColor: '#ff4757',
      success: (res) => {
        if (res.confirm) {
          this.clearCache();
        }
      }
    });
  },

  // 清理缓存
  async clearCache() {
    wx.showLoading({ title: '清理中...' });
    
    try {
      // 备份用户设置
      const userSettings = await dataManager.getUserSettings();
      const userProfile = await dataManager.getUserProfile();
      
      // 清除所有数据
      await dataManager.clearAllData();
      
      // 恢复重要数据
      if (userProfile) {
        await dataManager.saveUserProfile(userProfile);
      }
      if (userSettings) {
        await dataManager.saveUserSettings(userSettings);
      }
      
      // 重新初始化数据
      this.initProfile();
      
      wx.hideLoading();
      wx.showToast({
        title: '缓存已清理',
        icon: 'success',
        duration: 1500
      });
      
      LoggerService.info('Cache cleared successfully');
      
    } catch (error) {
      wx.hideLoading();
      LoggerService.error('Failed to clear cache:', error);
      
      wx.showToast({
        title: '清理失败',
        icon: 'none',
        duration: 1500
      });
    }
  },

  // 意见反馈
  onFeedback() {
    wx.showModal({
      title: '意见反馈',
      content: '感谢您的反馈！请通过以下方式联系我们：\n\n• 微信群：搜索"Dailytools用户群"\n• 邮箱：feedback@dailytools.com',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 关于我们
  onAbout() {
    wx.showModal({
      title: '关于 Dailytools',
      content: 'Dailytools v1.0.0\n\n一个集成多种实用工具的微信小程序，致力于为用户提供便捷的日常服务。\n\n© 2024 Dailytools Team',
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
    
    wx.showToast({
      title: '请点击右上角分享',
      icon: 'none',
      duration: 2000
    });
  },

  // 分享给朋友
  onShareAppMessage() {
    return {
      title: 'Dailytools - 你的日常工具箱',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.png'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: 'Dailytools - 实用工具集合',
      imageUrl: '/images/share-cover.png'
    };
  }
}); 