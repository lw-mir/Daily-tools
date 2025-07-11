/// <reference path="../../../../typings/index.d.ts" />

import { dataManager } from '../../../utils/dataManager'

// 餐饮选项数据接口
interface FoodOption {
  id: number;
  name: string;
  emoji: string;
  type: string;
  description: string;
  color: string;
  rotation: number;
  isCustom?: boolean; // 新增：标识是否为自定义选项
}

// 历史记录接口
interface HistoryRecord {
  id: number;
  name: string;
  emoji: string;
  description: string;
  timestamp: number;
  timeString: string;
}

// 自定义选项表单数据接口
interface CustomOptionForm {
  name: string;
  emoji: string;
  type: string;
  description: string;
}

// 页面数据接口
interface PageData {
  foodOptions: FoodOption[];
  wheelRotation: number;
  isSpinning: boolean;
  lastResult: FoodOption | null;
  showHistoryModal: boolean;
  historyList: HistoryRecord[];
  showCustomModal: boolean; // 新增：自定义选项弹窗
  showEditModal: boolean; // 新增：编辑选项弹窗
  customForm: CustomOptionForm; // 新增：自定义表单数据
  editingOption: FoodOption | null; // 新增：正在编辑的选项
  showManageModal: boolean; // 新增：管理选项弹窗
  isFavorite: boolean;
}

