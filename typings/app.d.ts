// 全局应用数据接口
interface IGlobalData {
  userInfo?: WechatMiniprogram.UserInfo
  systemInfo?: WechatMiniprogram.SystemInfo
  version: string
  theme: 'light' | 'dark'
  recentTools: string[]
  favoriteTools: string[]
}

// 扩展应用选项接口
interface IAppOption {
  globalData: IGlobalData
  
  // 生命周期方法
  onLaunch?(options: WechatMiniprogram.App.LaunchShowOption): Promise<void> | void
  onShow?(options: WechatMiniprogram.App.LaunchShowOption): void
  onHide?(): void
  onError?(error: string): void
  
  // 自定义方法
  getSystemInfo?(): void
  loadUserData?(): Promise<void> | void
  checkLoginStatus?(): void
  doLogin?(): void
  addRecentTool?(toolId: string): Promise<void> | void
  toggleFavoriteTool?(toolId: string): Promise<void> | void
} 