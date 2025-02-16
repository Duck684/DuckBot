const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// Offensive words list (for filtering inappropriate content)
const offensiveWords = [
    "fuck", "bitch", "stupid", "idiot", "gay", "nigger", "nigga"
];

const responses = {
    "hello": ["Hi!", "Hello!", "How can I help you today?"],
    "weather": getWeather,
    "history": worldHistory,
    "current time": getCurrentTime,
    "math": performMathOperation,
    "trivia": triviaGame.start,
    "news": getLatestNews,
    "wikipedia": getWikipediaSummary,
    "learn": learnFromUser
};

// Example World History facts
const worldHistory = {
    "world war 1": "World War 1 was a global war that lasted from 1914 to 1918. It involved most of the world's great powers and led to major political changes.",
    "world war 2": "World War 2 lasted from 1939 to 1945 and was the deadliest conflict in human history, involving most of the world's nations."
};

// Example trivia questions
const triviaQuestions = [
    { question: "What is the capital of France?", answer: "Paris" },
    { question: "Who developed the theory of relativity?", answer: "Albert Einstein" },
    { question: "What is the largest mammal?", answer: "Blue Whale" }
];

// Trivia Game Object
let triviaGame = {
    currentQuestion: null,
    start: function() {
        this.currentQuestion = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
        return this.currentQuestion.question;
    },
    checkAnswer: function(input) {
        if (this.currentQuestion && input.toLowerCase() === this.currentQuestion.answer.toLowerCase()) {
            return "Correct! Well done!";
        } else {
            return "Oops! That's not right. Try again!";
        }
    }
};

// Function to get current time
function getCurrentTime() {
    let date = new Date();
    return date.toLocaleString(); // Display current time in a readable format
}

// Function to perform math operation
function performMathOperation(input) {
    const math = require('mathjs');
    try {
        return math.evaluate(input);
    } catch (e) {
        return "Error performing math operation!";
    }
}

// Function to get weather using OpenWeatherMap API
function getWeather(city) {
    const apiKey = 'your_api_key'; // Get from OpenWeatherMap
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                return `The weather in ${data.name} is currently ${data.weather[0].description} with a temperature of ${data.main.temp}°C.`;
            } else {
                return "Sorry, I couldn't fetch the weather data.";
            }
        })
        .catch(error => "Error fetching weather data: " + error.message);
}

// Function to get latest news
function getLatestNews() {
    const apiKey = 'your_news_api_key'; // Get from NewsAPI
    const url = `https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&country=us`;
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            let articles = data.articles.slice(0, 3);
            return articles.map(article => `${article.title} - ${article.source.name}`).join("\n");
        })
        .catch(error => "Error fetching news: " + error.message);
}

// Function to get summary from Wikipedia
function getWikipediaSummary(topic) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
    return fetch(url)
        .then(response => response.json())
        .then(data => data.extract || "No summary found.")
        .catch(error => "Error fetching Wikipedia data: " + error.message);
}

// Function to check if message contains offensive language
function containsOffensiveLanguage(input) {
    for (let word of offensiveWords) {
        if (input.includes(word)) {
            return true;
        }
    }
    return false;
}

// Function to send the message
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

// Function to add a message to the chat
function addMessage(text, sender) {
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", sender);
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to get response based on user input
function getResponse(input) {
    if (responses[input]) {
        return responses[input];
    }

    // Search for history responses
    for (let key in worldHistory) {
        if (input.includes(key)) {
            return worldHistory[key];
        }
    }

    // Trivia game check
    if (input === "trivia") {
        return triviaGame.start();
    }

    // Check if user asked for weather
    if (input.includes("weather")) {
        let city = input.split("weather in ")[1];
        if (city) {
            return getWeather(city);
        } else {
            return "Please specify a city for weather.";
        }
    }

    // Check for math operations
    if (input.includes("math")) {
        let operation = input.split("math ")[1];
        return performMathOperation(operation);
    }

    // Check for news updates
    if (input.includes("news")) {
        return getLatestNews();
    }

    // Wikipedia query
    if (input.includes("wikipedia")) {
        let topic = input.split("wikipedia ")[1];
        return getWikipediaSummary(topic);
    }

    return "I don't know that yet.";
}

// Function to capitalize every word in a string
function capitalizeWords(str) {
    return str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

// Function to store responses for learning
function learnFromUser(input, response) {
    storedResponses[input] = response;
    localStorage.setItem("chatbotResponses", JSON.stringify(storedResponses));
}

// Event listener for user input
userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
