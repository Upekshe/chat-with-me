class Bot {
    constructor() {
        this.session = self.ai.languageModel.create({
            systemPrompt: "Supportive and Empathetic Friend"
          });
        this.moderator = self.ai.languageModel.create({
            systemPrompt:"Evaluator of a response, whether a certain response is okay to be sent to a person with depression. Always respond with either YES or NO, YES means it is suitable, NO means the provided text is not suitable"
        })
        this.rewriter = self.ai.languageModel.create({
            systemPrompt: "Avoid any toxic language and be as constructive as possible. avoid using any type of harmful content"
        })
        // I am writing to use the write api, but wasnt successful
        //  this.rewriter = self.ai.writer.create({
        //       context: "Avoid any toxic language and be as constructive as possible. avoid using any type of harmful content"
        //  });
    }

    async send(messageText) {
        console.log(`Bot: Sending response to "${messageText}"`);

        // After a short delay, the bot will respond with its own message
            const responseText = await this.getResponse(messageText);
            console.log(`Bot: Response: ${responseText}`);
            const isAppropriate = await this.evaluateResponse(responseText);
            if(isAppropriate) {
                return responseText;
            }
            return this.rewrite(responseText);

    }

    async getResponse(messageText) {
        return (await this.session).prompt(messageText);
    }

    async evaluateResponse(response) {
       const isAppropriate = await (await this.moderator).prompt(response);
       console.log("The response:", response);
       console.log("is Appropriate:", isAppropriate);
       return isAppropriate === 'YES'
    }

    async rewrite(currentResponse) {
        return (await this.rewriter).prompt(currentResponse);
      
    }

    start() {}
}

new Bot();