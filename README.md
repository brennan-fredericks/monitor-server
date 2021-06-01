# monitor-server

- fastify_web_framework
    - [x] Endpoint `packets/` 
        - [x] GET: check if endpoint is available  
        - [] POST: 
            - [x] added packet JSON schema validation and response with appropriate html error code on success or failure.
            - [] add json data to mongo database

- mongo database
    - [x] mongo database up and running in docker



- scripts
    - [] create a script load `processed packets` from a file and post to `packets` endpoint. 
        - `node-fetch`: only supports https
        - `axios`: investigate how to specify port? only able to specify hostname
  


# TODO
 