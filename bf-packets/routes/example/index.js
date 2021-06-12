'use strict'

module.exports = async function (fastify, opts) {

  // add schema for response

  fastify.get('/', async function (request, reply) {
    return { message: 'We 200' };
  })
}
