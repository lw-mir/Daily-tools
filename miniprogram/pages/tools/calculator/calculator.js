"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var storage_1 = require("../../../utils/storage");
var logger_1 = require("../../../utils/logger");
var index_1 = require("../../../utils/index");
var dataManager_1 = require("../../../utils/dataManager");
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
        isResultDisplayed: false,
        isFavorite: false
    },
    onLoad: function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.LoggerService.info('Calculator page loaded');
                        return [4 /*yield*/, this.loadHistory()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, dataManager_1.dataManager.addRecentTool('calculator')];
                    case 3:
                        _a.sent();
                        // 记录使用历史
                        return [4 /*yield*/, dataManager_1.dataManager.addUsageRecord({
                                toolId: 'calculator',
                                toolName: '计算器',
                                category: '工具'
                            })];
                    case 4:
                        // 记录使用历史
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        logger_1.LoggerService.error('Failed to record tool usage:', error_1);
                        return [3 /*break*/, 6];
                    case 6: 
                    // 检查收藏状态
                    return [4 /*yield*/, this.checkFavoriteStatus()];
                    case 7:
                        // 检查收藏状态
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    onShow: function () {
        // 恢复上次的计算状态
        var lastState = storage_1.StorageService.get('calculator_state');
        if (lastState) {
            this.setData({
                expression: lastState.expression || '',
                result: lastState.result || '0',
                mode: lastState.mode || 'basic'
            });
        }
    },
    onHide: function () {
        // 保存当前计算状态
        storage_1.StorageService.set('calculator_state', {
            expression: this.data.expression,
            result: this.data.result,
            mode: this.data.mode
        });
    },
    onUnload: function () {
        logger_1.LoggerService.info('Calculator page unloaded');
    },
    // 按键点击处理
    onKeyTap: function (e) {
        var key = e.currentTarget.dataset.key;
        logger_1.LoggerService.debug('Key tapped:', key);
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
    inputNumber: function (num) {
        var _a = this.data, expression = _a.expression, result = _a.result, shouldResetDisplay = _a.shouldResetDisplay, isResultDisplayed = _a.isResultDisplayed;
        if (shouldResetDisplay || isResultDisplayed) {
            expression = '';
            result = num;
            this.setData({
                expression: expression,
                result: result,
                shouldResetDisplay: false,
                isResultDisplayed: false
            });
        }
        else {
            if (result === '0') {
                result = num;
            }
            else {
                result += num;
            }
            this.setData({ result: result });
        }
    },
    // 输入运算符
    inputOperator: function (operator) {
        var _a = this.data, expression = _a.expression, result = _a.result, lastOperator = _a.lastOperator;
        // 如果上一个字符是运算符，替换它
        if (lastOperator && expression.endsWith(lastOperator)) {
            expression = expression.slice(0, -1) + this.formatOperator(operator);
        }
        else {
            expression += result + this.formatOperator(operator);
        }
        this.setData({
            expression: expression,
            result: '0',
            lastOperator: operator,
            shouldResetDisplay: true,
            isResultDisplayed: false
        });
    },
    // 输入小数点
    inputDecimal: function () {
        var result = this.data.result;
        if (!result.includes('.')) {
            result += '.';
            this.setData({ result: result });
        }
    },
    // 输入括号
    inputParenthesis: function (parenthesis) {
        var _a = this.data, expression = _a.expression, result = _a.result;
        if (parenthesis === '(') {
            expression += '(';
        }
        else {
            expression += result + ')';
        }
        this.setData({
            expression: expression,
            result: '0',
            shouldResetDisplay: true
        });
    },
    // 输入科学函数
    inputFunction: function (func) {
        var _a = this.data, expression = _a.expression, result = _a.result;
        switch (func) {
            case 'sin':
            case 'cos':
            case 'tan':
            case 'ln':
            case 'log':
            case 'sqrt':
            case 'exp':
                expression += func + "(" + result + ")";
                break;
            case 'reciprocal':
                expression += "1/(" + result + ")";
                break;
            case 'factorial':
                expression += result + "!";
                break;
        }
        this.setData({
            expression: expression,
            result: '0',
            shouldResetDisplay: true
        });
    },
    // 输入常量
    inputConstant: function (constant) {
        var _a = this.data, result = _a.result, shouldResetDisplay = _a.shouldResetDisplay;
        if (shouldResetDisplay) {
            result = constant;
        }
        else {
            result = constant;
        }
        this.setData({
            result: result,
            shouldResetDisplay: false
        });
    },
    // 格式化运算符显示
    formatOperator: function (operator) {
        var operatorMap = {
            '+': ' + ',
            '-': ' - ',
            '*': ' × ',
            '/': ' ÷ ',
            '%': ' % ',
            '^': ' ^ '
        };
        return operatorMap[operator] || " " + operator + " ";
    },
    // 退格
    backspace: function () {
        var result = this.data.result;
        if (result.length > 1) {
            result = result.slice(0, -1);
        }
        else {
            result = '0';
        }
        this.setData({ result: result });
    },
    // 清除所有
    clearAll: function () {
        this.setData({
            expression: '',
            result: '0',
            lastOperator: '',
            shouldResetDisplay: false,
            isResultDisplayed: false
        });
    },
    // 计算结果
    calculate: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, expression, result, fullExpression, calculatedResult, formattedResult, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.data, expression = _a.expression, result = _a.result;
                        fullExpression = expression + result;
                        if (!fullExpression.trim()) {
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        this.setData({ isLoading: true });
                        calculatedResult = this.evaluateExpression(fullExpression);
                        formattedResult = this.formatResult(calculatedResult);
                        // 保存到历史记录
                        return [4 /*yield*/, this.saveToHistory(fullExpression, formattedResult)];
                    case 2:
                        // 保存到历史记录
                        _b.sent();
                        this.setData({
                            expression: '',
                            result: formattedResult,
                            lastOperator: '',
                            shouldResetDisplay: false,
                            isResultDisplayed: true,
                            isLoading: false
                        });
                        logger_1.LoggerService.info('Calculation completed:', { expression: fullExpression, result: formattedResult });
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _b.sent();
                        logger_1.LoggerService.error('Calculation error:', error_2);
                        wx.showToast({
                            title: '计算错误',
                            icon: 'none',
                            duration: 2000
                        });
                        this.setData({
                            result: '错误',
                            isLoading: false
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    // 表达式求值
    evaluateExpression: function (expression) {
        // 替换显示符号为计算符号
        var evalExpression = expression
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/π/g, Math.PI.toString())
            .replace(/e(?![a-z])/g, Math.E.toString());
        // 处理科学函数
        evalExpression = this.processScientificFunctions(evalExpression);
        // 处理阶乘
        evalExpression = this.processFactorial(evalExpression);
        // 处理百分号
        evalExpression = evalExpression.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
        // 将^替换为指数运算符**
        evalExpression = evalExpression.replace(/\^/g, '**');
        // 使用安全的表达式求值
        return this.safeEval(evalExpression);
    },
    // 处理科学函数
    processScientificFunctions: function (expression) {
        var _this = this;
        var functions = ['sin', 'cos', 'tan', 'ln', 'log', 'sqrt', 'exp'];
        functions.forEach(function (func) {
            var regex = new RegExp(func + "\\(([^)]+)\\)", 'g');
            expression = expression.replace(regex, function (match, arg) {
                var value = _this.safeEval(arg);
                switch (func) {
                    case 'sin':
                        return Math.sin(_this.toRadians(value)).toString();
                    case 'cos':
                        return Math.cos(_this.toRadians(value)).toString();
                    case 'tan':
                        return Math.tan(_this.toRadians(value)).toString();
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
    processFactorial: function (expression) {
        var _this = this;
        return expression.replace(/(\d+(\.\d+)?)!/g, function (_match, num) {
            var n = parseInt(num);
            if (n < 0 || !Number.isInteger(n)) {
                throw new Error('阶乘只能计算非负整数');
            }
            if (n > 170) {
                throw new Error('数字太大，无法计算阶乘');
            }
            return _this.factorial(n).toString();
        });
    },
    // 计算阶乘
    factorial: function (n) {
        if (n <= 1)
            return 1;
        return n * this.factorial(n - 1);
    },
    // 角度转弧度
    toRadians: function (degrees) {
        return degrees * Math.PI / 180;
    },
    // 安全的表达式求值
    safeEval: function (expression) {
        // 简单的表达式求值，避免使用eval
        // 这里使用Function构造器作为替代方案
        try {
            // 验证表达式只包含安全字符
            if (!/^[0-9+\-*/.%^eE() \t\n\r]+$/.test(expression)) {
                throw new Error('无效的表达式');
            }
            return Function('"use strict"; return (' + expression + ')')();
        }
        catch (error) {
            throw new Error('计算错误');
        }
    },
    // 格式化结果
    formatResult: function (result) {
        if (!isFinite(result)) {
            return '无穷大';
        }
        if (isNaN(result)) {
            return '未定义';
        }
        // 处理小数精度
        var precision = 10;
        var rounded = Math.round(result * Math.pow(10, precision)) / Math.pow(10, precision);
        // 如果是整数，直接返回
        if (Number.isInteger(rounded)) {
            return rounded.toString();
        }
        // 移除末尾的0
        return rounded.toString().replace(/\.?0+$/, '');
    },
    // 保存到历史记录
    saveToHistory: function (expression, result) {
        return __awaiter(this, void 0, void 0, function () {
            var history, now, historyItem, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        history = __spreadArrays(this.data.history);
                        now = new Date();
                        historyItem = {
                            id: Date.now().toString(),
                            expression: expression,
                            result: result,
                            time: index_1.formatTime(now.getTime(), 'HH:mm:ss'),
                            timestamp: now.getTime()
                        };
                        history.unshift(historyItem);
                        // 限制历史记录数量
                        if (history.length > 100) {
                            history.splice(100);
                        }
                        this.setData({ history: history });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        // 保存到数据管理器
                        return [4 /*yield*/, dataManager_1.dataManager.setCacheData('calculator_history', history)];
                    case 2:
                        // 保存到数据管理器
                        _a.sent();
                        // 同时记录计算操作
                        return [4 /*yield*/, dataManager_1.dataManager.addUsageRecord({
                                toolId: 'calculator',
                                toolName: '计算器',
                                category: '工具',
                                data: { expression: expression, result: result }
                            })];
                    case 3:
                        // 同时记录计算操作
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        logger_1.LoggerService.error('Failed to save calculator history:', error_3);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    // 加载历史记录
    loadHistory: function () {
        return __awaiter(this, void 0, void 0, function () {
            var history, error_4, history;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, dataManager_1.dataManager.getCacheData('calculator_history')];
                    case 1:
                        history = (_a.sent()) || [];
                        this.setData({ history: history });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        logger_1.LoggerService.error('Failed to load calculator history:', error_4);
                        history = storage_1.StorageService.get('calculator_history') || [];
                        this.setData({ history: history });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // 切换模式
    onSwitchMode: function (e) {
        var mode = e.currentTarget.dataset.mode;
        this.setData({ mode: mode });
        logger_1.LoggerService.info('Calculator mode switched to:', mode);
    },
    // 显示历史记录
    onShowHistory: function () {
        this.setData({ showHistory: true });
    },
    // 隐藏历史记录
    onHideHistory: function () {
        this.setData({ showHistory: false });
    },
    // 阻止事件冒泡
    stopPropagation: function () {
        // 空函数，用于阻止事件冒泡
    },
    // 选择历史记录
    onSelectHistory: function (e) {
        var item = e.currentTarget.dataset.item;
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
    onClearHistory: function () {
        var _this = this;
        wx.showModal({
            title: '确认清空',
            content: '确定要清空所有计算历史吗？',
            success: function (res) { return __awaiter(_this, void 0, void 0, function () {
                var error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!res.confirm) return [3 /*break*/, 5];
                            this.setData({ history: [] });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, dataManager_1.dataManager.setCacheData('calculator_history', [])];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_5 = _a.sent();
                            logger_1.LoggerService.error('Failed to clear calculator history:', error_5);
                            return [3 /*break*/, 4];
                        case 4:
                            wx.showToast({
                                title: '历史记录已清空',
                                icon: 'success',
                                duration: 1500
                            });
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            }); }
        });
    },
    // 复制结果
    onCopyResult: function () {
        var result = this.data.result;
        wx.setClipboardData({
            data: result,
            success: function () {
                wx.showToast({
                    title: '已复制到剪贴板',
                    icon: 'success',
                    duration: 1500
                });
                logger_1.LoggerService.info('Result copied to clipboard:', result);
            },
            fail: function (error) {
                logger_1.LoggerService.error('Failed to copy result:', error);
                wx.showToast({
                    title: '复制失败',
                    icon: 'none',
                    duration: 1500
                });
            }
        });
    },
    /**
     * 检查收藏状态
     */
    checkFavoriteStatus: function () {
        return __awaiter(this, void 0, void 0, function () {
            var isFavorite, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, dataManager_1.dataManager.isFavorite('calculator')];
                    case 1:
                        isFavorite = _a.sent();
                        this.setData({ isFavorite: isFavorite });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.error('[Calculator] 检查收藏状态失败:', error_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 切换收藏状态
     */
    onToggleFavorite: function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, dataManager_1.dataManager.toggleFavorite('calculator')];
                    case 1:
                        result = _a.sent();
                        if (result.success) {
                            this.setData({ isFavorite: result.isFavorite });
                            wx.showToast({
                                title: result.isFavorite ? '已添加到收藏' : '已取消收藏',
                                icon: 'success',
                                duration: 1500
                            });
                        }
                        else {
                            wx.showToast({
                                title: result.message || '操作失败',
                                icon: 'error'
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        console.error('[Calculator] 切换收藏失败:', error_7);
                        wx.showToast({
                            title: '操作失败',
                            icon: 'error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
});
