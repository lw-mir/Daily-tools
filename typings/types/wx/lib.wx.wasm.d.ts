// WASM相关类型定义
declare namespace WechatMiniprogram {
  interface WasmModule {
    exports: any
  }
  
  interface WasmInstance {
    module: WasmModule
    exports: any
  }
} 