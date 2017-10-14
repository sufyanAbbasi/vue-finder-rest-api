'use strict'

/**
 * Module Dependencies
 */
require('dotenv').config()
const config  = require('./config'),
      restify = require('restify'),
      restifyPlugins = require('restify').plugins,
      mongodb = require('mongodb').MongoClient

/**
 * Initialize Server
 */
const server = restify.createServer({
    name    : config.name,
    version : config.version
})

/**
 * Bundled Plugins (http://restify.com/#bundled-plugins)
 */
server.use(restifyPlugins.jsonBodyParser({ mapParams: true }))
server.use(restifyPlugins.acceptParser(server.acceptable))
server.use(restifyPlugins.queryParser({ mapParams: true }))
server.use(restifyPlugins.fullResponse())

/**
 * Lift Server, Connect to DB & Require Route File
 */
server.listen(config.port, () => {

    // establish connection to mongodb atlas
    mongodb.connect(config.db.uri, (err, db) => {

        if (err) {
            console.log('An error occurred while attempting to connect to MongoDB', err)
            process.exit(1)
        }

        console.log(
            '%s v%s ready to accept connections at url %s on port %s in %s environment.',
            server.name,
            config.version,
	        server.url,
            config.port,
            config.env
        )

        require('./routes')({ db, server })

    })

})
