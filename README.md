# monitor-server

- fastify web framework
    - [x] moved application to node docker image
    - [x] able to authenticate mongo client, create dedicated client
    - [] build database uri from enviromental variables and docket secrets
    - [x] Endpoint `packets/` 
        - [x] GET: check if endpoint is available  
        - [x] POST: 
            - [x] added packet JSON schema validation and response with appropriate html error code on success or failure.
            - [x] add packet data to mongo database also inject on create timestamp, mongodb will create collection if it doesn't exist

- connect extensible HTTP server framework
    - [] create app docker app
        - [] add route `/packets/` in folder structure
            - [] add middleware for compression to outgoing responses library using `compression` library
            - [] add middleware (error middleware) for packet validation, if fail should response appropriate and stop executing any futher middleware operation
            - [] add middleware to add database to mongodb

- mongo database
    - [x] added mongo database image
    - [] login into mongo client and create database.
        - [x] create a priliveged admin user to manage db and stop using root account
        - [x] create a user with readWrite actions only on the packets database. account to be used by fastify_api
        - [] automate with https://docs.mongodb.com/manual/tutorial/write-scripts-for-the-mongo-shell/
    - [] mongo db indexes? requires further reading https://docs.mongodb.com/drivers/node/fundamentals/indexes/

- scripts
    - [] create a script load `processed packets` from a file and post to `packets` endpoint. 
        - `node-fetch`: only supports https 
        - [] `http`: 
            - [x] able to make post request using `http`
            - [] use `http` to post all data read from file to endpoint. end connection when all data is posted 
  

# TODO
 - build connection uri from secrets, currently using enviromental variable
 - create script to configure databases, collections and users for mongo db,
 - 
 