koa_mongodb_rest
----------------

After starting the server you can quickly try it out by issuing the following from the command line:

curl -d '{ "Key" : 42 }' -H "Content-Type: application/json" http://localhost:3000/example?db=test
This should add a document to the collection example in database test looking similar to this:

{ "Key": 42, "_id": ObjectId("4e90e196b0c7f4687000000e") }

Supported REST requests

GET /collection
Returns all documents in collection

GET /collection/id
Returns document with id

GET /collection?where={}&limit=1000&skip=100&order=field1,field2:asc&fields=field1,field2,field3.child
Returns all documents in collection

POST /collection
Insert new document in collection (document(s) in POST body)

PUT /collection/id
Update document with id (update document in PUT body)

DELETE /collection/id
Delete document with id

parameters includes:
- where - query in json object as per mongodb (GET only)
- limit - integer (GET only)
- skip - integer (GET only)
- order - field list in order, with asc or desc (GET only)
- fields - field list used for projection (GET only)
- db - database name - Default defined in the service, but user can overide.
- options - comma separated flags i.e. returndata, returnstatus

- support filters in mongodb similar to loopback
- support aggregate queries?
- support POST many - is this restful
- support getting ID from the body - NO not very restful

- Authentication to be defined