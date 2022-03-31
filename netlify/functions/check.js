const axios = require('axios');

exports.handler = async ({queryStringParameters}) => {
    const {data} = await axios.get('https://twinword-word-graph-dictionary.p.rapidapi.com/association/', {
        params: {entry: queryStringParameters.word},
        headers: {
            'x-rapidapi-host': 'twinword-word-graph-dictionary.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPID_API_KEY
        }
    });

    return {
        statusCode: 200,
        body: data.result_msg
    }
}