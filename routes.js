'use strict'

const validator = require("validator")


const pointTemplate = {
    required : {
        "category"    : {validate: (val) => typeof val === 'string'},
        "email"       : {validate: (val) => typeof val === 'string' && validator.isEmail(val)},
        "description" : {validate: (val) => typeof val === 'string'},
        "latitude"    : {validate: (val) => typeof val === 'number'},
        "longitude"   : {validate: (val) => typeof val === 'number'}
    },
    optional : {
        "img" : {validate: (val) => typeof val === 'string' && validator.isURL(val)}
    }
}

let validateData = function(body, template){
    let required = template.required
    let optional = template.optional
    // check that the length of the body is within the required and optional lengths
    let valid = Object.keys(body).length >= Object.keys(required).length && 
                Object.keys(body).length <= Object.keys(required).length + Object.keys(optional).length;
    if (valid){
        // check that there are no extra body fields that shouldn't be there and they're valid
        Object.keys(body).every((key,index) => {
            let val = body[key]
            valid = valid && ((key in required && required[key].validate(val)) || (key in optional && optional[key].validate(val)))
            return valid
        });
    }

    if (valid){
        // check that all of the required fields are there
        Object.keys(required).every((key,index) => {
            valid = valid && key in body
            return valid
        });
    }
    return valid
}

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
        if(validateData(req.body, pointTemplate)){
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
            res.send(400, "Poorly formatted JSON, must have " 
                + Object.keys(pointTemplate).join(", ") 
                + " parameters with appropriate types.")
        }
    })

    /**
     * Read
     */
    server.get('/points', (req, res, next) => {

        let limit = parseInt(req.query.limit, 10) || 10, // default limit to 10 docs
            skip  = parseInt(req.query.skip, 10) || 0, // default skip to 0 docs
            query = req.query || {}

        // remove skip and limit from query to avoid false querying
        delete query.skip
        delete query.limit

        // find points and convert to array (with optional query, skip and limit)
        collection.find(query).skip(skip).limit(limit).toArray()
            .then(docs => res.send(200, docs))
            .catch(err => res.send(500, err))

        next()

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
