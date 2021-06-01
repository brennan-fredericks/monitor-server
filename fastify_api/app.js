'use strict'
const { MongoClient } = require('mongodb');
const path = require('path')
const AutoLoad = require('fastify-autoload')

/**
 * 
 * @param {import('fastify').FastifyInstance} fastify 
 * @param {*} opts 
 */
module.exports = async function (fastify, opts) {
  // Place here your custom code!

  //mongo database configuration
  fastify.decorate('config', {
    'DB_URI': process.env.DB_URI,
    'DB_NAME': process.env.DB_NAME
  })

  //check if database available
  const client = new MongoClient(fastify.config.DB_URI);
  try {
    await client.connect()
    const db = client.db(fastify.config.DB_NAME);
    console.info(`Connected to database ${db.databaseName}`)
    console.info(db.collection('AF_Packet'));
  }
  catch (ex) {
    console.error(`Unable to connect to database ${fastify.config.DB_URI}`);
  }
  finally {
    await client.close();
  }

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
}
