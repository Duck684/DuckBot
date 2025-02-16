const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// List of offensive words or phrases (adjust as needed)
const offensiveWords = [
    "fuck", "bitch", "stupid", "idiot", "gay",
    "nigger", "nigga", "koshi", "n1gg3r", "n1gger", "n1gga", "n1ger", "niger", "useless farmer",
];

const responses = {
    "hello": ["Hi!", "Hello There!", "Hey, How's It Going?"],
    "how are you": ["I'm Feeling Good! How About You?", "Feeling Chatty!"],
    "what can you do": ["I Can Chat With You! I Can Also Help You Learn and Code!"],
    "bye": ["Goodbye!", "See You Later!", "Take Care!"],
    "thanks": ["You're Welcome!", "No Problem!", "Anytime!"],
    "tell me a joke": ["Why Don't Robots Get Tired? Because They Recharge!", 
                       "Why Did The AI Break Up? It Lost Its Connection!", 
                       "I Told My Computer A Joke… Now It Won’t Stop Laughing In Binary!"]
};

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

    // Handle specific queries
    if (input.includes("weather")) {
        return getWeatherInfo(input);
    }

    if (input.includes("time")) {
        return getCurrentTime();
    }

    if (input.includes("calculate")) {
        return performCalculation(input);
    }

    for (let key in responses) {
        if (input.includes(key)) {
            return responses[key][Math.floor(Math.random() * responses[key].length)];
        }
    }

    // If bot doesn't know, check Wikipedia
    return getWikipediaSummary(input);
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

function capitalizeWords(str) {
    return str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

// Wikipedia Fetching
function getWikipediaSummary(topic) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.extract) {
                return data.extract; // Return the Wikipedia summary
            }
            return "Sorry, I couldn't find any information on that topic.";
        })
        .catch(error => "Error fetching Wikipedia data: " + error.message);
}

// Weather API Fetching
function getWeatherInfo(input) {
    const apiKey = 'your-weather-api-key';  // Replace with actual API key
    const city = input.replace("weather in", "").trim();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.main) {
                return `The temperature in ${city} is ${data.main.temp}°C.`;
            }
            return "Sorry, I couldn't fetch the weather data.";
        })
        .catch(error => "Error fetching weather data: " + error.message);
}

// Time Fetching
function getCurrentTime() {
    const now = new Date();
    return `The current time is ${now.toLocaleTimeString()}.`;
}

// Simple Calculation (Basic Arithmetic)
function performCalculation(input) {
    try {
        let expression = input.replace("calculate", "").trim();
        let result = eval(expression);  // Evaluates the math expression
        return `The result is: ${result}`;
    } catch (error) {
        return "Sorry, I couldn't process the calculation.";
    }
}

userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
