export class SetPlatforms {
  static readonly type = '[环境] 设置运行环境参数';
  constructor(public platforms: string[]) { }
}
