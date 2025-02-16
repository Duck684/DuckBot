const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// List of offensive words or phrases
const offensiveWords = [
    "fuck", "bitch", "stupid", "idiot", "gay",
    "nigger", "nigga", "koshi", "n1gg3r", "n1gger", "n1gga", "n1ger", "niger", "useless farmer"
];

const responses = {
    "hello": ["Hi!", "Hello There!", "Hey, How's It Going?"],
    "how are you": ["I'm Feeling Good! How About You?", "Feeling Chatty!"],
    "what can you do": ["I Can Chat With You! I Can Also Help You Learn Python!"],
    "bye": ["Goodbye!", "See You Later!", "Take Care!"],
    "thanks": ["You're Welcome!", "No Problem!", "Anytime!"],
    "tell me a joke": ["Why Don't Robots Get Tired? Because They Recharge!", 
                       "Why Did The AI Break Up? It Lost Its Connection!", 
                       "I Told My Computer A Joke… Now It Won’t Stop Laughing In Binary!"]
};

// Load stored responses from localStorage
const storedResponses = JSON.parse(localStorage.getItem("chatbotResponses")) || {};

function sendMessage() {
    let message = userInput.value.trim().toLowerCase();
    console.log("User input:", message);  // Debugging the user input

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
            return responses[key][Math.floor(Math.random() * responses[key].length)];
        }
    }

    // Ask the user for a response and store it
    let newResponse = prompt(`I Don't Understand "${input}". What Should I Reply?`);
    if (newResponse) {
        storedResponses[input] = newResponse;
        localStorage.setItem("chatbotResponses", JSON.stringify(storedResponses));
    }

    return newResponse || "I Don't Know That Yet!";
}

// Function to check if the input contains offensive language
function containsOffensiveLanguage(input) {
    console.log("Checking for offensive language in:", input);  // Debugging check
    for (let word of offensiveWords) {
        if (input.includes(word.toLowerCase())) {
            console.log("Offensive word found:", word);  // Debugging the offensive word
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
