import { PREFIX } from './RouteDefinition';
// 实现 controller 装饰器
export const Controller = (prefix: string = ''): ClassDecorator => {
  return (target: Function): void => {
    // 对对象设置一些元数据
    Reflect.defineMetadata(PREFIX, prefix, target);
  };
};
