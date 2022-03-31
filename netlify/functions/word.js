
const axios = require("axios")

exports.handler = async (event) => {
    const options = {
        method: 'GET',
        url: 'https://random-words5.p.rapidapi.com/getMultipleRandom',
        params: {count: 1, wordLength: 5},
        headers: {
            'x-rapidapi-host': 'random-words5.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPID_API_KEY
        }
    }
    const response = await axios.request(options);

    return {
        statusCode: 200,
        body: response.data[0]
    }
}