'use strict'

const restifyPlugins = require('restify').plugins,
      validation = require("./validate")


module.exports = function(ctx) {

    // extract context from passed in object
    const db     = ctx.db,
          server = ctx.server

    // assign collection to variable for further use
    const collection = db.collection('points')

    /**
     * Create
     */
    server.post('/points', (req, res, next) => {
        if(validation.validatePoint(req.body)){
            // extract data from body and add timestamps
            const data = Object.assign({}, req.body, {
                created: new Date(),
                updated: new Date(),
                verified: false
            })

            // insert one object into points collection
            collection.insertOne(data)
                .then(doc => res.send(200, doc.ops[0]))
                .catch(err => res.send(500, err))

            next()
        }else{
            res.send(400, validation.whyInvalidPoint(req.body))
        }
    })

    /**
     * Read
     */

    server.get('/', restifyPlugins.serveStatic({
            'directory': 'public',
            'default': 'main.html'
         }))
    // returns all the points 
    server.get('/points', (req, res, next) => {
        
        // find points and convert to array (with optional query, skip and limit)
        collection.find(req.query || {}).toArray()
            .then(docs => res.send(200, docs))
            .catch(err => res.send(500, err))

        next()

    })

    // returns a list of unique categories
    server.get('/points/categories', (req, res, next) => {
        // find points and convert to array (with optional query, skip and limit)
        collection.distinct("category")
            .then(docs => res.send(200, docs))
            .catch(err => res.send(500, err))
    })

    /**
     * Update
     */
    server.put('/points/:id', (req, res, next) => {

        // extract data from body and add timestamps
        const data = Object.assign({}, req.body, {
            updated: new Date()
        })

        // build out findOneAndUpdate variables to keep things organized
        let query = { _id: req.params.id },
            body  = { $set: data },
            opts  = {
                returnOriginal: false,
                upsert: true
            }

        // find and update document based on passed in id (via route)
        collection.findOneAndUpdate(query, body, opts)
            .then(doc => res.send(204))
            .catch(err => res.send(500, err))

        next()

    })

    /**
     * Delete
     */
    server.del('/points/:id', (req, res, next) => {

        // remove one document based on passed in id (via route)
        collection.findOneAndDelete({ _id: req.params.id })
            .then(doc => res.send(204))
            .catch(err => res.send(500, err))

        next()

    })

}
