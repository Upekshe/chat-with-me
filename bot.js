class Bot {
    constructor() {
        this.session = self.ai.languageModel.create({
            systemPrompt: "Supportive and Empathetic Friend"
          });
        this.moderator = self.ai.languageModel.create({
            systemPrompt:"Evaluator of a response, whether a certain response is okay to be sent to a person with depression. Always respond with either YES or NO, YES means it is suitable, NO means the provided text is not suitable"
        })
    }

    async send(messageText) {
        console.log(`Bot: Sending response to "${messageText}"`);

        // After a short delay, the bot will respond with its own message
            const responseText = await this.getResponse(messageText);
            console.log(`Bot: Response: ${responseText}`);
            this.evaluateResponse(responseText);
            return responseText;
    }

    async getResponse(messageText) {
        // if (messageText === 'hello') {
        //     return 'Hello! How can I help you today?';
        // } else if (messageText === 'thank you') {
        //     return 'You are welcome!';
        // } else if (messageText === 'goodbye') {
        //     return 'Goodbye! Have a nice day!';
        // } else {
        //     return `I didn't understand that. Can you please rephrase?`;
        // }
        return (await this.session).prompt(messageText);
    }

    async evaluateResponse(response) {
       const isAppropriate = await (await this.moderator).prompt(response);
       console.log("The response:", response);
       console.log("is Appropriate:", isAppropriate);
    }

    start() {}
}

new Bot();