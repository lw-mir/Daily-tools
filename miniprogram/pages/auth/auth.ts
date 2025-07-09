// pages/auth/auth.ts
import { AuthManager } from '../../utils/authManager';
import { LoggerService } from '../../utils/logger';

interface AuthPageData {
  isLoading: boolean;
  errorMessage: string;
  canRetry: boolean;
  showDebugInfo: boolean;
  debugInfo: string;
}

interface AuthPageMethods {
  checkAuthStatus(): Promise<void>;
  performAutoLogin(): Promise<void>;
  onTestAuthorize(): void;
  onAuthorize(): Promise<void>;
  onRetry(): void;
  onSkipLogin(): void;
  showDebugInfo(): void;
}

Page<AuthPageData, AuthPageMethods>({
  data: {
    isLoading: false,
    errorMessage: '',
    canRetry: false,
    showDebugInfo: false,
    debugInfo: ''
  },

  /**
   * 页面加载时的处理
   */
  onLoad() {
    LoggerService.info('授权页面加载');
    this.checkAuthStatus();
  },

  /**
   * 页面显示时的处理
   */
  onShow() {
    // 每次显示页面时都检查授权状态
    this.checkAuthStatus();
  },

  /**
   * 检查授权状态
   */
  async checkAuthStatus() {
    try {
      const authManager = AuthManager.getInstance();
      
      // 如果已经登录，直接跳转到首页
      if (authManager.isLoggedIn()) {
        LoggerService.info('用户已登录，跳转到首页');
        wx.reLaunch({
          url: '/pages/index/index'
        });
        return;
      }

      // 检查是否已有微信授权
      const authStatus = await authManager.checkAuthStatus();
      if (authStatus.hasUserInfo) {
        // 已有授权，尝试自动登录
        this.performAutoLogin();
      } else {
        // 没有授权，显示授权界面
        LoggerService.info('未检测到授权，显示授权界面');
        this.setData({
          debugInfo: `微信版本支持getUserProfile: ${authStatus.canIUse}\n授权状态: ${authStatus.hasUserInfo ? '已授权' : '未授权'}`
        });
      }
    } catch (error) {
      LoggerService.error('检查授权状态失败:', error);
      this.setData({
        errorMessage: '检查授权状态失败，请重试',
        canRetry: true,
        debugInfo: `错误信息: ${error}`
      });
    }
  },

  /**
   * 自动登录
   */
  async performAutoLogin() {
    this.setData({ isLoading: true });
    
    try {
      const authManager = AuthManager.getInstance();
      const result = await authManager.login();
      
      if (result.success) {
        LoggerService.info('自动登录成功');
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1500
        });
        
        // 延迟跳转，让用户看到成功提示
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/index/index'
          });
        }, 1500);
      } else {
        throw new Error(result.error || '自动登录失败');
      }
    } catch (error) {
      LoggerService.error('自动登录失败:', error);
      this.setData({
        isLoading: false,
        errorMessage: '自动登录失败，请手动授权',
        canRetry: true,
        debugInfo: this.data.debugInfo + `\n自动登录失败: ${error}`
      });
    }
  },

  /**
   * 测试授权弹框
   */
  onTestAuthorize() {
    console.log('测试授权弹框被点击');
    LoggerService.info('用户点击测试授权按钮');
    
    // 检查是否支持 getUserProfile
    if (!wx.canIUse('getUserProfile')) {
      wx.showToast({
        title: '当前微信版本不支持获取用户信息',
        icon: 'none',
        duration: 2000
      });
      this.setData({
        debugInfo: this.data.debugInfo + '\n错误: 当前微信版本不支持getUserProfile'
      });
      return;
    }
    
    // 直接调用 wx.getUserProfile 测试授权弹框
    wx.getUserProfile({
      desc: '用于测试授权弹框功能',
      success: (res) => {
        console.log('测试授权成功:', res);
        LoggerService.info('测试授权成功:', res.userInfo);
        
        const userInfo = res.userInfo;
        wx.showModal({
          title: '授权成功',
          content: `获取到用户信息：\n昵称: ${userInfo.nickName}\n性别: ${userInfo.gender === 1 ? '男' : userInfo.gender === 2 ? '女' : '未知'}\n城市: ${userInfo.city || '未知'}`,
          showCancel: false,
          confirmText: '确定'
        });
        
        this.setData({
          debugInfo: this.data.debugInfo + `\n测试授权成功: ${userInfo.nickName}`
        });
      },
      fail: (error) => {
        console.log('测试授权失败:', error);
        LoggerService.warn('测试授权失败:', error);
        
        wx.showModal({
          title: '授权失败',
          content: `错误信息：${error.errMsg || '未知错误'}`,
          showCancel: false,
          confirmText: '确定'
        });
        
        this.setData({
          debugInfo: this.data.debugInfo + `\n测试授权失败: ${error.errMsg}`
        });
      }
    });
  },

  /**
   * 用户点击授权按钮
   */
  async onAuthorize() {
    this.setData({ 
      isLoading: true, 
      errorMessage: '',
      canRetry: false 
    });

    try {
      LoggerService.info('用户点击授权按钮');
      
      // 检查是否支持 getUserProfile
      if (!wx.canIUse('getUserProfile')) {
        throw new Error('当前微信版本不支持 getUserProfile');
      }
      
      // 使用 AuthManager 处理登录逻辑
      const authManager = AuthManager.getInstance();
      const result = await authManager.login();

      if (result.success && result.userInfo) {
        LoggerService.info('用户授权登录成功', result.userInfo);
        
        wx.showToast({
          title: '授权成功',
          icon: 'success',
          duration: 1500
        });

        // 延迟跳转到个人中心页面展示用户信息
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/profile/profile'
          });
        }, 1500);
      } else {
        throw new Error(result.error || '授权失败');
      }

    } catch (error) {
      LoggerService.error('用户授权失败:', error);
      
      this.setData({
        isLoading: false,
        errorMessage: error instanceof Error ? error.message : '授权失败，请重试',
        canRetry: true,
        debugInfo: this.data.debugInfo + `\n授权失败: ${error}`
      });
      
      wx.showToast({
        title: '授权失败',
        icon: 'none',
        duration: 2000
      });
    }
  },

  /**
   * 重试授权
   */
  onRetry() {
    this.setData({ 
      errorMessage: '', 
      canRetry: false 
    });
    this.checkAuthStatus();
  },

  /**
   * 跳过登录
   */
  onSkipLogin() {
    wx.showModal({
      title: '确认跳过',
      content: '跳过登录将无法使用个人数据同步功能，确定要跳过吗？',
      success: (res) => {
        if (res.confirm) {
          LoggerService.info('用户选择跳过登录');
          wx.reLaunch({
            url: '/pages/index/index'
          });
        }
      }
    });
  },

  /**
   * 显示调试信息
   */
  showDebugInfo() {
    this.setData({
      showDebugInfo: !this.data.showDebugInfo
    });
  },

  /**
   * 分享功能
   */
  onShareAppMessage() {
    return {
      title: 'Dailytools - 实用工具集合',
      path: '/pages/index/index'
    };
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: 'Dailytools - 实用工具集合'
    };
  }
}); 