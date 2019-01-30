const app = new (require('koa'))();
const _ = require('lodash');
const bodyParser = require('koa-bodyparser');
var HttpStatus = require('http-status-codes');

const addTrailingSlash = (part) => part.substr(-1) != '/' ? part + '/' : part;
const addLeadingSlash = (part) => part.substr(0,1) != '/' ? '/' + part : part;

const port = process.argv[2] || 3000;
const endpoint = process.argv[3] || 'api';
const fullendpoint = addTrailingSlash(addLeadingSlash(endpoint));
const restError = (ctx, status, message) => { 
  ctx.status = status;
  ctx.body = message;
};

app.listen(port);

// This is a very simple rest to datasource service
// GET, DELETE, POST, PUT supported.
//  path: /endpoint/collection/id?filter=
//    endpoint - could be multiple i.e. /api/v1
//    collection mandatory
//    id mandatory for DELETE and PUT (in future get id from body if missing)
//    filter - same syntax as loopback
//  body: contains JSON of object

app
  .use(bodyParser())
  .use(async (ctx, next) => {
    const method = ctx.method;
    const queries = _.reduce(ctx.query, (r, v, k) => (r ? r + ',' : '') + `${k}:${v}`, '');        
    const body = ctx.request.body;
    const path = ctx.path;
    const msg = `Method: [${method}] Path: [${path}] Params: [${queries}] rawBody: [${ctx.request.rawBody}] body: [${ctx.request.body}]`;    

    // Split up the path removing the endpoint and splitting into parts
    const requestPath = (path.startsWith(fullendpoint)) ? path.substr(fullendpoint.length) : path;
    const pathParts = requestPath.split('/');
    const collectionName = pathParts[0];
    const documentId = pathParts[1];    

    // Make sure no more parts to path - convert to REST error in future
    if (pathParts[2]) {
      // return restError(ctx, HttpStatus.BAD_REQUEST, 'Too many parts to path');
      ctx.throw(HttpStatus.BAD_REQUEST, 'Too many parts to path');
    }

    // Get the filter - from body or parameters
    const filter = '';
    
    ctx.body = msg; // response with what we were sent as string

    switch (method) {
      case 'GET': {
        // get record using id (if specified) and filter (if specified)
        console.log('GET request');
        break;
      }      
      case 'POST': {
        // Perform database insert
        console.log('POST request');
        break;
      }
      case 'PUT': {
        // Effectively an upszert
        console.log('PUT request');
        break;
      }
      case 'DELETE': {
        console.log('DELETE request');

        // currently only support delete individual and no filter parameter allowed
        break;
      }

      default: {
        console.log(`${method} method is not supported`);
      }
    }




    await next();
  });

  console.log(`Koa listening at http://localhost:${port}/${endpoint}`);

