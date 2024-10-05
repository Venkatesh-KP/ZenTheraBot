document.addEventListener("DOMContentLoaded", function() {
    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const chatbox = document.querySelector(".chatbox");
    const chatInput = document.querySelector(".chat-input textarea");

    class PsychologicalChatbot {
        constructor() {
            this.responses = [];
            this.questionIndex = 0;
            this.questions = [
                {
                    question: "Gender",
                    options: ["Male","Female","Other"]
                },
                {
                    question: "Educational qualification",
                    options: ["School","Higher education","Graduated"]
                },
                {
                    question: "Employment status",
                    options: ["Employed","Unemployed","Student"]
                },
                {
                    question: "How's your day been?",
                    options: ["Great!", "Not bad.", "Rough."]
                },
                {
                    question: "Any new hobbies?",
                    options: ["Yes!", "No, same old.", "Not interested."]
                },
                {
                    question: "Favorite way to unwind?",
                    options: ["Reading/watching TV.", "Walking/exercising.", "Hard to relax."]
                },
                {
                    question: "Any upcoming plans?",
                    options: ["Yes, exciting!", "Taking it day by day.", "Nothing to look forward to."]
                },
                {
                    question: "Feeling energized?",
                    options: ["Yes, very.", "Bit drained.", "Low energy."]
                },
                {
                    question: "Handling setbacks?",
                    options: ["Stay positive.", "Assess then react.", "Feel overwhelmed."]
                },
                {
                    question: "Sleeping well?",
                    options: ["Yes, feeling rested.", "Disrupted sleep.", "Trouble sleeping."]
                },
                {
                    question: "Staying focused?",
                    options: ["Yes, very.", "Bit distracted.", "Hard to focus."]
                },
                {
                    question: "Enjoy socializing?",
                    options: ["Love it!", "Enjoy but draining.", "Prefer solitude."]
                },
                {
                    question: "Any appetite changes?",
                    options: ["No, normal.", "Some changes.", "Significant changes."]
                }
            ];
            this.score = {
                stress: 0,
                anxiety: 0,
                depression: 0
            };
        }

        displayMessage(message, className) {
            const chatLi = document.createElement("li");
            chatLi.classList.add("chat", className);
            chatLi.innerHTML = `<p>${message}</p>`;
            chatbox.appendChild(chatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }

        async getBasicInfo() {
            this.displayMessage("Welcome to the Psychological Chatbot! ", "incoming");
            this.displayMessage("Please provide the following basic information", "incoming");
            this.name = await this.promptUser("Please enter your name:");
            this.displayMessage(` ${this.name}`, "outgoing"); // Display name
            this.age = await this.promptUser("Please enter your age:");
            this.displayMessage(` ${this.age}`, "outgoing"); // Display age
            
            this.askQuestion();
        }

        async promptUser(message) {
            return new Promise(resolve => {
                this.displayMessage(message, "incoming");
                chatInput.addEventListener("keydown", function handleKeyDown(e) {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        const userInput = chatInput.value.trim();
                        chatInput.value = "";
                        resolve(userInput);
                        chatInput.removeEventListener("keydown", handleKeyDown);
                    }
                });
            });
        }

        askQuestion() {
            const currentQuestion = this.questions[this.questionIndex];
            this.displayMessage(currentQuestion.question, "incoming");
            currentQuestion.options.forEach(option => {
                const optionBtn = document.createElement("button");
                optionBtn.textContent = option;
                optionBtn.classList.add("option-btn");
                optionBtn.addEventListener("click", () => this.handleUserResponse(option));
                chatbox.appendChild(optionBtn);
            });
        }

        handleUserResponse(response) {
            this.responses.push(response);
            this.displayMessage(` ${response}`, "outgoing");
            this.questionIndex++;
            if (this.questionIndex < this.questions.length) {
                if (this.questionIndex == 3) {
                    this.displayMessage("Thanks for providing your personal information!", "incoming");
                }
                this.askQuestion();
            } else {
                this.analyzeResponses(); // Analyze responses when all questions are answered
            }
        }

        analyzeResponses() {
            // Extract responses for analysis
            const responses = this.responses.map(response => response.toLowerCase());
        
            // Define scoring based on decision tree rules
            responses.forEach(response => {
                // Check for stress indicators
                if (response.includes("rough.") || response.includes("bit drained.") || response.includes("feel overwhelmed.") || response.includes("trouble sleeping.") || response.includes("bit distracted.")) {
                    this.score.stress++;
                }
        
                // Check for anxiety indicators
                if (response.includes("hard to relax.") || response.includes("low energy.") || response.includes("trouble sleeping.") || response.includes("bit distracted.")) {
                    this.score.anxiety++;
                }
        
                // Check for depression indicators
                if (response.includes("rough.") || response.includes("not interested.") || response.includes("nothing to look forward to.") || response.includes("feel overwhelmed.") || response.includes("hard to focus.") || response.includes("prefer solitude.") || response.includes("significant changes.")) {
                    this.score.depression++;
                }
            });
        
            // Determine the predicted issue based on the highest score
            let predictedIssue;
            if (this.score.stress > this.score.anxiety && this.score.stress > this.score.depression) {
                predictedIssue = "stress";
            } else if (this.score.anxiety > this.score.stress && this.score.anxiety > this.score.depression) {
                predictedIssue = "anxiety";
            } else if (this.score.depression > this.score.stress && this.score.depression > this.score.anxiety) {
                predictedIssue = "depression";
            } else {
                predictedIssue = "normal";
            }
        
            // Display the predicted issue in the chat interface
            let message;
            switch (predictedIssue) {
                case "stress":
                    message = "Based on your responses, it seems you might be experiencing stress.";
                    break;
                case "anxiety":
                    message = "Based on your responses, it seems you might be experiencing anxiety.";
                    break;
                case "depression":
                    message = "Based on your responses, it seems you might be experiencing depression.";
                    break;
                default:
                    message = "Based on your responses, there are no significant indicators of stress, anxiety, or depression.";
            }
            this.displayMessage(message, "incoming");
        
            // Display options to the user
            this.displayMessage("What would you like to do next?", "incoming");
            const videoOptionBtn = document.createElement("button");
            videoOptionBtn.textContent = "Watch Recommended Video";
            videoOptionBtn.classList.add("option-btn");
            videoOptionBtn.addEventListener("click", () => {
                this.video_recommendation(predictedIssue);
                // Optionally, you can also hide the buttons after the user makes a choice
                videoOptionBtn.style.display = "none";
                textOptionBtn.style.display = "none";
            });
            chatbox.appendChild(videoOptionBtn);
        
            const textOptionBtn = document.createElement("button");
            textOptionBtn.textContent = "Share More Feelings";
            textOptionBtn.classList.add("option-btn");
            textOptionBtn.addEventListener("click", () => {
                this.startConversation();
                // Optionally, you can also hide the buttons after the user makes a choice
                videoOptionBtn.style.display = "none";
                textOptionBtn.style.display = "none";
            });
            chatbox.appendChild(textOptionBtn);
        }
        
        video_recommendation(predictedIssue) {
            switch(predictedIssue) {
                case "anxiety":
                    this.displayMessage("Here are some anxiety relief videos:", "incoming");
                    this.displayMessage('<a href="https://youtu.be/9yj8mBfHlMk?si=lnxy1Xqz2BVELnd8" target="_blank">https://youtu.be/9yj8mBfHlMk?si=lnxy1Xqz2BVELnd8</a>', "incoming");
                    break;
                case "stress":
                    this.displayMessage("Here are some stress relief videos:", "incoming");
                    this.displayMessage('<a href="https://youtu.be/Nz9eAaXRzGg?si=dNEKVmxdkRiLDJ50" target="_blank">https://youtu.be/Nz9eAaXRzGg?si=dNEKVmxdkRiLDJ50</a>', "incoming");
                    break;
                case "depression":
                    this.displayMessage("Here are some depression relief videos:", "incoming");
                    this.displayMessage('<a href="https://youtu.be/O3Ku-cpdSJM?si=ZXlJ1VC1C35IUTZZ" target="_blank">https://youtu.be/O3Ku-cpdSJM?si=ZXlJ1VC1C35IUTZZ</a>', "incoming");   
                    break;
                default:
                    this.displayMessage("No videos recommended for the predicted issue.", "incoming");
            }
        }

        startConversation() {
            const handleChat = () => {
                const userMessage = chatInput.value.trim();
                if (!userMessage) return;

                chatInput.value = "";

                // Append the user's message to the chatbox
                this.displayMessage(userMessage, "outgoing");

                // Send the user message to the Flask server
                this.sendToFlask(userMessage);
            };

            chatInput.addEventListener("keydown", function handleKeyDown(e) {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleChat();
                }
            });
        }

        sendToFlask(userMessage) {
            // Send the user message to the Flask server using fetch or any preferred method
            fetch("/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: userMessage })
            })
            .then(response => response.json())
            .then(data => {
                const responseMessage = data.message;
                this.displayMessage(responseMessage, "incoming");
            })
            .catch(error => {
                console.error("Error:", error);
            });
        }
    }

    const psychChatbot = new PsychologicalChatbot();

    chatbotToggler.addEventListener("click", () => {
        document.body.classList.toggle("show-chatbot");
        psychChatbot.getBasicInfo();
    });
});
