// @ts-nocheck
import 'reflect-metadata';

import Koa from 'koa';
import { Context, Next } from 'koa';
import Router from '@koa/router';

import CatsController from './controller/CatsController';
import { RouteDefinition, PATH, PREFIX } from './decorator/RouteDefinition';
import initLoad from './common/initLoad';
import { server } from './config';
import HomeRouter from './router/home';

const app = new Koa();

initLoad(app);

app.use(HomeRouter.routes());

app.use(HomeRouter.allowedMethods());

[CatsController].forEach((Controller) => {
  console.log('Controller', Controller);
  const router = new Router();

  const instance = new Controller();
  // 获取 prefix
  const prefix = Reflect.getMetadata(PREFIX, Controller);
  console.log('prefix', prefix);

  // 获取 routes
  console.log('PATH', PATH);
  console.log('Controller', Controller);
  const routes: Array<RouteDefinition> = Reflect.getMetadata(PATH, Controller);

  routes.forEach((route: RouteDefinition) => {
    const { path, requestMethod, property } = route;
    const url = prefix + path;
    router[requestMethod](url, (ctx: Context, next: Next) => {
      instance[property](ctx, next);
    });
  });
});

app.listen(server.port, server.hostname, () => {
  console.log(`Listening on ${server.port}`);
});

export default app;
