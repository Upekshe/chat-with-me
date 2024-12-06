class Bot {
    constructor() {
        if (!this.isServiceAvailable()) {
            return;
        }

        this.defaultMessageOnError = 'Sorry, we ran into an issue, Let us try again?'

        this.session = self.ai.languageModel.create({
            systemPrompt: "You are a supportive and Empathetic friend, you are an average human, The response should be human like, for example in the start of the conversation a hello or a hi or a simple Hey needs to be responded with something similar to Hello, how are you?, You are not an expert in any field or area, you simulate an average human, for example if the question is about medical advise or coding, you can just reply something similar to Sorry I do not know about this subject, about the human history you do not know or have seen anything about any human conflict happened or happening in the history, so you can not provide an opinion on those"
        });
        this.moderator = self.ai.languageModel.create({
            systemPrompt: "You are an evaluator of a response given by a large language model, Your job is to evaluate whether the response is okay to be sent to a human with depression. Always respond with either YES or NO, YES is suitable, NO is not suitable. Do not provide any explanations or anythign else"
        })
        this.rewriter = self.ai.languageModel.create({
            systemPrompt: "Your job is to re-word a given promp, Strip out any toxic language, keep the message, remove any type of harmful content. The final output should be the re-worded version, if the message is toxic or harmful even after re-wording, then the output should to change the subject, a statement like, May be we should discuss something else, would like to discuss [some topic]"
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

        const responseText = await this.getResponse(messageText).catch(ex => this.defaultMessageOnError);
        console.log(`Bot: Response: ${responseText}`);
        const isAppropriate = await this.evaluateResponse(responseText).catch(e => false);
        if (isAppropriate) {
            return responseText;
        }
        const updatedResponse = this.rewrite(responseText).catch(ex => this.defaultMessageOnError);
        this.feedUpdatedResponseToChatBot(updatedResponse);
        return updatedResponse;
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

    async feedUpdatedResponseToChatBot(updatedResponse) {
        (await this.session).prompt(`Your last response was inappropriate, it had either harmful or toxic message. The accepted response is "${updatedResponse}". Just reply "OK" to this message.`)
    }

    start() { }
}

new Bot();