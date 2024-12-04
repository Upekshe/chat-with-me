class ChatApplication {
    constructor() {
        this.messages = [];
        this.senderMessageId = 0;
        this.bot = new Bot();

        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-btn');
        this.chatBox = document.getElementById('chat-box');
        this.welcomeMessageElement;

       // removing this for the moment 
        const welcomeMessageElement = document.getElementById('welcome-message');
        // if (welcomeMessageElement) {
        //     this.welcomeMessageElement = welcomeMessageElement;
        //     this.welcomeMessageElement.textContent = 'Hey, I am the friend you never had!';
        //     setTimeout(() => {
        //         this.removeWelcomeMessage();
        //     }, 200000);
        // }
                // const welcomeMessageElement = document.getElementById('welcome-message');
        if (welcomeMessageElement) {
            this.welcomeMessageElement = welcomeMessageElement;
            this.welcomeMessageElement.textContent = 'Hey, chat with me, I am a good listener!';
        }
            sendBtn.addEventListener('click', () => {
                if (messageInput.value !== '') {
                    const messageText = messageInput.value;
                    messageInput.disabled = true;
                    sendBtn.disabled = true;
                    messageInput.value = '';
                    const chatBox = this.chatBox;
                    setTimeout(() => {
                        this.sendMessage(messageText);
                        const loadingElement = document.createElement('div');

                        this.bot.send(messageText).then((response) => {
                            const loadingElementIndex = Array.prototype.indexOf.call(chatBox.children, loadingElement);
                            if (loadingElementIndex !== -1) {
                                this.chatBox.removeChild(loadingElement);
                            }
                            this.sendRecipientResponse(response);
                            messageInput.disabled = false;
                            sendBtn.disabled = false;
                        });

                        loadingElement.classList.add('sender', 'message');
                        loadingElement.innerHTML = `
                        <span style="font-style: italic;">typing...</span>
                        `;
                        this.chatBox.appendChild(loadingElement);
                        }, 100);
                }
            });
        };

    sendMessage(messageText) {
        this.messages.push({ text: messageText, sender: 'other' });

        const newMessage = document.createElement('div');
        newMessage.classList.add('receiver', 'message');
        newMessage.innerHTML = `
            <span class="sender-icon">${'Y'}</span>
            ${this.messages[this.messages.length - 1].text}
        `;
        this.chatBox.appendChild(newMessage);
    }

    sendRecipientResponse(responseText) {
        this.messages.push({ text: responseText, sender: 'other' });

        const newMessage = document.createElement('div');
        newMessage.classList.add('sender', 'message');
        newMessage.innerHTML = `
            <span class="receiver-icon">${'R'}</span>
            ${this.messages[this.messages.length - 1].text}
        `;
        this.chatBox.appendChild(newMessage);
    }

    removeWelcomeMessage() {
        if (this.welcomeMessageElement) {
            this.chatBox.appendChild(this.welcomeMessageElement);
            this.welcomeMessageElement.remove();
        }
    }
}

new ChatApplication();