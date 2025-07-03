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
   * 检查已有授权
   */
  private async checkExistingAuth(): Promise<AuthResult> {
    return new Promise((resolve) => {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，直接获取用户信息
            wx.getUserInfo({
              success: async (userRes) => {
                const rawUserInfo = userRes.userInfo;
                
                // 处理用户信息
                const processedUserInfo = await userInfoProcessor.processUserInfo(rawUserInfo);
                
                // 保存登录状态
                const loginState: LoginState = {
                  isLoggedIn: true,
                  userInfo: processedUserInfo,
                  loginTime: Date.now(),
                  expireTime: Date.now() + this.LOGIN_EXPIRE_TIME
                };
                this.saveLoginState(loginState);
                
                LoggerService.info('使用已有授权登录成功');
                resolve({
                  success: true,
                  userInfo: processedUserInfo
                });
              },
              fail: () => {
                resolve({ success: false, error: '获取用户信息失败' });
              }
            });
          } else {
            resolve({ success: false, error: '未授权' });
          }
        },
        fail: () => {
          resolve({ success: false, error: '检查授权状态失败' });
        }
      });
    });
  }

  /**
   * 请求用户信息授权
   */
  private async requestUserProfile(): Promise<UserInfo | null> {
    return new Promise((resolve) => {
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          LoggerService.info('获取用户信息成功:', res.userInfo);
          resolve(res.userInfo);
        },
        fail: (error) => {
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
      wx.getSetting({
        success: (res) => {
          resolve({
            hasUserInfo: !!res.authSetting['scope.userInfo'],
            canIUse: wx.canIUse('button.open-type.getUserInfo')
          });
        },
        fail: () => {
          resolve({
            hasUserInfo: false,
            canIUse: wx.canIUse('button.open-type.getUserInfo')
          });
        }
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