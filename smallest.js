#! /usr/bin/env node

// Configuration
const port = process.argv[2] || 3000;
const endpoint = process.argv[3] || 'api';

const _ = require('lodash');
const app = new (require('koa'))();
const router = new (require('koa-router'))({prefix: `/${endpoint}`});

router.get('/data/:id', async (ctx, next) => { ctx.body = { greeting: "hello world" } });
router.get('/', async (ctx, next) => { ctx.body = { greeting: "hi" } });

app
  .use(router.routes())
  .listen(port);

  console.log(`Koa listening at http://localhost:${port}/${endpoint}`);
