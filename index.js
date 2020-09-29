const Twit = require('twit')
require('dotenv').config()
var fs = require('fs');

const fetch = require('node-fetch');

var createIsCool = require('iscool');
isCool = createIsCool();
// isCool('trees');

const T = new Twit({
	consumer_key: process.env.API_KEY,
	consumer_secret: process.env.API_SECRETE,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_SECRETE,
	timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
	strictSSL: true,     // optional - requires SSL certificates to be valid.
})

let url = 'https://quotes.rest/qod?language=en'

// Fetch config.
const config = {
	method: 'GET',
	headers: {
		'Accept': 'application/json',

	}
}

const postDailyQuote = async () => {
	
	for (let index = 0; index < 10;) {
		try {
			// Attempt to execute the endpoint.
			const response = await fetch(url, { ...config })
			const json = await response.json()
			console.log(json.contents.quotes[0])
			// Check if successfull.
			if (json.contents.quotes.length > 0) {
				T.post('statuses/update', { status: `${json.contents.quotes[0].quote} - ${json.contents.quotes[0].author}` }, function (err, data, response) {
					console.log('Quote sent')
				})
			}

		} catch (error) {
			console.log(error)
		}
		
		// sleep till next day.
		await sleep(76400000)
	}
}

// Delay the loop.
const sleep = (ms) => {
	return new Promise(
		resolve => setTimeout(resolve, ms)
	);
}

postDailyQuote()