// @ts-ignore
import {convert} from 'css-color-function';
import {replaceAll} from './utils';
import {DynamicThemeOptions, StringMap} from '../index';

class DynamicTheme {
  get cssUrl(): string {
    return this._cssUrl;
  }

  get cacheColor(): string {
    return this._cacheColor;
  }

  set cacheColor(value: string) {
    this._cacheColor = value;
  }

  get primaryColor(): string {
    return this._primaryColor;
  }

  set primaryColor(value: string) {
    // this._primaryColor = value;
    this.cacheColor = value;
    this.generateColors();
  }

  get colorFormula(): StringMap {
    return this._colorFormula;
  }

  get template(): string {
    return this._template;
  }

  set template(value: string) {
    this._template = value;
  }

  get colorDescMap(): StringMap {
    return this._colorDescMap;
  }

  set colorDescMap(value: StringMap) {
    this._colorDescMap = value;
  }

  readonly _colorFormula: StringMap = {
    'light-1': 'color(primary a(10%))',
    'light-2': 'color(primary a(20%))',
    'light-3': 'color(primary a(30%))',
    'light-4': 'color(primary a(40%))',
    'light-5': 'color(primary a(50%))',
    'light-6': 'color(primary a(60%))',
    'light-7': 'color(primary a(70%))',
    'light-8': 'color(primary a(80%))',
    'light-9': 'color(primary a(90%))',
  };

  _colorDescMap: StringMap = {};

  _primaryColor = '';

  _cacheColor = '';

  _template = '';

  readonly _cssUrl: string;

  constructor(options: DynamicThemeOptions) {
    // super(options);
    const {autoLoad, cssUrl, primaryColor} = options;
    this._cssUrl = cssUrl;
    this._primaryColor = primaryColor;
    this.generateColors();
    if (autoLoad) this.autoLoadFromMeta();
  }

  autoLoadFromMeta() {
    window.addEventListener('load', () => {
      const meta = document.querySelector('meta[name=theme-color]');
      const primary = meta?.getAttribute('content');
      if (primary) this.primaryColor = primary;
    });
  }

  // 根据主题色，用css-color-function 生成颜色表
  generateColors() {
    const color = this.cacheColor || this.primaryColor;
    this.colorDescMap = {};
    this.colorDescMap[color] = 'primary';
    Object.keys(this.colorFormula).forEach((key) => {
      const value = this.colorFormula[key].replace(/primary/g, color);
      this.colorDescMap[convert(value).replace(/\s/g, '')] = key;
      this.colorDescMap[convert(value)] = key;
    });
    !this.template && this.initTemplate();
    this.changeTheme();
  }

  // 初始值变量替换
  replaceTemplate(styleText: string) {
    let str = styleText;
    Object.keys(this.colorDescMap).forEach((key) => {
      const value = this.colorDescMap[key];
      str = replaceAll(str, key, value).replace(new RegExp(key, 'ig'), value);
    });
    return str;
  }

  // 生成替换后的变量模版  开发和生产 获取原始样式方式不同
  async initTemplate(): Promise<void> {
    const targetStyle = document.querySelectorAll('.dynamic-theme');
    const styles = targetStyle?.length ? [...targetStyle] : [...document.querySelectorAll('style')];
    this.template = styles.map((style) => this.replaceTemplate(style.innerHTML)).join('\n');
  }

  // 替换主题，写入head
  changeTheme() {
    const colorMap: StringMap = Object
      .keys(this.colorDescMap)
      .reduce((p, c) => ({...p, [this.colorDescMap[c]]: c}), {});
    if (colorMap?.primary === this.primaryColor) return;
    let newTemp = this.template;
    Object.keys(colorMap).forEach((key) => {
      newTemp = newTemp.replace(new RegExp(key, 'ig'), colorMap[key]);
    });
    const targetStyle = document.querySelectorAll('.dynamic-theme');
    targetStyle?.length && [...targetStyle].forEach((el) => el.remove());
    const styleEl = document.createElement('style');
    styleEl.innerHTML = newTemp;
    styleEl.className = 'dynamic-theme';
    document.head.appendChild(styleEl);
    this._primaryColor = this.cacheColor;
  }
}

// 单例
function dynamicThemeFactory() {
  let instance: DynamicTheme;
  return (options: DynamicThemeOptions): DynamicTheme => {
    if (!instance) {
      instance = new DynamicTheme(options);
      return instance;
    }
    return instance;
  };
}

export default dynamicThemeFactory();
