export interface DynamicThemeOptions {
  autoLoad?: boolean; // 是否根据meta加载主题色
  primaryColor: string; // 跟随样式文件变量值，初始化使用
  cssUrl: string;
}

export interface StringMap {
  [key: string]: string
}

export interface DynamicThemeClass {
  colorFormula: StringMap;
  colorDescMap: StringMap;
  primaryColor: string;
  cacheColor: string;
  template: string;
  cssUrl: string;
}

export declare class DynamicThemeClass {
  constructor(options: DynamicThemeOptions)

  autoLoadFromMeta(): void

  generateColors(): void

  replaceTemplate(styleText: string): string

  async initTemplate(): Promise<void>

  initTemplate(): void

  changeTheme(): void
}

declare function getInstance(options: DynamicThemeOptions): DynamicThemeClass;

export default getInstance;
