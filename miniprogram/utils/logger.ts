// 日志条目类型
export type LogEntry = {
  timestamp: number
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  data?: any
}

/**
 * 日志服务工具类
 * 提供统一的日志记录功能
 */
export class LoggerService {
  private static readonly MAX_LOGS = 100
  private static logs: LogEntry[] = []
  private static isDebug = true

  /**
   * 初始化日志服务
   */
  static init() {
    console.log('LoggerService 初始化完成')
    
    // 加载本地日志
    try {
      const savedLogs = wx.getStorageSync('dailytools_logs') || []
      this.logs = savedLogs
    } catch (error) {
      console.error('加载本地日志失败', error)
    }
  }

  /**
   * 记录信息日志
   * @param message 日志消息
   * @param data 附加数据
   */
  static info(message: string, data?: any) {
    this.addLog('info', message, data)
    console.log(`[INFO] ${message}`, data)
  }

  /**
   * 记录警告日志
   * @param message 日志消息
   * @param data 附加数据
   */
  static warn(message: string, data?: any) {
    this.addLog('warn', message, data)
    console.warn(`[WARN] ${message}`, data)
  }

  /**
   * 记录错误日志
   * @param message 日志消息
   * @param data 附加数据
   */
  static error(message: string, data?: any) {
    this.addLog('error', message, data)
    console.error(`[ERROR] ${message}`, data)
  }

  /**
   * 记录调试日志
   * @param message 日志消息
   * @param data 附加数据
   */
  static debug(message: string, data?: any) {
    if (this.isDebug) {
      this.addLog('debug', message, data)
      console.log(`[DEBUG] ${message}`, data)
    }
  }

  /**
   * 添加日志条目
   * @param level 日志级别
   * @param message 日志消息
   * @param data 附加数据
   */
  private static addLog(level: 'info' | 'warn' | 'error' | 'debug', message: string, data?: any) {
    const logEntry: LogEntry = {
      timestamp: Date.now(),
      level,
      message,
      data
    }

    this.logs.unshift(logEntry)

    // 限制日志数量
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(0, this.MAX_LOGS)
    }

    // 异步保存日志
    this.saveLogs()
  }

  /**
   * 保存日志到本地存储
   */
  private static saveLogs() {
    try {
      wx.setStorage({
        key: 'dailytools_logs',
        data: this.logs,
        fail: (error) => {
          console.error('保存日志失败', error)
        }
      })
    } catch (error) {
      console.error('保存日志失败', error)
    }
  }

  /**
   * 获取所有日志
   */
  static getLogs(): LogEntry[] {
    return [...this.logs]
  }

  /**
   * 清空日志
   */
  static clearLogs() {
    this.logs = []
    try {
      wx.removeStorageSync('dailytools_logs')
      console.log('日志已清空')
    } catch (error) {
      console.error('清空日志失败', error)
    }
  }

  /**
   * 设置调试模式
   * @param debug 是否开启调试模式
   */
  static setDebugMode(debug: boolean) {
    this.isDebug = debug
    this.info('调试模式设置', { debug })
  }

  /**
   * 导出日志为字符串
   */
  static exportLogs(): string {
    return this.logs.map(log => {
      const time = new Date(log.timestamp).toLocaleString()
      const data = log.data ? JSON.stringify(log.data) : ''
      return `[${time}] [${log.level.toUpperCase()}] ${log.message} ${data}`
    }).join('\n')
  }
}

 