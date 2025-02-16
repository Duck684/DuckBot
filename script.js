const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// Predefined responses to common queries
const responses = {
    "hello": ["Hi!", "Hello! How's it going?", "Hey, how are you?"],
    "how are you": ["I'm doing well, thanks! How about you?", "Feeling great, how about yourself?"],
    "what can you do": ["I can chat with you, tell jokes, help you with basic math, and have fun conversations!"],
    "bye": ["Goodbye! Talk to you soon!", "Take care, see you later!"],
    "thanks": ["You're welcome!", "No problem!", "Anytime!"],
    "tell me a joke": ["Why don't robots ever panic? They have a lot of cache!", 
                       "Why did the computer catch a cold? It left its Windows open!", 
                       "I told my computer I needed a break, now it won't stop sending me error messages!"],
    "who is the president of the united states": ["The current president of the United States is Joe Biden."],
    "what is the capital of france": ["The capital of France is Paris."],
    "what is the largest planet in our solar system": ["The largest planet in our solar system is Jupiter."],
    "who invented the telephone": ["The telephone was invented by Alexander Graham Bell in 1876."],
    "what is photosynthesis": ["Photosynthesis is the process by which plants use sunlight to synthesize foods from carbon dioxide and water."],
    "what is the speed of light": ["The speed of light in a vacuum is approximately 299,792 kilometers per second."],
    "who wrote romeo and juliet": ["Romeo and Juliet was written by William Shakespeare in 1597."],
    "what is the largest ocean": ["The largest ocean on Earth is the Pacific Ocean."],
    "what is the tallest mountain": ["The tallest mountain in the world is Mount Everest, which stands at 8,848 meters above sea level."]
};

// Load stored responses from localStorage for learned responses
const storedResponses = JSON.parse(localStorage.getItem("chatbotResponses")) || {};

function sendMessage() {
    let message = userInput.value.trim().toLowerCase();
    if (message === "") return;

    addMessage(capitalizeWords(message), "user");

    let response = getResponse(message);
    setTimeout(() => addMessage(capitalizeWords(response), "bot"), 500);

    userInput.value = "";
}

function addMessage(text, sender) {
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", sender);
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getResponse(input) {
    if (storedResponses[input]) {
        return storedResponses[input]; // Use learned responses
    }

    // Check if the input is a math equation
    let mathResult = solveMath(input);
    if (mathResult !== null) {
        return `The answer is: ${mathResult}`;
    }

    // Match input with predefined responses for common knowledge
    for (let key in responses) {
        if (input.includes(key)) {
            return responses[key][Math.floor(Math.random() * responses[key].length)];
        }
    }

    // If the input doesn't match anything, ask the user how the bot should respond
    let newResponse = prompt(`I Don't Understand "${input}". What Should I Reply?`);
    if (newResponse) {
        storedResponses[input] = newResponse;
        localStorage.setItem("chatbotResponses", JSON.stringify(storedResponses));
    }

    return newResponse || "I Don't Know That Yet!";
}

function solveMath(question) {
    // Check for simple math operations
    let mathRegex = /(\d+)\s*([\+\-\*\/])\s*(\d+)/;
    let match = question.match(mathRegex);

    if (match) {
        let num1 = parseInt(match[1]);
        let operator = match[2];
        let num2 = parseInt(match[3]);

        switch (operator) {
            case "+": return num1 + num2;
            case "-": return num1 - num2;
            case "*": return num1 * num2;
            case "/": return num2 !== 0 ? (num1 / num2).toFixed(2) : "Can't divide by zero!";
        }
    }
    return null;
}

function capitalizeWords(str) {
    return str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

// Send an initial greeting when the chat starts
