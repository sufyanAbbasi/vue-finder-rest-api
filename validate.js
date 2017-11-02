'use strict'

const validator = require("validator")

const pointTemplate = {
    required : {
        "category"    : {
                            validate: (val) => typeof val === 'string' && validator.isUppercase(val), 
                            error: "- category is not an uppercase string"
                        },
        "email"       : {
                            validate: (val) => typeof val === 'string' && validator.isEmail(val), 
                            error: "- email is not a proper email"
                        },
        "description" : {
                            validate: (val) => typeof val === 'string',
                            error: "- description is not a string"
                        },
        "latitude"    : {
                            validate: (val) => typeof val === 'number',
                            error: "- latitude is not a number"
                        },
        "longitude"   : {
                            validate: (val) => typeof val === 'number',
                            error: "- longitude is not a number"
                        }
    },
    optional : {
        "img" : {
            validate: (val) => typeof val === 'string' && validator.isURL(val),
            error: "- img is not a proper url"
        }
    }
}

const eventTemplate = {
    required : {
        "category"    : {
                            validate: (val) => typeof val === 'string' && validator.isUppercase(val), 
                            error: "- category is not an uppercase string"
                        },
        "email"       : {
                            validate: (val) => typeof val === 'string' && validator.isEmail(val), 
                            error: "- email is not a proper email"
                        },
        "description" : {
                            validate: (val) => typeof val === 'string',
                            error: "- description is not a string"
                        },
        "start"       : {
                            validate: (val) => typeof val === 'string' && validator.isISO8601(val),
                            error: "- start date is not a ISO8601 formatted date"
                        },
        "end"         : {
                            validate: (val) => typeof val === 'string' && validator.isISO8601(val),
                            error: "- end date is not a ISO8601 formatted date"
                        },
        "latitude"    : {
                            validate: (val) => typeof val === 'number',
                            error: "- latitude is not a number"
                        },
        "longitude"   : {
                            validate: (val) => typeof val === 'number',
                            error: "- longitude is not a number"
                        }
    },
    optional : {
        "img" : {
            validate: (val) => typeof val === 'string' && validator.isURL(val),
            error: "- img is not a proper url"
        }
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

let whyInvalidData = function(body, template){
    let required = template.required
    let optional = template.optional
    let error = ["Required: " + Object.keys(required).join(", "), 
                 "Optional: " + Object.keys(optional).join(", ")]
    // check that the length of the body is within the required and optional lengths
    let valid = Object.keys(body).length >= Object.keys(required).length && 
                Object.keys(body).length <= Object.keys(required).length + Object.keys(optional).length;
    if (valid){
        // check that there are no extra body fields that shouldn't be there and they're valid
        Object.keys(body).forEach((key,index) => {
            let val = body[key]
            if(key in required){
                if(!required[key].validate(val)){
                    error.push(required[key].error)
                }
            }else if(key in optional){
                if(!optional[key].validate(val)){
                    error.push(optional[key].error)
                }
            }else{
                error.push("- " + key + " does not belong.")
            }
        });
        // check that all of the required fields are there
        Object.keys(required).every((key,index) => {
            valid = valid && key in body
            return valid
        });
        if(!valid){
            error.push("- not all required parameters exist.")
        }
    }else{
        error.push(Object.keys(body).length < Object.keys(required).length ? 
            "- not enough parameters.":
            "- too many parameters.")
    }
    return error.join("\n")
}

module.exports.validatePoint = (body) => validateData(body, pointTemplate)
module.exports.validateEvent = (body) => validateData(body, eventTemplate)
module.exports.whyInvalidPoint = (body) => whyInvalidData(body, pointTemplate) 