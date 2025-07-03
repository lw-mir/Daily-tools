import { StorageService } from '../../../utils/storage';
import { LoggerService } from '../../../utils/logger';
import { formatTime } from '../../../utils/index';
import { DataManager } from '../../../utils/dataManager';

const dataManager = DataManager.getInstance();

interface ImageInfo {
  id: string;
  name: string;
  path: string;
  size: number;
  width: number;
  height: number;
  format: string;
  uploadTime: string;
}

interface ConversionOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface CropRatio {
  id: string;
  name: string;
  ratio: number;
  width: number;
  height: number;
}

interface ProcessHistory {
  id: string;
  originalImage: ImageInfo;
  processedImage: ImageInfo;
  operation: string;
  parameters: any;
  time: string;
  timestamp: number;
}

interface SimpleHistory {
  id: string;
  operation: string;
  timestamp: number;
  time: string;
  details: any;
  success: boolean;
}

interface ImageConverterData {
  currentImage: ImageInfo | null;
  processedImage: ImageInfo | null;
  conversionOptions: ConversionOption[];
  currentOption: string;
  cropRatios: CropRatio[];
  selectedCropRatio: string;
  outputFormat: string;
  outputQuality: number;
  outputFileName: string;
  history: ProcessHistory[];
  simpleHistory: SimpleHistory[];
  isLoading: boolean;
  loadingText: string;
  isFavorite: boolean;
  showCropTool: boolean;
  showFormatOptions: boolean;
  showQualitySlider: boolean;
}

