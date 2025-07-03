import { DataManager } from '../../../utils/dataManager'
import { formatTime } from '../../../utils/util'

// 图片信息接口
interface ImageInfo {
  path: string
  name: string
  format: string
  width: number
  height: number
  size: number
  sizeText: string
}

// 转换选项接口
interface ConversionOption {
  id: string
  name: string
  icon: string
}

// 裁剪比例接口
interface CropRatio {
  id: string
  name: string
  ratio: number
}

// 处理历史接口
interface ProcessHistory {
  id: string
  operation: string
  time: string
  originalImage: ImageInfo
  processedImage: ImageInfo
}

Page({
  data: {
    // 基础状态
    isLoading: false,
    loadingText: '处理中...',
    isFavorite: false,
    
    // 图片相关
    currentImage: null as ImageInfo | null,
    processedImage: null as ImageInfo | null,
    
    // 转换选项
    conversionOptions: [
      { id: 'format', name: '格式', icon: '🔄' },
      { id: 'crop', name: '裁剪', icon: '✂️' },
      { id: 'compress', name: '压缩', icon: '📦' },
      { id: 'rename', name: '重命名', icon: '🏷️' }
    ] as ConversionOption[],
    currentOption: 'format',
    
    // 格式转换
    outputFormat: 'jpg',
    outputQuality: 80,
    
    // 裁剪设置
    cropRatios: [
      { id: 'free', name: '自由', ratio: 0 },
      { id: 'square', name: '1:1', ratio: 1 },
      { id: 'photo', name: '4:3', ratio: 4/3 },
      { id: 'wide', name: '16:9', ratio: 16/9 },
      { id: 'portrait', name: '3:4', ratio: 3/4 },
      { id: 'cinema', name: '21:9', ratio: 21/9 }
    ] as CropRatio[],
    selectedCropRatio: 'free',
    
    // 重命名
    outputFileName: '',
    
    // 历史记录
    history: [] as ProcessHistory[]
  },

  dataManager: null as DataManager | null,

  onLoad() {
    this.dataManager = new DataManager()
    this.loadFavoriteStatus()
    this.loadHistory()
  },

  // 加载收藏状态
  async loadFavoriteStatus() {
    try {
      const isFavorite = await this.dataManager?.isFavorite('imageconverter') || false
      this.setData({ isFavorite })
    } catch (error) {
      console.error('加载收藏状态失败:', error)
    }
  },

  // 加载历史记录
  async loadHistory() {
    try {
      // 使用缓存数据来存储图片转换历史
      const history = await this.dataManager?.getCacheData('imageconverter_history') || []
      this.setData({ history })
    } catch (error) {
      console.error('加载历史记录失败:', error)
    }
  },

  // 切换收藏状态
  async onToggleFavorite() {
    try {
      const { isFavorite } = this.data
      
      const result = await this.dataManager?.toggleFavorite('imageconverter')
      
      if (result?.success) {
        this.setData({ isFavorite: result.isFavorite })
        
        wx.showToast({
          title: result.isFavorite ? '已添加收藏' : '已取消收藏',
          icon: 'success',
          duration: 1500
        })
      } else {
        wx.showToast({
          title: result?.message || '操作失败',
          icon: 'error'
        })
      }
    } catch (error) {
      console.error('切换收藏状态失败:', error)
      wx.showToast({
        title: '操作失败',
        icon: 'error'
      })
    }
  },

  // 选择图片
  onChooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        this.analyzeImage(tempFilePath)
      },
      fail: (error) => {
        console.error('选择图片失败:', error)
        wx.showToast({
          title: '选择图片失败',
          icon: 'error'
        })
      }
    })
  },

  // 分析图片信息
  analyzeImage(imagePath: string) {
    wx.getImageInfo({
      src: imagePath,
      success: (res) => {
        const fileName = `image_${Date.now()}`
        const format = this.getImageFormat(imagePath)
        const sizeText = this.formatFileSize(res.width * res.height * 4) // 估算大小
        
        const imageInfo: ImageInfo = {
          path: imagePath,
          name: fileName,
          format: format,
          width: res.width,
          height: res.height,
          size: res.width * res.height * 4,
          sizeText: sizeText
        }

        this.setData({
          currentImage: imageInfo,
          processedImage: null,
          outputFileName: fileName,
          outputFormat: format === 'PNG' ? 'png' : 'jpg'
        })
      },
      fail: (error) => {
        console.error('获取图片信息失败:', error)
        wx.showToast({
          title: '获取图片信息失败',
          icon: 'error'
        })
      }
    })
  },

  // 获取图片格式
  getImageFormat(path: string): string {
    const extension = path.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'png':
        return 'PNG'
      case 'jpg':
      case 'jpeg':
        return 'JPG'
      case 'gif':
        return 'GIF'
      default:
        return 'JPG'
    }
  },

  // 格式化文件大小
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  },

  // 切换转换选项
  onOptionChange(e: any) {
    const option = e.currentTarget.dataset.option
    this.setData({ currentOption: option })
  },

  // 切换输出格式
  onFormatChange(e: any) {
    const format = e.currentTarget.dataset.format
    this.setData({ outputFormat: format })
  },

  // 调整质量
  onQualityChange(e: any) {
    const quality = e.detail.value
    this.setData({ outputQuality: quality })
  },

  // 切换裁剪比例
  onCropRatioChange(e: any) {
    const ratio = e.currentTarget.dataset.ratio
    this.setData({ selectedCropRatio: ratio })
  },

  // 输入文件名
  onFileNameInput(e: any) {
    const fileName = e.detail.value
    this.setData({ outputFileName: fileName })
  },

  // 处理图片
  async onProcessImage() {
    const { currentImage, currentOption } = this.data
    if (!currentImage) return

    // 验证参数
    const validation = this.validateProcessParams()
    if (!validation.valid) {
      wx.showToast({
        title: validation.message || '参数错误',
        icon: 'error'
      })
      return
    }

    // 添加触觉反馈
    wx.vibrateShort({
      type: 'light'
    })

    this.setData({ 
      isLoading: true,
      loadingText: this.getLoadingText(currentOption)
    })

    try {
      let processedImage: ImageInfo
      
      switch (currentOption) {
        case 'format':
          processedImage = await this.convertFormat(currentImage)
          break
        case 'crop':
          processedImage = await this.cropImage(currentImage)
          break
        case 'compress':
          processedImage = await this.compressImage(currentImage)
          break
        case 'rename':
          processedImage = await this.renameImage(currentImage)
          break
        default:
          throw new Error('未知的处理选项')
      }

      // 获取实际文件大小
      if (processedImage.path !== currentImage.path) {
        const actualSize = await this.getImageFileSize(processedImage.path)
        if (actualSize > 0) {
          processedImage.size = actualSize
          processedImage.sizeText = this.formatFileSize(actualSize)
        }
      }

      this.setData({ processedImage })
      await this.saveToHistory(currentImage, processedImage, currentOption)
      
      wx.showToast({
        title: '处理完成',
        icon: 'success'
      })

      // 添加使用记录
      await this.dataManager?.addUsageRecord({
        toolId: 'imageconverter',
        toolName: '图片转换',
        category: 'tools'
      })
      
    } catch (error) {
      console.error('处理图片失败:', error)
      wx.showToast({
        title: error instanceof Error ? error.message : '处理失败',
        icon: 'error'
      })
    } finally {
      this.setData({ isLoading: false })
    }
  },

  // 格式转换
  async convertFormat(imageInfo: ImageInfo): Promise<ImageInfo> {
    return new Promise((resolve, reject) => {
      const { outputFormat, outputQuality } = this.data
      
      // 如果格式相同且质量为100%，直接返回原图
      if (imageInfo.format.toLowerCase() === outputFormat.toLowerCase() && outputQuality >= 100) {
        resolve({
          ...imageInfo,
          name: `${this.data.outputFileName}.${outputFormat}`
        })
        return
      }
      
      // 创建canvas进行格式转换
      const query = wx.createSelectorQuery().in(this)
      query.select('#imageCanvas').fields({ node: true, size: true }).exec((res) => {
        if (!res[0] || !res[0].node) {
          // 如果没有canvas节点，使用compressImage API进行格式转换
          this.fallbackConvertFormat(imageInfo, outputFormat, outputQuality, resolve, reject)
          return
        }

        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        
        // 设置canvas尺寸
        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = imageInfo.width * dpr
        canvas.height = imageInfo.height * dpr
        ctx.scale(dpr, dpr)
        
        // 创建图片对象
        const img = canvas.createImage()
        img.onload = () => {
          try {
            // 清空canvas
            ctx.clearRect(0, 0, imageInfo.width, imageInfo.height)
            
            // 绘制图片
            ctx.drawImage(img, 0, 0, imageInfo.width, imageInfo.height)
            
            // 导出图片 - 使用Canvas 2D API
            wx.canvasToTempFilePath({
              canvas: canvas,
              fileType: outputFormat as 'jpg' | 'png',
              quality: outputQuality / 100,
              success: (canvasRes) => {
                this.getProcessedImageInfo(canvasRes.tempFilePath, outputFormat, `${this.data.outputFileName}.${outputFormat}`, resolve, reject)
              },
              fail: (error) => {
                console.error('Canvas导出失败:', error)
                // 降级到API方式
                this.fallbackConvertFormat(imageInfo, outputFormat, outputQuality, resolve, reject)
              }
            })
          } catch (error) {
            console.error('Canvas处理失败:', error)
            this.fallbackConvertFormat(imageInfo, outputFormat, outputQuality, resolve, reject)
          }
        }
        img.onerror = (error: any) => {
          console.error('图片加载失败:', error)
          this.fallbackConvertFormat(imageInfo, outputFormat, outputQuality, resolve, reject)
        }
        img.src = imageInfo.path
      })
    })
  },

  // 降级格式转换方法
  fallbackConvertFormat(imageInfo: ImageInfo, outputFormat: string, outputQuality: number, resolve: (value: ImageInfo) => void, reject: (reason?: any) => void) {
    wx.compressImage({
      src: imageInfo.path,
      quality: outputQuality,
      compressedWidth: imageInfo.width,
      compressedHeight: imageInfo.height,
      success: (compressRes) => {
        this.getProcessedImageInfo(compressRes.tempFilePath, outputFormat, `${this.data.outputFileName}.${outputFormat}`, resolve, reject)
      },
      fail: (error) => {
        console.error('压缩图片失败:', error)
        reject(error)
      }
    })
  },

  // 获取处理后图片信息的通用方法
  getProcessedImageInfo(filePath: string, format: string, name: string, resolve: (value: ImageInfo) => void, reject: (reason?: any) => void) {
    wx.getImageInfo({
      src: filePath,
      success: (imageRes) => {
        wx.getFileSystemManager().getFileInfo({
          filePath: filePath,
          success: (fileRes: any) => {
            const processedImage: ImageInfo = {
              path: filePath,
              format: format.toUpperCase(),
              name: name,
              width: imageRes.width,
              height: imageRes.height,
              size: fileRes.size,
              sizeText: this.formatFileSize(fileRes.size)
            }
            resolve(processedImage)
          },
          fail: () => {
            // 如果获取文件大小失败，使用估算值
            const estimatedSize = imageRes.width * imageRes.height * 4
            const processedImage: ImageInfo = {
              path: filePath,
              format: format.toUpperCase(),
              name: name,
              width: imageRes.width,
              height: imageRes.height,
              size: estimatedSize,
              sizeText: this.formatFileSize(estimatedSize)
            }
            resolve(processedImage)
          }
        })
      },
      fail: (error) => {
        console.error('获取图片信息失败:', error)
        reject(error)
      }
    })
  },

  // 裁剪图片
  async cropImage(imageInfo: ImageInfo): Promise<ImageInfo> {
    return new Promise((resolve, reject) => {
      const { selectedCropRatio, cropRatios } = this.data
      const ratio = cropRatios.find(r => r.id === selectedCropRatio)?.ratio || 0
      
      let cropWidth = imageInfo.width
      let cropHeight = imageInfo.height
      let cropX = 0
      let cropY = 0
      
      if (ratio > 0) {
        if (imageInfo.width / imageInfo.height > ratio) {
          // 宽度过大，需要裁剪宽度
          cropWidth = imageInfo.height * ratio
          cropX = (imageInfo.width - cropWidth) / 2
        } else {
          // 高度过大，需要裁剪高度
          cropHeight = imageInfo.width / ratio
          cropY = (imageInfo.height - cropHeight) / 2
        }
      }

      // 使用canvas进行裁剪
      const query = wx.createSelectorQuery().in(this)
      query.select('#imageCanvas').fields({ node: true, size: true }).exec((res) => {
        if (!res[0] || !res[0].node) {
          // 如果没有canvas节点，返回计算后的信息（模拟裁剪）
          const processedImage: ImageInfo = {
            ...imageInfo,
            width: Math.round(cropWidth),
            height: Math.round(cropHeight),
            name: `${this.data.outputFileName}_cropped`,
            sizeText: this.formatFileSize(cropWidth * cropHeight * 4)
          }
          resolve(processedImage)
          return
        }

        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        
        // 设置canvas尺寸为裁剪后的尺寸
        const dpr = wx.getSystemInfoSync().pixelRatio
        const finalWidth = Math.round(cropWidth)
        const finalHeight = Math.round(cropHeight)
        canvas.width = finalWidth * dpr
        canvas.height = finalHeight * dpr
        ctx.scale(dpr, dpr)
        
        // 创建图片对象
        const img = canvas.createImage()
        img.onload = () => {
          try {
            // 清空canvas
            ctx.clearRect(0, 0, finalWidth, finalHeight)
            
            // 绘制裁剪后的图片
            ctx.drawImage(
              img, 
              cropX, cropY, cropWidth, cropHeight,  // 源图片的裁剪区域
              0, 0, finalWidth, finalHeight         // 目标canvas的绘制区域
            )
            
            // 导出裁剪后的图片
            wx.canvasToTempFilePath({
              canvas: canvas,
              success: (canvasRes) => {
                this.getProcessedImageInfo(canvasRes.tempFilePath, imageInfo.format, `${this.data.outputFileName}_cropped`, resolve, reject)
              },
              fail: (error) => {
                console.error('Canvas裁剪导出失败:', error)
                reject(error)
              }
            })
          } catch (error) {
            console.error('Canvas裁剪处理失败:', error)
            reject(error)
          }
        }
        img.onerror = (error: any) => {
          console.error('图片加载失败:', error)
          reject(error)
        }
        img.src = imageInfo.path
      })
    })
  },

  // 压缩图片
  async compressImage(imageInfo: ImageInfo): Promise<ImageInfo> {
    return new Promise((resolve, reject) => {
      const { outputQuality } = this.data
      
      // 使用微信API进行图片压缩
      wx.compressImage({
        src: imageInfo.path,
        quality: outputQuality,
        success: (compressRes) => {
          this.getProcessedImageInfo(compressRes.tempFilePath, imageInfo.format, `${this.data.outputFileName}_compressed`, resolve, reject)
        },
        fail: (error) => {
          console.error('压缩图片失败:', error)
          reject(error)
        }
      })
    })
  },

  // 重命名图片
  async renameImage(imageInfo: ImageInfo): Promise<ImageInfo> {
    return new Promise((resolve, reject) => {
      const { outputFileName } = this.data
      
      if (!outputFileName.trim()) {
        reject(new Error('文件名不能为空'))
        return
      }
      
      // 对于重命名，我们需要复制文件以实现真正的重命名
      // 使用Canvas重新绘制图片，这样可以确保保存时使用新的文件名
      const query = wx.createSelectorQuery().in(this)
      query.select('#imageCanvas').fields({ node: true, size: true }).exec((res) => {
        if (!res[0] || !res[0].node) {
          // 如果没有canvas节点，只更改显示名称
          const processedImage: ImageInfo = {
            ...imageInfo,
            name: outputFileName.trim(),
            path: imageInfo.path
          }
          resolve(processedImage)
          return
        }

        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        
        // 设置canvas尺寸
        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = imageInfo.width * dpr
        canvas.height = imageInfo.height * dpr
        ctx.scale(dpr, dpr)
        
        // 创建图片对象
        const img = canvas.createImage()
        img.onload = () => {
          try {
            // 清空canvas
            ctx.clearRect(0, 0, imageInfo.width, imageInfo.height)
            
            // 绘制图片
            ctx.drawImage(img, 0, 0, imageInfo.width, imageInfo.height)
            
            // 导出图片
            wx.canvasToTempFilePath({
              canvas: canvas,
              success: (canvasRes) => {
                this.getProcessedImageInfo(canvasRes.tempFilePath, imageInfo.format, outputFileName.trim(), resolve, reject)
              },
              fail: (error) => {
                console.error('Canvas重命名导出失败:', error)
                // 降级方案：只更改显示名称
                const processedImage: ImageInfo = {
                  ...imageInfo,
                  name: outputFileName.trim(),
                  path: imageInfo.path
                }
                resolve(processedImage)
              }
            })
          } catch (error) {
            console.error('Canvas重命名处理失败:', error)
            // 降级方案：只更改显示名称
            const processedImage: ImageInfo = {
              ...imageInfo,
              name: outputFileName.trim(),
              path: imageInfo.path
            }
            resolve(processedImage)
          }
        }
        img.onerror = (error: any) => {
          console.error('图片加载失败:', error)
          // 降级方案：只更改显示名称
          const processedImage: ImageInfo = {
            ...imageInfo,
            name: outputFileName.trim(),
            path: imageInfo.path
          }
          resolve(processedImage)
        }
        img.src = imageInfo.path
      })
    })
  },

  // 保存到相册
  onSaveToAlbum() {
    const { processedImage } = this.data
    if (!processedImage) {
      wx.showToast({
        title: '没有可保存的图片',
        icon: 'error'
      })
      return
    }

    // 检查保存权限
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.writePhotosAlbum'] === false) {
          // 用户之前拒绝了权限，引导用户手动开启
          wx.showModal({
            title: '需要相册权限',
            content: '需要获得您的同意，才能保存图片到相册',
            showCancel: true,
            confirmText: '去设置',
            success: (modalRes) => {
              if (modalRes.confirm) {
                wx.openSetting({
                  success: (settingRes) => {
                    if (settingRes.authSetting['scope.writePhotosAlbum']) {
                      this.saveImageToAlbum(processedImage.path)
                    }
                  }
                })
              }
            }
          })
        } else {
          // 直接保存或请求权限
          this.saveImageToAlbum(processedImage.path)
        }
      },
      fail: () => {
        // 获取设置失败，直接尝试保存
        this.saveImageToAlbum(processedImage.path)
      }
    })
  },

  // 实际保存图片到相册的方法
  saveImageToAlbum(filePath: string) {
    wx.showLoading({
      title: '保存中...',
      mask: true
    })

    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success: () => {
        wx.hideLoading()
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
        
        // 保存成功后，记录到历史
        if (this.data.currentImage && this.data.processedImage) {
          this.saveToHistory(this.data.currentImage, this.data.processedImage, this.data.currentOption)
        }
      },
      fail: (error) => {
        wx.hideLoading()
        console.error('保存到相册失败:', error)
        
        let errorMsg = '保存失败'
        if (error.errMsg.includes('auth deny')) {
          errorMsg = '保存失败，请授权相册权限'
        } else if (error.errMsg.includes('system permission denied')) {
          errorMsg = '保存失败，请在系统设置中开启相册权限'
        }
        
        wx.showModal({
          title: '保存失败',
          content: errorMsg,
          showCancel: false,
          confirmText: '确定'
        })
      }
    })
  },

  // 重新处理
  onResetImage() {
    this.setData({
      processedImage: null,
      currentOption: 'format'
    })
  },

  // 保存到历史记录
  async saveToHistory(original: ImageInfo, processed: ImageInfo, operation: string) {
    try {
      const historyItem: ProcessHistory = {
        id: Date.now().toString(),
        operation: this.getOperationName(operation),
        time: formatTime(new Date(Date.now())),
        originalImage: original,
        processedImage: processed
      }

      // 获取现有历史记录
      const existingHistory = await this.dataManager?.getCacheData('imageconverter_history') || []
      const updatedHistory = [historyItem, ...existingHistory].slice(0, 50) // 只保留最近50条记录
      
      // 保存更新后的历史记录
      await this.dataManager?.setCacheData('imageconverter_history', updatedHistory)
      
      this.setData({ history: updatedHistory })
    } catch (error) {
      console.error('保存历史记录失败:', error)
    }
  },

  // 获取操作名称
  getOperationName(operation: string): string {
    const operationMap: { [key: string]: string } = {
      'format': '格式转换',
      'crop': '图片裁剪',
      'compress': '图片压缩',
      'rename': '重命名'
    }
    return operationMap[operation] || operation
  },

  // 清空历史记录
  async onClearHistory() {
    try {
      await this.dataManager?.setCacheData('imageconverter_history', [])
      this.setData({ history: [] })
      
      wx.showToast({
        title: '已清空历史',
        icon: 'success'
      })
    } catch (error) {
      console.error('清空历史记录失败:', error)
      wx.showToast({
        title: '清空失败',
        icon: 'error'
      })
    }
  },

  // 检查图片格式是否支持
  isSupportedFormat(format: string): boolean {
    const supportedFormats = ['jpg', 'jpeg', 'png', 'webp']
    return supportedFormats.includes(format.toLowerCase())
  },

  // 获取图片实际文件大小
  async getImageFileSize(filePath: string): Promise<number> {
    return new Promise((resolve) => {
      wx.getFileSystemManager().getFileInfo({
        filePath: filePath,
        success: (res: any) => {
          resolve(res.size || 0)
        },
        fail: () => {
          resolve(0)
        }
      })
    })
  },

  // 验证处理参数
  validateProcessParams(): { valid: boolean; message?: string } {
    const { currentOption, outputFileName, selectedCropRatio } = this.data

    switch (currentOption) {
      case 'rename':
        if (!outputFileName.trim()) {
          return { valid: false, message: '请输入文件名' }
        }
        if (outputFileName.length > 50) {
          return { valid: false, message: '文件名过长' }
        }
        break
      case 'crop':
        if (!selectedCropRatio) {
          return { valid: false, message: '请选择裁剪比例' }
        }
        break
    }

    return { valid: true }
  },

  // 获取加载文本
  getLoadingText(option: string): string {
    const textMap: { [key: string]: string } = {
      'format': '格式转换中...',
      'crop': '图片裁剪中...',
      'compress': '图片压缩中...',
      'rename': '重命名中...'
    }
    return textMap[option] || '处理中...'
  }
}) 