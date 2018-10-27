// Configuration
const API_PORT = 3000;
const API_ENDPOINT = 'api';

const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router({prefix: `/${API_ENDPOINT}`});

router.get('/data/:id', async (ctx, next) => {
  ctx.body = {greeting: "hello"}
});

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(API_PORT);

console.log(`Koa listening at http://localhost:${API_PORT}/${API_ENDPOINT}`);
