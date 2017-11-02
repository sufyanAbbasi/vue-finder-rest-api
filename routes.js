'use strict'

const validation = require("./validate")
const user = require("./user")

module.exports = function(ctx) {

    // extract context from passed in object
    const db     = ctx.db,
          server = ctx.server

    // assign collection to variable for further use
    const point_collection = db.collection('points')
    const event_collection = db.collection('events')

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

            if(req.params.key){
                user.checkAPIKey(req.body.email, req.params.key).then((verified) => {
                    if (verified) {
                        data.verified = true;
                        data.verified_by = req.body.email;
                        // insert one object into points collection
                        point_collection.insertOne(data)
                            .then(doc => res.send(200, doc.ops[0]))
                            .catch(err => res.send(500, err))
                        next()
                    }else{
                        res.send(403, "API key does not match email. Entry was not added.")
                        next()
                    }
                })
            }else{
                // insert one object into points collection
                point_collection.insertOne(data)
                    .then(doc => res.send(200, doc.ops[0]))
                    .catch(err => res.send(500, err))

                next()
            }
        }else{
            res.send(400, validation.whyInvalidPoint(req.body))
        }
    })

    server.post('/events', (req, res, next) => {
        if(validation.validateEvent(req.body)){
            // extract data from body and add timestamps
            const data = Object.assign({}, req.body, {
                created: new Date(),
                updated: new Date(),
                verified: false
            })

            if(req.params.key){
                user.checkAPIKey(req.body.email, req.params.key).then((verified) => {
                    if (verified) {
                        data.verified = true;
                        data.verified_by = req.body.email;
                        // insert one object into points collection
                        event_collection.insertOne(data)
                            .then(doc => res.send(200, doc.ops[0]))
                            .catch(err => res.send(500, err))
                        next()
                    }else{
                        res.send(403, "API key does not match email. Entry was not added.")
                        next()
                    }
                })
            }else{
                // insert one object into points collection
                event_collection.insertOne(data)
                    .then(doc => res.send(200, doc.ops[0]))
                    .catch(err => res.send(500, err))

                next()
            }
        }else{
            res.send(400, validation.whyInvalidEvent(req.body))
        }
    })


    /**
     * Read
     */

    server.get('/', (req, res, next) => {
        var body = '<html><body><h3>This is the VUEFinder REST server.</h3><a href="https://github.com/sufyanAbbasi/vue-finder-rest-api" target="_blank">Github</a></body></html>';
        res.writeHead(200, {
          'Content-Length': Buffer.byteLength(body),
          'Content-Type': 'text/html'
        });
        res.write(body);
        res.end();
        next()
    })

    // returns all the points 
    server.get('/points', (req, res, next) => {

        // find points and convert to array (with optional query, skip and limit)
        point_collection.find(req.query || {}).toArray()
            .then(docs => res.send(200, docs))
            .catch(err => res.send(500, err))

        next()

    })

    // returns a list of unique categories
    server.get('/points/categories', (req, res, next) => {
        // find points and convert to array (with optional query, skip and limit)
        point_collection.distinct("category")
            .then(docs => res.send(200, docs))
            .catch(err => res.send(500, err))

        next()
    })

    // returns all the events 
    server.get('/events', (req, res, next) => {

        // find points and convert to array (with optional query, skip and limit)
        event_collection.find(req.query || {}).toArray()
            .then(docs => res.send(200, docs))
            .catch(err => res.send(500, err))

        next()

    })

    // returns a list of unique categories
    server.get('/events/categories', (req, res, next) => {
        // find points and convert to array (with optional query, skip and limit)
        event_collection.distinct("category")
            .then(docs => res.send(200, docs))
            .catch(err => res.send(500, err))

        next()
    })

    /**
     * Update
     */
    // server.put('/points/:id', (req, res, next) => {
    //     if(req.params.email && req.params.key){
    //         user.checkAPIKey(req.params.email, req.params.key).then((verified) => {
    //             if (verified) {
    //                 // extract data from body and add timestamps
    //                 const data = Object.assign({}, req.body, {
    //                     updated: new Date()
    //                 })

    //                 // build out findOneAndUpdate variables to keep things organized
    //                 let query = { _id: req.params.id },
    //                     body  = { $set: data },
    //                     opts  = {
    //                         returnOriginal: false,
    //                         upsert: false
    //                     }

    //                 // find and update document based on passed in id (via route)
    //                 point_collection.findOneAndUpdate(query, body, opts)
    //                     .then(doc => res.send(204))
    //                     .catch(err => res.send(500, err))

    //                 next()
    //             }else{
    //                 res.send(403, "API key does not match email.")
    //                 next()
    //             }
    //         })
    //     }else{
    //         res.send(403, "No API key or email provided to verify admin status.")
    //         next()
    //     }
    // })

    /**
     * Verified Point
     */
    server.put('/points/verified/:id/:email/:key', (req, res, next) => {
        if(req.params.email && req.params.key){
            user.checkAPIKey(req.params.email, req.params.key).then((verified) => {
                if (verified) {
                    const data = {
                        updated: new Date(),
                        verified: true,
                        verified_by: req.params.email,
                    }

                    // build out findOneAndUpdate variables to keep things organized
                    let query = { _id: req.params.id },
                        body  = { $set: data },
                        opts  = {
                            returnOriginal: false,
                            upsert: false
                        }

                    // find and update document based on passed in id (via route)
                    point_collection.findOneAndUpdate(query, body, opts)
                        .then(doc => res.send(204))
                        .catch(err => res.send(500, err))

                    next()
                }else{
                    res.send(403, "API key does not match email.")
                    next()
                }
            })
        }else{
            res.send(403, "No API key or email provided to verify admin status.")
            next()
        }
    })

    server.put('/events/verified/:id/:email/:key', (req, res, next) => {
        if(req.params.email && req.params.key){
            user.checkAPIKey(req.params.email, req.params.key).then((verified) => {
                if (verified) {
                    const data = {
                        updated: new Date(),
                        verified: true,
                        verified_by: req.params.email,
                    }

                    // build out findOneAndUpdate variables to keep things organized
                    let query = { _id: req.params.id },
                        body  = { $set: data },
                        opts  = {
                            returnOriginal: false,
                            upsert: false
                        }

                    // find and update document based on passed in id (via route)
                    event_collection.findOneAndUpdate(query, body, opts)
                        .then(doc => res.send(204))
                        .catch(err => res.send(500, err))

                    next()
                }else{
                    res.send(403, "API key does not match email.")
                    next()
                }
            })
        }else{
            res.send(403, "No API key or email provided to verify admin status.")
            next()
        }
    })

    /**
     * Delete
     */
    server.del('/points/:id/:email/:key', (req, res, next) => {
        if(req.params.email && req.params.key){
            user.checkAPIKey(req.params.email, req.params.key).then((verified) => {
                if (verified) {
                    // remove one document based on passed in id (via route)
                    point_collection.findOneAndDelete({ _id: req.params.id })
                        .then(doc => res.send(204))
                        .catch(err => res.send(500, err))

                    next()
                }else{
                    res.send(403, "API key does not match email.")
                    next()
                }
            })
        }else{
            res.send(403, "No API key or email provided to verify admin status.")
            next()
        }

    })

    server.del('/events/:id/:email/:key', (req, res, next) => {
        if(req.params.email && req.params.key){
            user.checkAPIKey(req.params.email, req.params.key).then((verified) => {
                if (verified) {
                    // remove one document based on passed in id (via route)
                    event_collection.findOneAndDelete({ _id: req.params.id })
                        .then(doc => res.send(204))
                        .catch(err => res.send(500, err))

                    next()
                }else{
                    res.send(403, "API key does not match email.")
                    next()
                }
            })
        }else{
            res.send(403, "No API key or email provided to verify admin status.")
            next()
        }

    })

}
