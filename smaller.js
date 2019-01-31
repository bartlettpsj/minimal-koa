const app = new (require('koa'))();
const _ = require('lodash');
const bodyParser = require('koa-bodyparser');
const HttpStatus = require('http-status-codes');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
const connectionString = 'mongodb://localhost:27017';

const addTrailingSlash = (part) => part.substr(-1) != '/' ? part + '/' : part;
const addLeadingSlash = (part) => part.substr(0,1) != '/' ? '/' + part : part;

const port = process.argv[2] || 3000;
const endpoint = process.argv[3] || 'api';
const fullendpoint = addTrailingSlash(addLeadingSlash(endpoint));
const restError = (ctx, status, message) => { 
  ctx.status = status;
  ctx.body = message;
};
const connectToDb = async (dbName) => {
  const client = await MongoClient.connect(connectionString, { useNewUrlParser: true });
  return await client.db(dbName);
}

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
    // const queries = _.reduce(ctx.query, (r, v, k) => (r ? r + ',' : '') + `${k}:${v}`, '');        
    const body = ctx.request.body;
    const path = ctx.path;
    // const msg = `Method: [${method}] Path: [${path}] Params: [${queries}] rawBody: [${ctx.request.rawBody}] body: [${ctx.request.body}]`;    

    // Split up the path removing the endpoint and splitting into parts
    const requestPath = (path.startsWith(fullendpoint)) ? path.substr(fullendpoint.length) : path;
    const pathParts = requestPath.split('/');
    const collectionName = pathParts[0];
    const documentId = pathParts[1];    
    const dbName = ctx.query.db || 'database';

    // Make sure no more parts to path - convert to REST error in future
    if (pathParts[2]) {
      ctx.throw(HttpStatus.BAD_REQUEST, 'Too many parts to path');
    }

    // Get the filter - from body or parameters
    const filter = '';
    
    // ctx.body = msg; // response with what we were sent as string
    console.log(`${method} request`);

    switch (method) {
      case 'GET': {
        // Get record using id (if specified) and filter (if specified)
        const db = await connectToDb(dbName);
        const query = documentId ? { _id: ObjectID(documentId) } : {};        
        const result = await db.collection(collectionName).find(query).toArray()
        ctx.body = result;

        break;
      }      
      case 'POST': {
        // Perform database insert, single or multiple records

        const db = await connectToDb(dbName);

        if (Array.isArray(body)) {
          const result = await db.collection(collectionName).insertMany(body);
          ctx.body = result.ops;  
        } else {
          const result = await db.collection(collectionName).insertOne(body);
          ctx.body = result.ops;  
        }

        break;
      }
      case 'PUT': {
        // Effectively an upsert - update or else insert - ID must be present - https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.6
        if (!documentId) {
          ctx.throw(HttpStatus.BAD_REQUEST, 'Document not specified');
        }

        const db = await connectToDb(dbName);
        const query = { _id: ObjectID(documentId) };        
        const result = await db.collection(collectionName).updateOne(query, {$set: body}, { upsert: true });
        ctx.body = result;

        break;
      }
      case 'DELETE': {
        // currently only support delete individual and no where parameter allowed
        const db = await connectToDb(dbName);

        if (!documentId) {
          ctx.throw(HttpStatus.BAD_REQUEST, 'Document not specified');
        }

        // Check that parameters are not specified

        const query = { _id: ObjectID(documentId) };        
        const result = await db.collection(collectionName).deleteOne(query);
        ctx.body = result;

        break;
      }

      default: {
        console.log(`${method} method is not supported`);
      }
    }

    await next();
  });

  console.log(`Koa listening at http://localhost:${port}/${endpoint}`);