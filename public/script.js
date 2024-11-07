const socket = io();

// DOM Elements
const messageInput = document.getElementById("message");
const usernameInput = document.getElementById("username");
const sendButton = document.getElementById("send");
const messagesContainer = document.getElementById("messages");
const typingIndicator = document.getElementById("typing-indicator");
const onlineCountElement = document.getElementById("online-count");

let username = "";

// Send Message Handler
sendButton.addEventListener("click", () => {
    const message = messageInput.value;
    username = usernameInput.value || "Anonymous";

    if (message.trim() !== "") {
        socket.emit("chatMessage", { username, message });
        messageInput.value = ""; // Clear input after sending
    }
});

// Listen for incoming messages
socket.on("chatMessage", (data) => {
    const messageElement = document.createElement("li");
    const timestamp = new Date().toLocaleTimeString();
    messageElement.innerHTML = `
        <div class="message-bubble ${data.username === username ? "self" : ""}">
            <span class="username">${data.username}</span>
            <span class="message">${data.message}</span>
            <span class="timestamp">${timestamp}</span>
        </div>
    `;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
});

// Typing Indicator
messageInput.addEventListener("input", () => {
    if (messageInput.value.trim() !== "") {
        socket.emit("typing", username);
    } else {
        socket.emit("typing", "");
    }
});

socket.on("typing", (data) => {
    if (data) {
        typingIndicator.style.display = "block";
    } else {
        typingIndicator.style.display = "none";
    }
});

// Update Online Users Count
socket.on("userCount", (count) => {
    onlineCountElement.innerText = `Users Online: ${count}`;
});
