const fastifyPlugin = require('fastify-plugin');

async function dbConnector(fastify,options){
    fastify.register(require('fastify-mongodb'),{
        url: 'mongodb://localhost:27017/test'
    });
}

// Wrapping a plugin fucntion with fastify-plugin exposes the decorators
// and hooks, declared inside the plugin to the parent scope.
module.exports = fastifyPlugin(dbConnector);