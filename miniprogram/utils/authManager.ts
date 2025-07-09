// 微信授权管理器
import { StorageService } from './storage';
import { LoggerService } from './logger';
import { userInfoProcessor } from './userInfoProcessor';
import { userDataStorage, UserLoginState } from './userDataStorage';

interface UserInfo {
  nickName: string;
  avatarUrl: string;
  gender: number;
  country: string;
  province: string;
  city: string;
  language: string;
}

interface AuthResult {
  success: boolean;
  userInfo?: UserInfo;
  error?: string;
}

interface LoginState {
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  loginTime: number;
  expireTime: number;
}

export class AuthManager {
  private static instance: AuthManager;
  private readonly STORAGE_KEY = 'user_login_state';
  private readonly LOGIN_EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000; // 7天过期

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  /**
   * 检查用户是否已登录
   */
  isLoggedIn(): boolean {
    try {
      const loginState = this.getLoginState();
      if (!loginState) return false;
      
      // 检查是否过期
      if (Date.now() > loginState.expireTime) {
        this.logout();
        return false;
      }
      
      return loginState.isLoggedIn && !!loginState.userInfo;
    } catch (error) {
      LoggerService.error('检查登录状态失败:', error);
      return false;
    }
  }

  /**
   * 获取当前用户信息
   */
  getUserInfo(): UserInfo | null {
    try {
      const loginState = this.getLoginState();
      if (!loginState || !this.isLoggedIn()) {
        return null;
      }
      return loginState.userInfo;
    } catch (error) {
      LoggerService.error('获取用户信息失败:', error);
      return null;
    }
  }

  /**
   * 获取登录状态详情（公共方法）
   */
  getLoginStateInfo(): LoginState | null {
    return this.getLoginState();
  }

  /**
   * 微信授权登录
   */
  async login(): Promise<AuthResult> {
    try {
      LoggerService.info('开始微信授权登录');
      
      // 1. 先检查是否已经授权
      const existingAuth = await this.checkExistingAuth();
      if (existingAuth.success) {
        return existingAuth;
      }

      // 2. 获取用户信息授权
      const rawUserInfo = await this.requestUserProfile();
      if (!rawUserInfo) {
        return {
          success: false,
          error: '用户取消授权'
        };
      }

      // 3. 处理用户信息
      const processedUserInfo = await userInfoProcessor.processUserInfo(rawUserInfo);
      
      // 4. 保存登录状态
      const loginState: UserLoginState = {
        isLoggedIn: true,
        userInfo: processedUserInfo,
        loginTime: Date.now(),
        expireTime: Date.now() + this.LOGIN_EXPIRE_TIME
      };

      await userDataStorage.saveLoginState(loginState);
      
      LoggerService.info('微信授权登录成功:', processedUserInfo);
      
      return {
        success: true,
        userInfo: processedUserInfo
      };

    } catch (error) {
      LoggerService.error('微信授权登录失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '登录失败'
      };
    }
  }

  /**
   * 检查已有授权（注意：不再检查scope.userInfo，因为getUserProfile每次都需要用户主动触发）
   */
  private async checkExistingAuth(): Promise<AuthResult> {
    return new Promise((resolve) => {
             // 检查本地是否有有效的登录状态
       const loginState = this.getLoginState();
       if (loginState && loginState.isLoggedIn && loginState.userInfo && loginState.expireTime > Date.now()) {
         LoggerService.info('使用本地登录状态');
         resolve({
           success: true,
           userInfo: loginState.userInfo
         });
       } else {
         // 没有有效的本地登录状态，需要重新授权
         resolve({ success: false, error: '需要重新授权' });
       }
    });
  }

  /**
   * 请求用户信息授权
   */
  private async requestUserProfile(): Promise<UserInfo | null> {
    return new Promise((resolve) => {
      console.log('AuthManager: 开始调用 wx.getUserProfile...');
      
      // 检查是否支持 getUserProfile
      if (!wx.canIUse('getUserProfile')) {
        console.error('当前微信版本不支持 getUserProfile');
        LoggerService.error('当前微信版本不支持 getUserProfile');
        resolve(null);
        return;
      }
      
      wx.getUserProfile({
        desc: '用于完善用户资料', // 声明获取用户个人信息后的用途
        success: (res) => {
          console.log('AuthManager: wx.getUserProfile 调用成功:', res);
          LoggerService.info('获取用户信息成功:', res.userInfo);
          resolve(res.userInfo);
        },
        fail: (error) => {
          console.log('AuthManager: wx.getUserProfile 调用失败:', error);
          LoggerService.warn('用户拒绝授权:', error);
          resolve(null);
        }
      });
    });
  }

  /**
   * 退出登录
   */
  logout(): void {
    try {
      StorageService.remove(this.STORAGE_KEY);
      LoggerService.info('用户退出登录');
    } catch (error) {
      LoggerService.error('退出登录失败:', error);
    }
  }

  /**
   * 刷新登录状态（延长过期时间）
   */
  refreshLoginState(): void {
    try {
      const loginState = this.getLoginState();
      if (loginState && loginState.isLoggedIn) {
        loginState.expireTime = Date.now() + this.LOGIN_EXPIRE_TIME;
        this.saveLoginState(loginState);
        LoggerService.info('登录状态已刷新');
      }
    } catch (error) {
      LoggerService.error('刷新登录状态失败:', error);
    }
  }

  /**
   * 检查授权状态
   */
  async checkAuthStatus(): Promise<{
    hasUserInfo: boolean;
    canIUse: boolean;
  }> {
    return new Promise((resolve) => {
      // 检查本地是否有有效的用户信息
      const loginState = this.getLoginState();
      const hasValidUserInfo = !!(loginState && loginState.isLoggedIn && loginState.userInfo && loginState.expireTime > Date.now());
      
      resolve({
        hasUserInfo: hasValidUserInfo,
        canIUse: wx.canIUse('getUserProfile')
      });
    });
  }

  /**
   * 获取登录状态（私有方法）
   */
  private getLoginState(): LoginState | null {
    try {
      return StorageService.get(this.STORAGE_KEY);
    } catch (error) {
      LoggerService.error('获取登录状态失败:', error);
      return null;
    }
  }

  /**
   * 保存登录状态
   */
  saveLoginState(loginState: LoginState): void {
    try {
      StorageService.set(this.STORAGE_KEY, loginState);
    } catch (error) {
      LoggerService.error('保存登录状态失败:', error);
    }
  }
}

// 导出单例实例
export const authManager = AuthManager.getInstance(); 