(Page as any)({
  data: {
    foodOptions: [],
    wheelRotation: -90, // 初始旋转-90度，让第一个选项在12点钟位置
    isSpinning: false,
    lastResult: null,
    showHistoryModal: false,
    historyList: [],
    showCustomModal: false,
    showEditModal: false,
    customForm: {
      name: '',
      emoji: '',
      type: '',
      description: ''
    },
    editingOption: null,
    showManageModal: false,
    isFavorite: false
  },

  async onLoad() {
    console.log('吃什么？转盘工具页面加载');
    this.initFoodOptions();
    this.loadHistory();
    await this.checkFavoriteStatus();
    await dataManager.addUsageRecord({
      toolId: 'foodwheel',
      toolName: '吃什么转盘',
      category: 'entertainment'
    });
  },

  onShow() {
    // 页面显示时记录使用历史
    this.recordUsage();
  },

  /**
   * 初始化餐饮选项数据
   */
  initFoodOptions() {
    try {
      // 先尝试加载自定义选项
      const customOptions = this.loadCustomOptions();
      if (customOptions && customOptions.length > 0) {
        this.updateWheelRotations(customOptions);
        this.setData({
          foodOptions: customOptions
        });
        return;
      }

      // 如果没有自定义选项，使用默认选项
      this.loadDefaultOptions();
    } catch (error) {
      console.error('初始化餐饮选项失败:', error);
      this.loadDefaultOptions(); // 失败时使用默认选项
    }
  },

  /**
   * 加载默认餐饮选项
   */
  loadDefaultOptions() {
    const defaultFoods: Omit<FoodOption, 'rotation' | 'color' | 'isCustom'>[] = [
      { id: 1, name: '川菜', emoji: '🌶️', type: '中式', description: '麻辣鲜香的川菜，让味蕾燃烧起来！' },
      { id: 2, name: '粤菜', emoji: '🦐', type: '中式', description: '清淡鲜美的粤菜，营养丰富又健康。' },
      { id: 3, name: '火锅', emoji: '🍲', type: '中式', description: '热腾腾的火锅，和朋友一起享受美好时光。' },
      { id: 4, name: '烧烤', emoji: '🍖', type: '烧烤', description: '香气四溢的烧烤，夜宵的绝佳选择。' },
      { id: 5, name: '日料', emoji: '🍣', type: '日式', description: '精致的日本料理，体验异国风味。' },
      { id: 6, name: '韩料', emoji: '🥘', type: '韩式', description: '韩式料理，泡菜和烤肉的完美组合。' },
      { id: 7, name: '西餐', emoji: '🥩', type: '西式', description: '优雅的西式料理，享受精致用餐体验。' },
      { id: 8, name: '意面', emoji: '🍝', type: '西式', description: '浓郁的意大利面，简单却美味。' },
      { id: 9, name: '披萨', emoji: '🍕', type: '西式', description: '热乎乎的披萨，分享快乐的美食。' },
      { id: 10, name: '汉堡', emoji: '🍔', type: '快餐', description: '经典的汉堡，快餐中的永恒选择。' },
      { id: 11, name: '面条', emoji: '🍜', type: '中式', description: '一碗热气腾腾的面条，温暖又饱腹。' },
      { id: 12, name: '饺子', emoji: '🥟', type: '中式', description: '传统的饺子，家的味道。' }
    ];

    // 生成颜色和旋转角度
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8C471', '#82E0AA'
    ];

    const segmentAngle = 360 / defaultFoods.length;
    
    const foodOptions: FoodOption[] = defaultFoods.map((food, index) => ({
      ...food,
      color: colors[index % colors.length],
      // 从12点钟方向开始，第一个选项在12点钟位置（-90度补偿CSS旋转）
      // 每个选项按顺序顺时针分布
      rotation: index * segmentAngle,
      isCustom: false
    }));

    this.setData({
      foodOptions
    });
  },

  /**
   * 更新转盘旋转角度
   */
  updateWheelRotations(options: FoodOption[]) {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#F8C471'
    ];

    const segmentAngle = 360 / options.length;
    
    console.log('=== 更新转盘角度分布 ===');
    console.log('选项总数:', options.length);
    console.log('每个扇形角度:', segmentAngle.toFixed(1), '度');
    
    options.forEach((option, index) => {
      // 从12点钟方向开始，第一个选项在12点钟位置
      // 每个选项按顺序顺时针分布
      option.rotation = index * segmentAngle;
      if (!option.color) {
        option.color = colors[index % colors.length];
      }
      
      console.log(`选项${index + 1}: ${option.name} ${option.emoji} - 角度: ${option.rotation.toFixed(1)}° - 颜色: ${option.color}`);
    });
    
    console.log('=====================');
  },

  /**
   * 加载自定义选项
   */
  loadCustomOptions(): FoodOption[] | null {
    try {
      const customOptions = wx.getStorageSync('foodwheel_custom_options');
      return customOptions || null;
    } catch (error) {
      console.error('加载自定义选项失败:', error);
      return null;
    }
  },

  /**
   * 保存自定义选项
   */
  saveCustomOptions(options: FoodOption[]) {
    try {
      wx.setStorageSync('foodwheel_custom_options', options);
    } catch (error) {
      console.error('保存自定义选项失败:', error);
      wx.showToast({
        title: '保存失败',
        icon: 'error'
      });
    }
  },

  /**
   * 转动转盘
   */
  spinWheel() {
    if (this.data.isSpinning) {
      return;
    }

    const { foodOptions } = this.data;
    if (!foodOptions || foodOptions.length === 0) {
      wx.showToast({
        title: '暂无餐饮选项',
        icon: 'none'
      });
      return;
    }

    console.log('开始转动转盘');
    
    this.setData({
      isSpinning: true,
      lastResult: null
    });

    // 计算随机停止位置
    const { finalRotation, selectedFood } = this.calculateSpinResult();
    
    // 执行转盘动画
    this.setData({
      wheelRotation: finalRotation
    });

    // 添加震动反馈
    wx.vibrateShort({
      type: 'medium'
    }).catch(err => {
      console.log('震动反馈失败:', err);
    });

    // 动画完成后显示结果
    setTimeout(() => {
      this.setData({
        isSpinning: false,
        lastResult: selectedFood
      });

      // 保存到历史记录
      this.saveToHistory(selectedFood);
      
      console.log('转盘停止，选中:', selectedFood.name);
    }, 3000); // 3秒动画时间
  },

  /**
   * 计算转盘停止结果
   */
  calculateSpinResult() {
    const foodOptions = this.data.foodOptions;
    const segmentAngle = 360 / foodOptions.length;
    
    // 生成随机旋转圈数（3-6圈）和最终角度
    const baseRotations = Math.floor(Math.random() * 4) + 3; // 3-6圈
    const randomAngle = Math.random() * 360;
    const totalRotation = this.data.wheelRotation + baseRotations * 360 + randomAngle;
    
    // 计算转盘最终停止的角度，考虑初始-90度偏移
    const finalAngle = (totalRotation + 90) % 360; // 加90度补偿初始偏移
    
    // 指针固定在12点钟方向
    // 转盘从12点钟方向开始，第一个选项在12点钟位置
    // 计算指针相对于转盘的位置
    const pointerRelativeAngle = (360 - finalAngle) % 360;
    
    // 计算指针指向哪个扇形区域
    const selectedIndex = Math.floor(pointerRelativeAngle / segmentAngle);
    
    // 确保索引在有效范围内
    const validIndex = selectedIndex >= foodOptions.length ? 0 : selectedIndex;
    const selectedFood = foodOptions[validIndex];
    
    // 详细调试信息
    console.log('=== 转盘计算详情（12点钟起始）===');
    console.log('总旋转角度:', totalRotation);
    console.log('最终停止角度（补偿后）:', finalAngle);
    console.log('指针相对转盘角度:', pointerRelativeAngle);
    console.log('扇形角度:', segmentAngle);
    console.log('选中索引:', validIndex);
    console.log('选中食物:', selectedFood.name, selectedFood.emoji);
    console.log('');
    
    // 打印扇形区域分布（从12点钟开始顺时针）
    console.log('扇形区域分布（从12点钟开始顺时针）:');
    foodOptions.forEach((food: FoodOption, index: number) => {
      const startAngle = index * segmentAngle;
      const endAngle = (index + 1) * segmentAngle;
      const isSelected = index === validIndex;
      console.log(`索引${index}: ${food.name} ${food.emoji} - 角度范围: ${startAngle.toFixed(1)}°-${endAngle.toFixed(1)}° ${isSelected ? '← 选中' : ''}`);
    });
    console.log('指针相对角度:', pointerRelativeAngle.toFixed(1), '°');
    console.log('==================');
    
    return {
      finalRotation: totalRotation,
      selectedFood
    };
  },

  /**
   * 保存结果到历史记录
   */
  saveToHistory(food: FoodOption) {
    try {
      const now = new Date();
      const timeString = `${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const historyRecord: HistoryRecord = {
        id: Date.now(),
        name: food.name,
        emoji: food.emoji,
        description: food.description,
        timestamp: now.getTime(),
        timeString
      };

      const historyList = [historyRecord, ...this.data.historyList];
      
      // 只保留最近50条记录
      if (historyList.length > 50) {
        historyList.splice(50);
      }

      this.setData({
        historyList
      });

      // 保存到本地存储
      wx.setStorageSync('foodwheel_history', historyList);
    } catch (error) {
      console.error('保存历史记录失败:', error);
    }
  },

  /**
   * 加载历史记录
   */
  loadHistory() {
    try {
      const historyList = wx.getStorageSync('foodwheel_history') || [];
      this.setData({
        historyList
      });
    } catch (error) {
      console.error('加载历史记录失败:', error);
    }
  },

  /**
   * 显示历史记录弹窗
   */
  showHistory() {
    this.setData({
      showHistoryModal: true
    });
  },

  /**
   * 隐藏历史记录弹窗
   */
  hideHistory() {
    this.setData({
      showHistoryModal: false
    });
  },

  /**
   * 阻止事件冒泡
   */
  stopPropagation() {
    // 阻止点击弹窗内容时关闭弹窗
  },

  /**
   * 显示自定义选项管理
   */
  customizeOptions() {
    this.setData({
      showManageModal: true
    });
  },

  /**
   * 隐藏管理弹窗
   */
  hideManageModal() {
    this.setData({
      showManageModal: false
    });
  },

  /**
   * 显示添加自定义选项弹窗
   */
  showAddCustom() {
    this.setData({
      showCustomModal: true,
      // 确保表单为空状态
      customForm: {
        name: '',
        emoji: '',
        type: '',
        description: ''
      }
    });
  },

  /**
   * 隐藏自定义选项弹窗
   */
  hideCustomModal() {
    this.setData({
      showCustomModal: false,
      // 取消时清空表单数据
      customForm: {
        name: '',
        emoji: '',
        type: '',
        description: ''
      }
    });
  },

  /**
   * 表单输入处理
   */
  onFormInput(e: any) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    
    if (field) {
      this.setData({
        [`customForm.${field}`]: value
      });
    }
  },

  /**
   * 添加自定义选项
   */
  addCustomOption() {
    const { name, emoji, type, description } = this.data.customForm;
    
    if (!name.trim()) {
      wx.showToast({
        title: '请输入餐饮名称',
        icon: 'none'
      });
      return;
    }

    if (!emoji.trim()) {
      wx.showToast({
        title: '请输入表情符号',
        icon: 'none'
      });
      return;
    }

    // 检查是否已存在相同名称的选项
    const existingOption = this.data.foodOptions.find((option: any) => 
      option.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    
    if (existingOption) {
      wx.showToast({
        title: '该餐饮选项已存在',
        icon: 'none'
      });
      return;
    }

    const newOption: FoodOption = {
      id: Date.now(),
      name: name.trim(),
      emoji: emoji.trim(),
      type: type.trim() || '自定义',
      description: description.trim() || `美味的${name.trim()}`,
      color: '',
      rotation: 0,
      isCustom: true
    };

    // 将新选项添加到数组末尾，保持添加顺序
    const foodOptions = [...this.data.foodOptions, newOption];
    
    // 重新计算所有选项的转盘位置，确保按顺序均等分布
    this.updateWheelRotations(foodOptions);
    
    this.setData({
      foodOptions,
      showCustomModal: false,
      // 清空表单
      customForm: {
        name: '',
        emoji: '',
        type: '',
        description: ''
      }
    });

    // 保存自定义选项到本地存储
    this.saveCustomOptions(foodOptions);

    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });

    console.log('添加自定义选项成功:', newOption.name, '当前选项总数:', foodOptions.length);
  },

  /**
   * 显示编辑选项弹窗
   */
  showEditOption(e: any) {
    const { option } = e.currentTarget.dataset;
    if (option) {
      this.setData({
        showEditModal: true,
        editingOption: option,
        customForm: {
          name: option.name,
          emoji: option.emoji,
          type: option.type,
          description: option.description
        }
      });
    }
  },

  /**
   * 隐藏编辑弹窗
   */
  hideEditModal() {
    this.setData({
      showEditModal: false,
      editingOption: null,
      // 取消编辑时清空表单数据
      customForm: {
        name: '',
        emoji: '',
        type: '',
        description: ''
      }
    });
  },

  /**
   * 保存编辑
   */
  saveEdit() {
    const { name, emoji, type, description } = this.data.customForm;
    const editingOption = this.data.editingOption;
    
    if (!editingOption) return;
    
    if (!name.trim()) {
      wx.showToast({
        title: '请输入餐饮名称',
        icon: 'none'
      });
      return;
    }

    if (!emoji.trim()) {
      wx.showToast({
        title: '请输入表情符号',
        icon: 'none'
      });
      return;
    }

    // 检查是否与其他选项重名
    const existingOption = this.data.foodOptions.find((option: any) => 
      option.id !== editingOption.id && 
      option.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    
    if (existingOption) {
      wx.showToast({
        title: '该餐饮选项已存在',
        icon: 'none'
      });
      return;
    }

    const foodOptions = this.data.foodOptions.map((option: any) => {
      if (option.id === editingOption.id) {
        return {
          ...option,
          name: name.trim(),
          emoji: emoji.trim(),
          type: type.trim() || '自定义',
          description: description.trim() || `美味的${name.trim()}`
        };
      }
      return option;
    });

    // 编辑不会改变选项数量，但需要确保转盘角度分布正确
    this.updateWheelRotations(foodOptions);

    this.setData({
      foodOptions,
      showEditModal: false,
      editingOption: null,
      // 清空表单
      customForm: {
        name: '',
        emoji: '',
        type: '',
        description: ''
      }
    });

    // 保存更新后的选项到本地存储
    this.saveCustomOptions(foodOptions);

    wx.showToast({
      title: '修改成功',
      icon: 'success'
    });

    console.log('编辑选项成功:', name.trim());
  },

  /**
   * 删除选项
   */
  deleteOption(e: any) {
    const { option } = e.currentTarget.dataset;
    
    if (!option) return;
    
    wx.showModal({
      title: '确认删除',
      content: `确定要删除"${option.name}"吗？`,
      success: (res) => {
        if (res.confirm) {
          const foodOptions = this.data.foodOptions.filter((item: any) => item.id !== option.id);
          
          if (foodOptions.length === 0) {
            wx.showToast({
              title: '至少保留一个选项',
              icon: 'none'
            });
            return;
          }

          // 重新计算剩余选项的转盘位置，确保均等分布
          this.updateWheelRotations(foodOptions);
          
          this.setData({
            foodOptions
          });

          // 保存更新后的选项到本地存储
          this.saveCustomOptions(foodOptions);

          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });

          console.log('删除选项成功:', option.name, '剩余选项数:', foodOptions.length);
        }
      }
    });
  },

  /**
   * 重置为默认选项
   */
  resetToDefault() {
    wx.showModal({
      title: '重置确认',
      content: '确定要重置为默认选项吗？这将清除所有自定义内容。',
      success: (res) => {
        if (res.confirm) {
          try {
            // 清除自定义选项
            wx.removeStorageSync('foodwheel_custom_options');
            
            // 重新加载默认选项
            this.loadDefaultOptions();
            
            this.setData({
              showManageModal: false
            });

            wx.showToast({
              title: '重置成功',
              icon: 'success'
            });
          } catch (error) {
            console.error('重置失败:', error);
            wx.showToast({
              title: '重置失败',
              icon: 'error'
            });
          }
        }
      }
    });
  },

  /**
   * 记录工具使用情况
   */
  recordUsage() {
    try {
      // 获取数据管理器
      const app = getApp() as any;
      const dataManager = app.globalData && app.globalData.dataManager;
      if (dataManager && typeof dataManager.recordToolUsage === 'function') {
        dataManager.recordToolUsage('foodwheel', '吃什么转盘');
      }
    } catch (error) {
      console.error('记录使用情况失败:', error);
    }
  },

  /**
   * 页面分享
   */
  onShareAppMessage() {
    return {
      title: '吃什么？让转盘帮你决定！',
      path: '/pages/tools/foodwheel/foodwheel',
      imageUrl: '' // 可以设置分享图片
    };
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: '吃什么？让转盘帮你决定今天的美食！',
      imageUrl: '' // 可以设置分享图片
    };
  },

  /**
   * 检查收藏状态
   */
  async checkFavoriteStatus() {
    try {
      const isFavorite = await dataManager.isFavorite('foodwheel')
      this.setData({ isFavorite })
    } catch (error) {
      console.error('[FoodWheel] 检查收藏状态失败:', error)
    }
  },

  /**
   * 切换收藏状态
   */
  async onToggleFavorite() {
    try {
      const result = await dataManager.toggleFavorite('foodwheel')
      
      if (result.success) {
        this.setData({ isFavorite: result.isFavorite })
        
        wx.showToast({
          title: result.isFavorite ? '已添加到收藏' : '已取消收藏',
          icon: 'success',
          duration: 1500
        })
      } else {
        wx.showToast({
          title: result.message || '操作失败',
          icon: 'error'
        })
      }
    } catch (error) {
      console.error('[FoodWheel] 切换收藏失败:', error)
      wx.showToast({
        title: '操作失败',
        icon: 'error'
      })
    }
  }
}); 