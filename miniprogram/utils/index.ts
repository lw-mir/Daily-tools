/**
 * 通用工具函数
 */

/**
 * 格式化时间
 * @param timestamp 时间戳
 * @param format 格式化字符串
 */
export function formatTime(timestamp: number, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  const second = date.getSeconds().toString().padStart(2, '0')

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param delay 延迟时间
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | undefined
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param delay 延迟时间
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastExecTime = 0
  return (...args: Parameters<T>) => {
    const currentTime = Date.now()
    if (currentTime - lastExecTime > delay) {
      func(...args)
      lastExecTime = currentTime
    }
  }
}

/**
 * 深拷贝
 * @param obj 要拷贝的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T
  }

  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }

  return obj
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 验证手机号
 * @param phone 手机号
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 验证邮箱
 * @param email 邮箱
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 获取文件扩展名
 * @param filename 文件名
 */
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

/**
 * 字节转换为可读格式
 * @param bytes 字节数
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 颜色格式转换
 */
export const ColorUtils = {
  /**
   * RGB转HEX
   */
  rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  },

  /**
   * HEX转RGB
   */
  hexToRgb(hex: string): { r: number, g: number, b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
}

/**
 * 数学计算工具
 */
export const MathUtils = {
  /**
   * 精确加法
   */
  add(a: number, b: number): number {
    const aDecimal = (a.toString().split('.')[1] || '').length
    const bDecimal = (b.toString().split('.')[1] || '').length
    const maxDecimal = Math.max(aDecimal, bDecimal)
    const multiplier = Math.pow(10, maxDecimal)
    
    return (Math.round(a * multiplier) + Math.round(b * multiplier)) / multiplier
  },

  /**
   * 精确减法
   */
  subtract(a: number, b: number): number {
    return this.add(a, -b)
  },

  /**
   * 精确乘法
   */
  multiply(a: number, b: number): number {
    const aDecimal = (a.toString().split('.')[1] || '').length
    const bDecimal = (b.toString().split('.')[1] || '').length
    const multiplier = Math.pow(10, aDecimal + bDecimal)
    
    return (Math.round(a * Math.pow(10, aDecimal)) * Math.round(b * Math.pow(10, bDecimal))) / multiplier
  },

  /**
   * 精确除法
   */
  divide(a: number, b: number): number {
    if (b === 0) throw new Error('除数不能为零')
    
    const aDecimal = (a.toString().split('.')[1] || '').length
    const bDecimal = (b.toString().split('.')[1] || '').length
    
    return (Math.round(a * Math.pow(10, aDecimal)) / Math.round(b * Math.pow(10, bDecimal))) * Math.pow(10, bDecimal - aDecimal)
  }
} 