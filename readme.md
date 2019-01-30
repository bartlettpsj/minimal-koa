Going to support this...

Quick try

After starting the server you can quickly try it out by issuing the following from the command line:

curl -d '{ "Key" : 42 }' -H "Content-Type: application/json" http://localhost:3500/test/example
This should add a document to the collection example in database test looking similar to this:

{ "Key": 42, "_id": ObjectId("4e90e196b0c7f4687000000e") }
Supported REST requests

GET /db/collection
Returns all documents (query and options can be sent in GET body)

GET /db/collection?query=%7B%22isDone%22%3A%20false%7D -- nope do the loopback thing
Returns all documents satisfying query

GET /db/collection?query=%7B%22isDone%22%3A%20false%7D&limit=2&skip=2
Ability to add options to query (limit, skip, etc)

GET /db/collection/id
Returns document with id

POST /db/collection
Insert new document in collection (document in POST body)

PUT /db/collection/id
Update document with id (updated document in PUT body)

DELETE /db/collection/id
Delete document with id

- support filters in mongodb similar to loopback
- support aggregate queries?
- support POST many
- support getting ID from the body
