
async function routes(fastify, options) {
    //Declare a route
    fastify.get('/', async (request, reply) => {
        return { api: 'ready in a directory of its own' };
    });
}

// export routes to used in another file
module.exports = routes