Page({
  data: {
    currentImage: null,
    processedImage: null,
    
    conversionOptions: [
      { id: 'format', name: '格式转换', icon: '🔄', description: 'JPG/PNG格式互转' },
      { id: 'crop', name: '裁剪', icon: '✂️', description: '按比例或自由裁剪' },
      { id: 'compress', name: '压缩', icon: '📦', description: '减小文件大小' },
      { id: 'rename', name: '重命名', icon: '📝', description: '修改文件名称' }
    ],
    currentOption: 'format',
    
    cropRatios: [
      { id: 'free', name: '自由裁剪', ratio: 0, width: 0, height: 0 },
      { id: '1:1', name: '正方形', ratio: 1, width: 1, height: 1 },
      { id: '4:3', name: '4:3', ratio: 4/3, width: 4, height: 3 },
      { id: '16:9', name: '16:9', ratio: 16/9, width: 16, height: 9 },
      { id: '3:4', name: '3:4', ratio: 3/4, width: 3, height: 4 },
      { id: '9:16', name: '9:16', ratio: 9/16, width: 9, height: 16 }
    ],
    selectedCropRatio: '1:1',
    
    outputFormat: 'jpg',
    outputQuality: 80,
    outputFileName: '',
    
    history: [],
    simpleHistory: [],
    
    isLoading: false,
    loadingText: '处理中...',
    isFavorite: false,
    
    showCropTool: false,
    showFormatOptions: false,
    showQualitySlider: false
  } as ImageConverterData,

  async onLoad() {
    LoggerService.info('Image Converter page loaded');
    await this.loadHistory();
    await this.checkFavoriteStatus();
    
    try {
      await dataManager.addRecentTool('image-converter');
      await dataManager.addUsageRecord({
        toolId: 'image-converter',
        toolName: '图片转换',
        category: '工具'
      });
    } catch (error) {
      LoggerService.error('Failed to record tool usage:', error);
    }
  },

  onShow() {
    const lastState = StorageService.get('image_converter_state');
    if (lastState) {
      this.setData({
        currentOption: lastState.currentOption || 'format',
        outputFormat: lastState.outputFormat || 'jpg',
        outputQuality: lastState.outputQuality || 80,
        selectedCropRatio: lastState.selectedCropRatio || '1:1'
      });
    }
  },

  onHide() {
    StorageService.set('image_converter_state', {
      currentOption: this.data.currentOption,
      outputFormat: this.data.outputFormat,
      outputQuality: this.data.outputQuality,
      selectedCropRatio: this.data.selectedCropRatio
    });
  },

  onUnload() {
    LoggerService.info('Image Converter page unloaded');
    this.cleanupTempFiles();
  },

  async onChooseImage() {
    try {
      this.setData({ isLoading: true, loadingText: '选择图片中...' });
      
      const res = await wx.chooseImage({
        count: 1,
        sizeType: ['original'],
        sourceType: ['album', 'camera']
      });

      if (res.tempFilePaths && res.tempFilePaths.length > 0) {
        const tempFilePath = res.tempFilePaths[0];
        await this.processSelectedImage(tempFilePath);
      }
    } catch (error) {
      LoggerService.error('Choose image failed:', error);
      this.showError('选择图片失败', error);
    } finally {
      this.setData({ isLoading: false });
    }
  },

  async processSelectedImage(tempFilePath: string) {
    try {
      this.setData({ loadingText: '分析图片中...' });
      
      const imageInfo = await this.getImageInfo(tempFilePath);
      const defaultName = `image_${Date.now()}`;
      
      this.setData({
        currentImage: imageInfo,
        processedImage: null,
        outputFileName: defaultName
      });

      wx.showToast({
        title: '图片加载成功',
        icon: 'success'
      });
    } catch (error) {
      this.showError('处理图片失败', error);
    }
  },

  async getImageInfo(path: string): Promise<ImageInfo> {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: path,
        success: (res) => {
          const timestamp = Date.now();
          resolve({
            id: timestamp.toString(),
            name: `image_${timestamp}`,
            path: res.path,
            size: 0, // 微信小程序无法直接获取文件大小
            width: res.width,
            height: res.height,
            format: res.type || 'unknown',
            uploadTime: formatTime(timestamp)
          });
        },
        fail: reject
      });
    });
  },

  onOptionChange(e: WechatMiniprogram.TouchEvent) {
    const option = e.currentTarget.dataset.option;
    this.setData({ currentOption: option });
  },

  onFileNameInput(e: WechatMiniprogram.Input) {
    this.setData({ outputFileName: e.detail.value });
  },

  onFormatChange(e: WechatMiniprogram.TouchEvent) {
    const format = e.currentTarget.dataset.format;
    this.setData({ outputFormat: format });
  },

  onQualityChange(e: WechatMiniprogram.SliderChange) {
    this.setData({ outputQuality: e.detail.value });
  },

  onCropRatioChange(e: WechatMiniprogram.TouchEvent) {
    const ratio = e.currentTarget.dataset.ratio;
    this.setData({ selectedCropRatio: ratio });
  },

  async onProcessImage() {
    if (!this.data.currentImage) {
      this.showError('请先选择图片');
      return;
    }

    try {
      this.setData({ isLoading: true, loadingText: '处理图片中...' });
      
      let processedImage: ImageInfo;
      
      switch (this.data.currentOption) {
        case 'format':
          processedImage = await this.convertFormat();
          break;
        case 'crop':
          processedImage = await this.cropImage();
          break;
        case 'compress':
          processedImage = await this.compressImage();
          break;
        case 'rename':
          processedImage = await this.renameImage();
          break;
        default:
          throw new Error('未知的处理选项');
      }

      this.setData({ processedImage });
      
      if (this.data.currentImage) {
        await this.saveToHistory(this.data.currentImage, processedImage, this.data.currentOption);
      }
      
      wx.showToast({
        title: '处理完成',
        icon: 'success'
      });

    } catch (error) {
      this.showError('图片处理失败', error);
    } finally {
      this.setData({ isLoading: false });
    }
  },

  async convertFormat(): Promise<ImageInfo> {
    return new Promise((resolve, reject) => {
      if (!this.data.currentImage) {
        reject(new Error('没有选择图片'));
        return;
      }

      const canvasId = 'imageCanvas';
      const ctx = wx.createCanvasContext(canvasId);
      
      const img = this.data.currentImage;
      
      ctx.drawImage(img.path, 0, 0, img.width, img.height);
      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          canvasId,
          width: img.width,
          height: img.height,
          destWidth: img.width,
          destHeight: img.height,
          fileType: this.data.outputFormat as 'jpg' | 'png',
          quality: this.data.outputQuality / 100,
          success: async (res) => {
            const newImageInfo = await this.getImageInfo(res.tempFilePath);
            newImageInfo.name = this.data.outputFileName || newImageInfo.name;
            newImageInfo.format = this.data.outputFormat;
            resolve(newImageInfo);
          },
          fail: reject
        });
      });
    });
  },

  async cropImage(): Promise<ImageInfo> {
    return new Promise((resolve, reject) => {
      if (!this.data.currentImage) {
        reject(new Error('没有选择图片'));
        return;
      }

      const img = this.data.currentImage;
      const selectedRatio = this.data.cropRatios.find(r => r.id === this.data.selectedCropRatio);
      
      if (!selectedRatio) {
        reject(new Error('未选择裁剪比例'));
        return;
      }

      let cropWidth = img.width;
      let cropHeight = img.height;
      let cropX = 0;
      let cropY = 0;

      if (selectedRatio.ratio > 0) {
        const imgRatio = img.width / img.height;
        
        if (imgRatio > selectedRatio.ratio) {
          cropWidth = img.height * selectedRatio.ratio;
          cropHeight = img.height;
          cropX = (img.width - cropWidth) / 2;
        } else {
          cropWidth = img.width;
          cropHeight = img.width / selectedRatio.ratio;
          cropY = (img.height - cropHeight) / 2;
        }
      }

      const canvasId = 'imageCanvas';
      const ctx = wx.createCanvasContext(canvasId);
      
      ctx.drawImage(img.path, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          canvasId,
          x: 0,
          y: 0,
          width: cropWidth,
          height: cropHeight,
          destWidth: cropWidth,
          destHeight: cropHeight,
          fileType: this.data.outputFormat as 'jpg' | 'png',
          quality: this.data.outputQuality / 100,
          success: async (res) => {
            const newImageInfo = await this.getImageInfo(res.tempFilePath);
            newImageInfo.name = this.data.outputFileName || newImageInfo.name;
            resolve(newImageInfo);
          },
          fail: reject
        });
      });
    });
  },

  async compressImage(): Promise<ImageInfo> {
    return new Promise((resolve, reject) => {
      if (!this.data.currentImage) {
        reject(new Error('没有选择图片'));
        return;
      }

      const img = this.data.currentImage;
      const canvasId = 'imageCanvas';
      const ctx = wx.createCanvasContext(canvasId);
      
      ctx.drawImage(img.path, 0, 0, img.width, img.height);
      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          canvasId,
          width: img.width,
          height: img.height,
          destWidth: img.width,
          destHeight: img.height,
          fileType: 'jpg',
          quality: this.data.outputQuality / 100,
          success: async (res) => {
            const newImageInfo = await this.getImageInfo(res.tempFilePath);
            newImageInfo.name = this.data.outputFileName || newImageInfo.name;
            resolve(newImageInfo);
          },
          fail: reject
        });
      });
    });
  },

  async renameImage(): Promise<ImageInfo> {
    if (!this.data.currentImage) {
      throw new Error('没有选择图片');
    }

    const newImageInfo = { ...this.data.currentImage };
    newImageInfo.name = this.data.outputFileName || newImageInfo.name;
    newImageInfo.id = Date.now().toString();
    return newImageInfo;
  },

  async onSaveToAlbum() {
    if (!this.data.processedImage) {
      this.showError('没有处理后的图片可保存');
      return;
    }

    try {
      await wx.saveImageToPhotosAlbum({
        filePath: this.data.processedImage.path
      });
      
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });

      this.addSimpleHistory('保存到相册', {
        imageName: this.data.processedImage.name,
        success: true
      });

    } catch (error) {
      this.showError('保存失败', error);
    }
  },

  onResetImage() {
    this.setData({
      currentImage: null,
      processedImage: null,
      outputFileName: ''
    });
  },

  async saveToHistory(originalImage: ImageInfo, processedImage: ImageInfo, operation: string) {
    const timestamp = Date.now();
    const historyItem: ProcessHistory = {
      id: timestamp.toString(),
      originalImage,
      processedImage,
      operation,
      parameters: {
        outputFormat: this.data.outputFormat,
        outputQuality: this.data.outputQuality,
        selectedCropRatio: this.data.selectedCropRatio,
        outputFileName: this.data.outputFileName
      },
      time: formatTime(timestamp),
      timestamp
    };

    const history = [...this.data.history];
    history.unshift(historyItem);
    
    this.setData({
      history: history.slice(0, 20) // 保留最近20条记录
    });

    try {
      StorageService.set('image_converter_history', history);
    } catch (error) {
      LoggerService.error('保存历史记录失败:', error);
    }
  },

  async loadHistory() {
    try {
      const history = StorageService.get('image_converter_history') || [];
      this.setData({ history });
    } catch (error) {
      LoggerService.error('加载历史记录失败:', error);
    }
  },

  onClearHistory() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ 
            history: [],
            simpleHistory: []
          });
          StorageService.remove('image_converter_history');
          wx.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }
    });
  },

  cleanupTempFiles() {
    // 清理临时文件的逻辑（如果需要）
    LoggerService.info('Cleaning up temp files');
  },

  async checkFavoriteStatus() {
    try {
      const isFavorite = await dataManager.isFavorite('image-converter');
      this.setData({ isFavorite });
    } catch (error) {
      LoggerService.error('检查收藏状态失败:', error);
    }
  },

  async onToggleFavorite() {
    try {
      const result = await dataManager.toggleFavorite('image-converter');
      
      if (result.success) {
        this.setData({ isFavorite: result.isFavorite });
        wx.showToast({
          title: result.isFavorite ? '已添加到收藏' : '已取消收藏',
          icon: 'success'
        });
      } else {
        this.showError(result.message || '操作失败');
      }
    } catch (error) {
      this.showError('操作失败', error);
    }
  },

  addSimpleHistory(operation: string, details: any) {
    const timestamp = Date.now();
    const historyItem: SimpleHistory = {
      id: timestamp.toString(),
      operation,
      timestamp,
      time: formatTime(timestamp),
      details,
      success: true
    };

    const simpleHistory = [...this.data.simpleHistory];
    simpleHistory.unshift(historyItem);
    
    this.setData({
      simpleHistory: simpleHistory.slice(0, 50)
    });
  },

  showError(message: string, error?: any) {
    console.error('图片转换错误:', message, error);
    
    let errorDetail = '';
    if (error) {
      if (error instanceof Error) {
        errorDetail = error.message;
      } else if (typeof error === 'string') {
        errorDetail = error;
      } else {
        errorDetail = JSON.stringify(error);
      }
    }
    
    wx.showToast({
      title: message,
      icon: 'error',
      duration: 3000
    });

    this.addSimpleHistory('错误', { message, error: errorDetail });
  },

  async saveHistoryToStorage() {
    try {
      await dataManager.addUsageRecord({
        toolId: 'image-converter',
        toolName: '图片转换',
        category: '图片处理',
        data: {
          processHistory: this.data.history.slice(0, 10)
        }
      });
    } catch (error) {
      LoggerService.error('保存历史记录失败:', error);
    }
  }
}); 