// Configuration
const API_PORT = 3000;
const API_ENDPOINT = 'api';

const Koa = require('koa');
// const Router = require('koa-router');
// const bodyParser = require('koa-bodyparser');
const getRawBody = require('raw-body')
const app = new Koa();
// const router = new Router({prefix: `/${API_ENDPOINT}`});

// router.get('/data/:id', async (ctx, next) => {
//   await next();
//   ctx.body = {greeting: "hello"}
// });


app.use(async (ctx,next) => {
  await next();

  // Get the collection (first part of path)
  // Get the remaining parameters, id then param array
  // Depends on whether GET, PUT, POST or DELETE

  // Get the body data
  const text = await getRawBody(ctx.req, { encoding: true });
  const jsonRequestBody = JSON.parse(text);
  
});

// router.post('*', (ctx, next) => {
//   // ctx.router available
//   console.log(ctx);
// });



app
  // .use(bodyParser())
  // .use(router.routes())
  // .use(router.allowedMethods())
  .listen(API_PORT);

console.log(`Koa listening at http://localhost:${API_PORT}/${API_ENDPOINT}`);
