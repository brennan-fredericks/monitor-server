/*
*/

async function packetPostHandler(request, reply) {
    // validate internal data
    console.log('here');
    return { message: 'We 201' };
}

async function packetGetHandler(request, reply) {
    console.log('here');

    return { message: 'We 200' };
}
// add auto completion support
/**
 * 
 * @param {import('fastify').FastifyInstance} fastify 
 * @param {*} opts 
 */
module.exports = async function (fastify, opts) {


    // add schema for response
    fastify.get('/', packetGetHandler);

    const bodyJsonSchema = {
        type: 'object',
        required: ['Info', 'AF_Packet'],
        properties: {
            Info: { type: 'object' },
            AF_Packet: { type: 'object' }
        },
        additionalProperties: true
    }

    const headersJsonSchema = {
        type: 'object',
        properties: {
            'content-type': { type: 'string' }
        },
        required: ['content-type']
    }

    const schema = {
        body: bodyJsonSchema,
        headers: headersJsonSchema
    }
    fastify.post('/', { schema }, packetPostHandler);
}
