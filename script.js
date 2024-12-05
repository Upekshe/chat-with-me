class ChatApplication {
    constructor() {
        this.bot = new Bot();
        if (!this.bot.isServiceAvailable()) {
            const errorMessage = document.getElementById('not-supported-message');
            errorMessage.style.display = "block";
            errorMessage.innerHTML = `Sorry, Your browser doesn't support the AI on browser.`;
            errorMessage.hidden = false;;
            return;
        }

        this.messages = [];
        this.senderMessageId = 0;

        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-btn');
        this.chatBox = document.getElementById('chat-messages');

        messageInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const messageText = messageInput.value;
                messageInput.disabled = true;
                sendBtn.disabled = true;
                messageInput.value = '';
                this.sendMessage(messageText, () => {
                    messageInput.disabled = false;
                    sendBtn.disabled = false;
                });
            }
        });

        sendBtn.addEventListener('click', () => {
            const messageText = messageInput.value;
            messageInput.disabled = true;
            sendBtn.disabled = true;
            messageInput.value = '';
            this.sendMessage(messageText, () => {
                messageInput.disabled = false;
                sendBtn.disabled = false;
            });
        });
    };

    sendMessage(messageText, callback) {
        if (messageText == null || messageText.length < 1) { return; }
        const chatBox = this.chatBox;
        setTimeout(() => {
            this.onMessageSent(messageText);
            const loadingElement = document.createElement('div');

            this.bot.send(messageText).then((response) => {
                const loadingElementIndex = Array.prototype.indexOf.call(chatBox.children, loadingElement);
                if (loadingElementIndex !== -1) {
                    this.chatBox.removeChild(loadingElement);
                }
                this.sendRecipientResponse(response);
                callback();
            });

            loadingElement.classList.add('received', 'message', 'typing-indicator');
            loadingElement.innerHTML = `
                    <span class="typing-text">typing<span class="dots"></span></span>
                    `;
            this.chatBox.appendChild(loadingElement);
        }, 100);
    }

    removeEmojis(text) {
        return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u2600-\u26FF\u2700-\u27BF]+/gu, '');
    }

    speak(text) {
        const utterance = new SpeechSynthesisUtterance(this.removeEmojis(text));
        utterance.pitch = 1.2;
        utterance.rate = 1.1;
        utterance.volume = 1;
        utterance.emotion = 'happy'

        window.speechSynthesis.speak(utterance);
    }

    onMessageSent(messageText) {
        this.messages.push({ text: messageText, sender: 'self' });

        const newMessage = document.createElement('div');
        newMessage.classList.add('sent', 'message');
        newMessage.innerHTML = `
            ${this.messages[this.messages.length - 1].text}
        `;
        this.chatBox.appendChild(newMessage);
    }

    sendRecipientResponse(responseText) {
        this.messages.push({ text: responseText, sender: 'other' });
        const newMessage = document.createElement('div');
        newMessage.classList.add('received', 'message');
        const renderedMarkdown = marked.parse(responseText);
        newMessage.innerHTML = renderedMarkdown;
        // newMessage.innerHTML = `
        //     ${this.messages[this.messages.length - 1].text}
        // `;
        this.chatBox.appendChild(newMessage);
        
        //this.speak(this.markdownToPlainText(responseText));

    }

    markdownToPlainText(markdown) {
        return marked.parse(markdown, { renderer: new marked.Renderer(), gfm: false });
      }
      

    removeWelcomeMessage() {
        if (this.welcomeMessageElement) {
            this.chatBox.appendChild(this.welcomeMessageElement);
            this.welcomeMessageElement.remove();
        }
    }
}

new ChatApplication();