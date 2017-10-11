'use strict'

module.exports = {
    name: 'vue-finder-rest-api',
    version: '0.0.1',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 80,
    db: {
	uri: process.env.MONGODB_URL
    }
}
