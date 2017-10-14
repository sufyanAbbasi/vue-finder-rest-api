'use strict'
const bcrypt = require('bcryptjs'),
	  randomWords = require('random-words'),
	  fs = require('fs'),
	  users = require("./secret"),
	  password = process.env.ADMIN_PASSWORD || (()=>{throw new Error('no admin password found on system')})(),
	  saltRounds = 10

module.exports = {
	checkAPIKey: (email, apikey) => {
		if(email in users){
			return bcrypt.compare(email+password+apikey, users[email].apikeyhash)
		}else{
			return new Promise(function(resolve, reject){
				resolve(false);
			})
		}
	},
	generateAPIKey: (email) =>  {
		var apikey = randomWords({ exactly: 5 }).join("")
		bcrypt.hash(email+password+apikey, saltRounds).then(function(hash) {
			fs.appendFile('user.log', "\n" + email + " " + apikey + " " + hash, (err) => {  
			    if (err) throw err;
			    console.log(email + " " + apikey + " " + hash)
			});
		})
	}
}
