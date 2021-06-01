# monitor-server

- fastify web framework
    - [x] moved application to node docker image
    - [ ] able to authenticate mongo client, create dedicated client
    - [x] Endpoint `packets/` 
        - [x] GET: check if endpoint is available  
        - [] POST: 
            - [x] added packet JSON schema validation and response with appropriate html error code on success or failure.
            - [] add json data to mongo database

- mongo database
    - [x] added mongo database image
    - [] login into mongo client and create database.
    - [] create a priliveged admin user to manage db and stop using root account
    - [] create a user with readWrite actions only on the packets database. account to be used by fastify_api


- scripts
    - [] create a script load `processed packets` from a file and post to `packets` endpoint. 
        - `node-fetch`: only supports https
        - `axios`: investigate how to specify port? only able to specify hostname
  

# TODO
 - build connection uri from secrets, currently using enviromental variable
 