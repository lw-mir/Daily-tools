import { StorageService } from '../../../utils/storage';
import { LoggerService } from '../../../utils/logger';
import { formatTime } from '../../../utils/index';
import { dataManager } from '../../../utils/dataManager';

interface CalculatorHistory {
  id: string;
  expression: string;
  result: string;
  time: string;
  timestamp: number;
}

interface CalculatorData {
  expression: string;
  result: string;
  mode: 'basic' | 'scientific';
  showHistory: boolean;
  history: CalculatorHistory[];
  isLoading: boolean;
  loadingText: string;
  lastOperator: string;
  shouldResetDisplay: boolean;
  isResultDisplayed: boolean;
}

Page({
  data: {
    expression: '',
    result: '0',
    mode: 'basic',
    showHistory: false,
    history: [],
    isLoading: false,
    loadingText: '计算中...',
    lastOperator: '',
    shouldResetDisplay: false,
    isResultDisplayed: false
  } as CalculatorData,

  async onLoad() {
    LoggerService.info('Calculator page loaded');
    await this.loadHistory();
    
    // 添加到最近使用工具
    try {
      await dataManager.addRecentTool('calculator');
      
      // 记录使用历史
      await dataManager.addUsageRecord({
        toolId: 'calculator',
        toolName: '计算器',
        category: '工具'
      });
    } catch (error) {
      LoggerService.error('Failed to record tool usage:', error);
    }
  },

  onShow() {
    // 恢复上次的计算状态
    const lastState = StorageService.get('calculator_state');
    if (lastState) {
      this.setData({
        expression: lastState.expression || '',
        result: lastState.result || '0',
        mode: lastState.mode || 'basic'
      });
    }
  },

  onHide() {
    // 保存当前计算状态
    StorageService.set('calculator_state', {
      expression: this.data.expression,
      result: this.data.result,
      mode: this.data.mode
    });
  },

  onUnload() {
    LoggerService.info('Calculator page unloaded');
  },

  // 按键点击处理
  onKeyTap(e: WechatMiniprogram.TouchEvent) {
    const key = e.currentTarget.dataset.key as string;
    LoggerService.debug('Key tapped:', key);

    switch (key) {
      case 'clear':
        this.clearAll();
        break;
      case 'backspace':
        this.backspace();
        break;
      case '=':
        this.calculate();
        break;
      case '+':
      case '-':
      case '*':
      case '/':
      case '%':
        this.inputOperator(key);
        break;
      case '.':
        this.inputDecimal();
        break;
      case '(':
      case ')':
        this.inputParenthesis(key);
        break;
      case 'sin':
      case 'cos':
      case 'tan':
      case 'ln':
      case 'log':
      case 'sqrt':
      case 'exp':
        this.inputFunction(key);
        break;
      case 'pow':
        this.inputOperator('^');
        break;
      case '1/x':
        this.inputFunction('reciprocal');
        break;
      case 'x!':
        this.inputFunction('factorial');
        break;
      case 'pi':
        this.inputConstant('π');
        break;
      case 'e':
        this.inputConstant('e');
        break;
      default:
        if (/^\d$/.test(key)) {
          this.inputNumber(key);
        }
        break;
    }
  },

  // 输入数字
  inputNumber(num: string) {
    let { expression, result, shouldResetDisplay, isResultDisplayed } = this.data;

    if (shouldResetDisplay || isResultDisplayed) {
      expression = '';
      result = num;
      this.setData({
        expression,
        result,
        shouldResetDisplay: false,
        isResultDisplayed: false
      });
    } else {
      if (result === '0') {
        result = num;
      } else {
        result += num;
      }
      this.setData({ result });
    }
  },

  // 输入运算符
  inputOperator(operator: string) {
    let { expression, result, lastOperator } = this.data;

    // 如果上一个字符是运算符，替换它
    if (lastOperator && expression.endsWith(lastOperator)) {
      expression = expression.slice(0, -1) + this.formatOperator(operator);
    } else {
      expression += result + this.formatOperator(operator);
    }

    this.setData({
      expression,
      result: '0',
      lastOperator: operator,
      shouldResetDisplay: true,
      isResultDisplayed: false
    });
  },

  // 输入小数点
  inputDecimal() {
    let { result } = this.data;
    
    if (!result.includes('.')) {
      result += '.';
      this.setData({ result });
    }
  },

  // 输入括号
  inputParenthesis(parenthesis: string) {
    let { expression, result } = this.data;
    
    if (parenthesis === '(') {
      expression += '(';
    } else {
      expression += result + ')';
    }

    this.setData({
      expression,
      result: '0',
      shouldResetDisplay: true
    });
  },

  // 输入科学函数
  inputFunction(func: string) {
    let { expression, result } = this.data;
    
    switch (func) {
      case 'sin':
      case 'cos':
      case 'tan':
      case 'ln':
      case 'log':
      case 'sqrt':
      case 'exp':
        expression += `${func}(${result})`;
        break;
      case 'reciprocal':
        expression += `1/(${result})`;
        break;
      case 'factorial':
        expression += `${result}!`;
        break;
    }

    this.setData({
      expression,
      result: '0',
      shouldResetDisplay: true
    });
  },

  // 输入常量
  inputConstant(constant: string) {
    let { result, shouldResetDisplay } = this.data;

    if (shouldResetDisplay) {
      result = constant;
    } else {
      result = constant;
    }

    this.setData({
      result,
      shouldResetDisplay: false
    });
  },

  // 格式化运算符显示
  formatOperator(operator: string): string {
    const operatorMap: Record<string, string> = {
      '+': ' + ',
      '-': ' - ',
      '*': ' × ',
      '/': ' ÷ ',
      '%': ' % ',
      '^': ' ^ '
    };
    return operatorMap[operator] || ` ${operator} `;
  },

  // 退格
  backspace() {
    let { result } = this.data;
    
    if (result.length > 1) {
      result = result.slice(0, -1);
    } else {
      result = '0';
    }

    this.setData({ result });
  },

  // 清除所有
  clearAll() {
    this.setData({
      expression: '',
      result: '0',
      lastOperator: '',
      shouldResetDisplay: false,
      isResultDisplayed: false
    });
  },

  // 计算结果
  async calculate() {
    const { expression, result } = this.data;
    const fullExpression = expression + result;

    if (!fullExpression.trim()) {
      return;
    }

    try {
      this.setData({ isLoading: true });

      const calculatedResult = this.evaluateExpression(fullExpression);
      const formattedResult = this.formatResult(calculatedResult);

      // 保存到历史记录
      await this.saveToHistory(fullExpression, formattedResult);

      this.setData({
        expression: '',
        result: formattedResult,
        lastOperator: '',
        shouldResetDisplay: false,
        isResultDisplayed: true,
        isLoading: false
      });

      LoggerService.info('Calculation completed:', { expression: fullExpression, result: formattedResult });
    } catch (error) {
      LoggerService.error('Calculation error:', error);
      
      wx.showToast({
        title: '计算错误',
        icon: 'none',
        duration: 2000
      });

      this.setData({
        result: '错误',
        isLoading: false
      });
    }
  },

  // 表达式求值
  evaluateExpression(expression: string): number {
    // 替换显示符号为计算符号
    let evalExpression = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, Math.PI.toString())
      .replace(/e(?![a-z])/g, Math.E.toString());

    // 处理科学函数
    evalExpression = this.processScientificFunctions(evalExpression);

    // 处理阶乘
    evalExpression = this.processFactorial(evalExpression);

    // 使用安全的表达式求值
    return this.safeEval(evalExpression);
  },

  // 处理科学函数
  processScientificFunctions(expression: string): string {
    const functions = ['sin', 'cos', 'tan', 'ln', 'log', 'sqrt', 'exp'];
    
    functions.forEach(func => {
      const regex = new RegExp(`${func}\\(([^)]+)\\)`, 'g');
      expression = expression.replace(regex, (match, arg) => {
        const value = this.safeEval(arg);
        switch (func) {
          case 'sin':
            return Math.sin(this.toRadians(value)).toString();
          case 'cos':
            return Math.cos(this.toRadians(value)).toString();
          case 'tan':
            return Math.tan(this.toRadians(value)).toString();
          case 'ln':
            return Math.log(value).toString();
          case 'log':
            return Math.log10(value).toString();
          case 'sqrt':
            return Math.sqrt(value).toString();
          case 'exp':
            return Math.exp(value).toString();
          default:
            return match;
        }
      });
    });

    return expression;
  },

  // 处理阶乘
  processFactorial(expression: string): string {
    return expression.replace(/(\d+(\.\d+)?)!/g, (_match, num) => {
      const n = parseInt(num);
      if (n < 0 || !Number.isInteger(n)) {
        throw new Error('阶乘只能计算非负整数');
      }
      if (n > 170) {
        throw new Error('数字太大，无法计算阶乘');
      }
      return this.factorial(n).toString();
    });
  },

  // 计算阶乘
  factorial(n: number): number {
    if (n <= 1) return 1;
    return n * this.factorial(n - 1);
  },

  // 角度转弧度
  toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
  },

  // 安全的表达式求值
  safeEval(expression: string): number {
    // 简单的表达式求值，避免使用eval
    // 这里使用Function构造器作为替代方案
    try {
      // 验证表达式只包含安全字符
      if (!/^[0-9+\-*/.() \t\n\r]+$/.test(expression)) {
        throw new Error('无效的表达式');
      }
      
      return Function('"use strict"; return (' + expression + ')')();
    } catch (error) {
      throw new Error('计算错误');
    }
  },

  // 格式化结果
  formatResult(result: number): string {
    if (!isFinite(result)) {
      return '无穷大';
    }
    
    if (isNaN(result)) {
      return '未定义';
    }

    // 处理小数精度
    const precision = 10;
    const rounded = Math.round(result * Math.pow(10, precision)) / Math.pow(10, precision);
    
    // 如果是整数，直接返回
    if (Number.isInteger(rounded)) {
      return rounded.toString();
    }
    
    // 移除末尾的0
    return rounded.toString().replace(/\.?0+$/, '');
  },

  // 保存到历史记录
  async saveToHistory(expression: string, result: string) {
    const history = [...this.data.history];
    const now = new Date();
    
    const historyItem: CalculatorHistory = {
      id: Date.now().toString(),
      expression,
      result,
      time: formatTime(now.getTime(), 'HH:mm:ss'),
      timestamp: now.getTime()
    };

    history.unshift(historyItem);
    
    // 限制历史记录数量
    if (history.length > 100) {
      history.splice(100);
    }

    this.setData({ history });
    
    try {
      // 保存到数据管理器
      await dataManager.setCacheData('calculator_history', history);
      
      // 同时记录计算操作
      await dataManager.addUsageRecord({
        toolId: 'calculator',
        toolName: '计算器',
        category: '工具',
        data: { expression, result }
      });
    } catch (error) {
      LoggerService.error('Failed to save calculator history:', error);
    }
  },

  // 加载历史记录
  async loadHistory() {
    try {
      const history = await dataManager.getCacheData('calculator_history') || [];
      this.setData({ history });
    } catch (error) {
      LoggerService.error('Failed to load calculator history:', error);
      // 回退到本地存储
      const history = StorageService.get('calculator_history') || [];
      this.setData({ history });
    }
  },

  // 切换模式
  onSwitchMode(e: WechatMiniprogram.TouchEvent) {
    const mode = e.currentTarget.dataset.mode as 'basic' | 'scientific';
    this.setData({ mode });
    LoggerService.info('Calculator mode switched to:', mode);
  },

  // 显示历史记录
  onShowHistory() {
    this.setData({ showHistory: true });
  },

  // 隐藏历史记录
  onHideHistory() {
    this.setData({ showHistory: false });
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 空函数，用于阻止事件冒泡
  },

  // 选择历史记录
  onSelectHistory(e: WechatMiniprogram.TouchEvent) {
    const item = e.currentTarget.dataset.item as CalculatorHistory;
    this.setData({
      expression: '',
      result: item.result,
      showHistory: false,
      isResultDisplayed: true
    });
    
    wx.showToast({
      title: '已选择历史结果',
      icon: 'success',
      duration: 1500
    });
  },

  // 清空历史记录
  onClearHistory() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有计算历史吗？',
      success: async (res) => {
        if (res.confirm) {
          this.setData({ history: [] });
          
          try {
            await dataManager.setCacheData('calculator_history', []);
          } catch (error) {
            LoggerService.error('Failed to clear calculator history:', error);
          }
          
          wx.showToast({
            title: '历史记录已清空',
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  },

  // 复制结果
  onCopyResult() {
    const { result } = this.data;
    
    wx.setClipboardData({
      data: result,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success',
          duration: 1500
        });
        LoggerService.info('Result copied to clipboard:', result);
      },
      fail: (error) => {
        LoggerService.error('Failed to copy result:', error);
        wx.showToast({
          title: '复制失败',
          icon: 'none',
          duration: 1500
        });
      }
    });
  }
}); 