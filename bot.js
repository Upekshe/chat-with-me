class Bot {
    constructor() {
        if (!this.isServiceAvailable()) {
            return;
        }

        this.defaultMessageOnError='Sorry, we ran into an issue, Let us try again?'

        this.session = self.ai.languageModel.create({
            systemPrompt: "Supportive and Empathetic Friend, Keep the responses short and human like"
        });
        this.moderator = self.ai.languageModel.create({
            systemPrompt: "Evaluator of the response, whether a certain response is okay to be sent to a person with depression. Always respond with either YES or NO, YES means it is suitable, NO means the provided text is not suitable"
        })
        this.rewriter = self.ai.languageModel.create({
            systemPrompt: "Avoid any toxic language and be as constructive as possible. avoid using any type of harmful content"
        })
        // I am writing to use the write api, but wasnt successful
        //  this.rewriter = self.ai.writer.create({
        //       context: "Avoid any toxic language and be as constructive as possible. avoid using any type of harmful content"
        //  });
    }

    isServiceAvailable() {
        if (!self.ai || !self.ai.languageModel) {
            return false;
        }
        return true;
    }

    async send(messageText) {
        console.log(`Bot: Sending response to "${messageText}"`);

        const responseText = await this.getResponse(messageText).catch(ex=>this.defaultMessageOnError);
        console.log(`Bot: Response: ${responseText}`);
        const isAppropriate = await this.evaluateResponse(responseText).catch(e => false);
        if (isAppropriate) {
            return responseText;
        }
        return this.rewrite(responseText).catch(ex=>this.defaultMessageOnError);
    }

    async getResponse(messageText) {
        return (await this.session).prompt(messageText);
    }

    async evaluateResponse(response) {
        const isAppropriate = await (await this.moderator).prompt(response);
        console.log("Is the response appropriate:", isAppropriate);
        return isAppropriate === 'YES'
    }

    async rewrite(currentResponse) {
        return (await this.rewriter).prompt(currentResponse);
    }

    start() { }
}

new Bot();