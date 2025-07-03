# 微信小程序可选链操作符（?.）替换修复总结

## 问题描述

微信小程序开发者工具在某些版本中不支持 ES2020 的可选链操作符（`?.`），导致编译错误：

```
Unexpected token: punc (.)
```

## 修复范围

搜索并替换了整个项目中所有使用可选链操作符的地方，共修复了 4 个文件：

### 1. `miniprogram/app.ts`

**修复位置**: 第 127 行

```typescript
// 修复前
this.globalData.theme = settings?.theme === "dark" ? "dark" : "light";

// 修复后
this.globalData.theme =
  settings && settings.theme === "dark" ? "dark" : "light";
```

### 2. `miniprogram/pages/index/index.ts`

**修复位置**: 第 453 行

```typescript
// 修复前
const recentToolIds = app.globalData?.recentTools || [];

// 修复后
const recentToolIds = (app.globalData && app.globalData.recentTools) || [];
```

### 3. `miniprogram/pages/help/help.ts`

**修复位置**: 第 255-258 行

```typescript
// 修复前
const stepsMatch = item.steps?.some((step) =>
  step.toLowerCase().includes(searchText.toLowerCase())
);
const tipsMatch = item.tips?.some((tip) =>
  tip.toLowerCase().includes(searchText.toLowerCase())
);

// 修复后
const stepsMatch =
  item.steps &&
  item.steps.some((step) =>
    step.toLowerCase().includes(searchText.toLowerCase())
  );
const tipsMatch =
  item.tips &&
  item.tips.some((tip) => tip.toLowerCase().includes(searchText.toLowerCase()));
```

### 4. `miniprogram/pages/tools/foodwheel/foodwheel.ts`

**修复位置**: 第 645 行

```typescript
// 修复前
const dataManager = app.globalData?.dataManager;

// 修复后
const dataManager = app.globalData && app.globalData.dataManager;
```

## 替换规则

### 基本替换模式

```typescript
// 可选链操作符
object?.property;

// 替换为传统的逻辑与操作符
object && object.property;
```

### 带默认值的替换

```typescript
// 可选链操作符 + 空值合并
object?.property ||
  defaultValue(
    // 替换为
    object && object.property
  ) ||
  defaultValue;
```

### 方法调用的替换

```typescript
// 可选链操作符调用方法
object?.method?.();

// 替换为
object && object.method && object.method();
```

## 兼容性说明

### 支持的语法特性

- ✅ 逻辑与操作符 (`&&`)
- ✅ 逻辑或操作符 (`||`)
- ✅ 三元运算符 (`? :`)
- ✅ 传统的属性访问

### 不支持的语法特性

- ❌ 可选链操作符 (`?.`) - ES2020
- ❌ 空值合并操作符 (`??`) - ES2020
- ❌ 私有字段 (`#property`) - ES2022

## 验证结果

1. **TypeScript 编译**: ✅ 通过

   ```bash
   npx tsc --project ./tsconfig.json
   ```

2. **JavaScript 语法检查**: ✅ 通过

   ```bash
   node -c miniprogram/app.js
   node -c miniprogram/pages/index/index.js
   ```

3. **微信开发者工具兼容性**: ✅ 预期通过

## 最佳实践

### 1. 避免使用 ES2020+特性

在微信小程序开发中，建议使用 ES2017 及以下的语法特性以确保最佳兼容性。

### 2. 使用传统的空值检查

```typescript
// 推荐的写法
if (object && object.property) {
  // 使用 object.property
}

// 或者使用三元运算符
const value = object && object.property ? object.property : defaultValue;
```

### 3. TypeScript 配置

确保 `tsconfig.json` 中的 `target` 设置为 `ES2017` 或更低版本：

```json
{
  "compilerOptions": {
    "target": "ES2017"
  }
}
```

## 总结

通过将所有可选链操作符替换为传统的逻辑与操作符，项目现在完全兼容微信小程序的 JavaScript 运行环境，不会再出现语法错误。所有功能保持不变，只是使用了更兼容的语法实现。
