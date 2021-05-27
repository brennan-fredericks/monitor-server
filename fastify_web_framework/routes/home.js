
async function routes(fastify, options) {

  //const collection = fastify.mongo.db.collection('test_collection');

  // schema for  root reply
  const opts_get = {
    schema: {
      body: {
        type: 'object',
        properties: {
          We_200: { type: 'string' }
        }
      }

    }
  }

  //Declare a route
  fastify.get('/', opts_get, async (request, reply) => {
    return { We_200: 'XD' };
  });

  const opts = {
    schema: {
      body: {
        type: 'object',
        properties: {
          someKey: { type: 'string' },
          someOtherKey: { type: 'number' }
        }
      }
    }
  }

  fastify.post('/', opts, async (request, reply) => {
    return { hello: 'world' }
  });

  const opts1 = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            hello: { type: 'string' }
          }
        }
      }
    }
  }
}

// export routes to used in another file
module.exports = routes;
