class ChatApplication {
    constructor() {
        this.messages = [];
        this.senderMessageId = 0;
        this.bot = new Bot();

        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-btn');
        this.chatBox = document.getElementById('chat-box');

            sendBtn.addEventListener('click', () => {
                if (messageInput.value !== '') {
                    const messageText = messageInput.value;
                    messageInput.disabled = true;
                    sendBtn.disabled = true;
                    messageInput.value = '';
                    const chatBox = this.chatBox;
                    // Simulate a delay for sending the message
                    setTimeout(() => {
                        this.sendMessage(messageText);
                        const loadingElement = document.createElement('div');

                        this.bot.send(messageText).then((response) => {
                            // Hide loading animation
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
}

new ChatApplication();