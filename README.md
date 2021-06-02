# monitor-server

- fastify web framework
    - [x] moved application to node docker image
    - [x] able to authenticate mongo client, create dedicated client
    - [] build database uri from enviromental variables and docket secrets
    - [x] Endpoint `packets/` 
        - [x] GET: check if endpoint is available  
        - [] POST: 
            - [x] added packet JSON schema validation and response with appropriate html error code on success or failure.
            - [] add packet data to mongo database also inject on create timestamp, mongodb will create collection if it doesn't exist

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
        - `axios`: investigate how to specify port (defaulting to 80)? only able to specify hostname
        - `http`: investigate implement http 1.1 post request.
  

# TODO
 - build connection uri from secrets, currently using enviromental variable
 - create script to configure databases, collections and users for mongo db,
 - 
 