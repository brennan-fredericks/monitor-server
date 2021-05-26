// Require the framework and instanstate it

const fastify = require('fastify')({
    logger: true
});

fastify.register(require('./routes/home'));

/*
IPv4
local 127.0.0.1 
all 0.0.0.0

IPv6
local ::1
all ::
*/

fastify.listen(3000, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`);
});