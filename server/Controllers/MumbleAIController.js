const { Configuration, OpenAIApi, OpenAIApiException } = require("openai");
require("dotenv").config()

// organization: "org-MY70NH1oNZ8ygVnE5RyDDmWd",
const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
})

const openai = new OpenAIApi(configuration)

const getData = async (req, res) => {
    res.status(200).send({
        message : "Hello from Mumble!"
    })
}

const sendData = async (req, res) => {
    try {
        const prompt = req.body.prompt
        console.log("req.body", req.body)
        console.log(req.body.prompt)
        console.log(process.env.OPENAI_KEY)
        
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0.5, // Higher values means the model will take more risks.
            max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
            top_p: 1, // alternative to sampling with temperature, called nucleus sampling
            frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
            presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
            // stop: ["\"\"\""],
        })
        console.log("response", response)
        res.status(200).send({
            bot : response.data.choices[0].text,
            data : response.data
        })
    }
    catch (error){
        // if (error instanceof OpenAIApiException) {
        //     console.log('OpenAI API error:', error.message);
        //     console.log('Request ID:', error.requestId);
        // } else {
        //     console.log('Unexpected error:', error);
        // }

        console.log("error ----------------------------------------------------------------------------------- ",error)
        res.status(500).send(error || 'Something went wrong')

        
    }
}

module.exports = { getData, sendData }