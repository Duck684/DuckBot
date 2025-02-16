const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// List of offensive words or phrases
const offensiveWords = [
    "fuck", "bitch", "stupid", "idiot", "gay",
    "nigger", "nigga", "koshi", "n1gg3r", "n1gger", "n1gga", "n1ger", "niger", "useless farmer"
];

const historyEvents = {
    "world war 1": "World War 1 lasted from 1914 to 1918. It involved most of the world's great powers, leading to major political changes.",
    "world war 2": "World War 2 lasted from 1939 to 1945. It was the deadliest and most widespread war in history.",
    "moon landing": "On July 20, 1969, Apollo 11 astronauts Neil Armstrong and Buzz Aldrin became the first humans to land on the Moon.",
    "american revolution": "The American Revolution (1775–1783) was the war in which the 13 American colonies gained independence from Great Britain.",
    "french revolution": "The French Revolution (1789–1799) was a period of radical social and political change in France.",
    "fall of the berlin wall": "The Berlin Wall fell on November 9, 1989, marking the end of the Cold War and the reunification of Germany.",
    "invention of the telephone": "Alexander Graham Bell patented the telephone on March 7, 1876, changing communication forever."
};

let history = [];

// Fun Facts
const funFacts = [
    "Did you know? Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old!",
    "A group of flamingos is called a 'flamboyance'.",
    "Bananas are berries, but strawberries aren't!",
    "The Eiffel Tower can grow by 6 inches in the summer due to the expansion of the iron."
];

// Math Responses (Improved)
const mathResponses = {
    "add": (a, b) => a + b,
    "subtract": (a, b) => a - b,
    "multiply": (a, b) => a * b,
    "divide": (a, b) => a / b,
    "power": (a, b) => Math.pow(a, b),
    "sqrt": (a) => Math.sqrt(a)
};

// Basic chat responses
const responses = {
    "hello": ["Hi!", "Hello There!", "Hey, How's It Going?"],
    "how are you": ["I'm feeling good! How about you?", "Feeling chatty!"],
    "what can you do": ["I can chat, play games, give fun facts, solve math problems, and tell you world history!"],
    "bye": ["Goodbye!", "See you later!", "Take care!"],
    "thanks": ["You're welcome!", "No problem!", "Anytime!"],
    "tell me a fun fact": funFacts[Math.floor(Math.random() * funFacts.length)],
    "give me a math question": "Sure! Ask me anything related to math!",
};

// Load stored responses from localStorage
const storedResponses = JSON.parse(localStorage.getItem("chatbotResponses")) || {};

function sendMessage() {
    let message = userInput.value.trim().toLowerCase();
    if (message === "") return;

    // Check for offensive language
    if (containsOffensiveLanguage(message)) {
        addMessage("Please refrain from using inappropriate language.", "bot");
        userInput.value = "";
        return;
    }

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

    for (let key in responses) {
        if (input.includes(key)) {
            return responses[key];
        }
    }

    // World History responses
    for (let key in historyEvents) {
        if (input.includes(key)) {
            return historyEvents[key];
        }
    }

    // Ask the user for a response and store it
    let newResponse = prompt(`I don't understand "${input}". What should I reply?`);
    if (newResponse) {
        storedResponses[input] = newResponse;
        localStorage.setItem("chatbotResponses", JSON.stringify(storedResponses));
    }

    return newResponse || "I don't know that yet!";
}

// Function to check if the input contains offensive language
function containsOffensiveLanguage(input) {
    for (let word of offensiveWords) {
        if (input.includes(word)) {
            return true;
        }
    }
    return false;
}

// Capitalize every word in a string
function capitalizeWords(str) {
    return str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
