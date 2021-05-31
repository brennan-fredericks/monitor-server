
// add auto completion support
/**
 * 
 * @param {import('fastify').FastifyInstance} fastify 
 * @param {*} opts 
 */
module.exports = async function (fastify, opts) {

    // add schema for response
    fastify.get('/', async function (request, reply) {
        return { message: 'We 200' };
    });

    // add top level schema for post and dynamic validate
    // add response schema
    fastify.post('/', async function (request, reply) {
        // add packets to endpoint
    });
}
