const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
class ChatGPTRecognizer {
    constructor(config) {
        this.recognizer = new OpenAIApi(configuration);
    }
    async getChatGptAnswer(context){
        console.log('context==>',context)
        return await this.recognizer.createCompletion({
            model: "text-davinci-003",
            prompt: context,
            max_tokens:4000
        });
    }
}

module.exports.ChatGPTRecognizer = ChatGPTRecognizer;
