// Quiz Questions Database and Engine for Robot Hero Mission

const QUIZ_DATABASE = {
    1: [ // Level 1: Dull Factory (Dull Jobs)
        {
            question: "What primary issue do humans face when performing 'Dull' robotic jobs?",
            options: [
                "They quickly lose concentration or suffer from mental fatigue, leading to errors.",
                "They are exposed to high radiation levels.",
                "They are required to perform complex micro-surgical incisions.",
                "They require specialized life support suits to survive."
            ],
            correct: 0,
            explanation: "Dull jobs are highly repetitive, monotonous, and predictable. Humans easily lose concentration or suffer from mental fatigue, leading to errors or repetitive strain injuries."
        },
        {
            question: "Which robot is a prominent real-world example of automating Dull item sorting in Amazon fulfillment centers?",
            options: [
                "Spot",
                "Lely Discovery",
                "Saab Seaeye Sabertooth",
                "Sparrow"
            ],
            correct: 3,
            explanation: "Amazon's Sparrow is an advanced robotic arm deployed in fulfillment centers to automate the highly repetitive task of item sorting."
        },
        {
            question: "Before the Sparrow robot was introduced, how did workers scan millions of products daily?",
            options: [
                "By using sonar scanners underwater.",
                "They had to manually look at, pick up, and scan each product from large bins.",
                "They relied on telepathic sensor data pads.",
                "They inspected the products remotely via satellite feeds."
            ],
            correct: 1,
            explanation: "Before Sparrow, human workers had to manually look at, pick up, and scan millions of individual products from large bins every single day."
        }
    ],
    2: [ // Level 2: Dirty Sewer (Dirty Jobs)
        {
            question: "What characterizes a 'Dirty' job in the context of robotics?",
            options: [
                "Jobs that are cheap and require low processing power.",
                "Jobs that require extreme microscopic precision under a microscope.",
                "Jobs in unsanitary, messy environments with exposure to fumes, waste, or contamination.",
                "Jobs where humans must perform remote inspections of nuclear reactors."
            ],
            correct: 2,
            explanation: "Dirty jobs take place in environments that are unsanitary, messy, or socially undesirable, often exposing workers to fumes, waste, or contamination."
        },
        {
            question: "Which robot is actively used on modern dairy farms to handle manure management?",
            options: [
                "Spot",
                "Lely Discovery",
                "da Vinci 5",
                "Sparrow"
            ],
            correct: 1,
            explanation: "The Lely Discovery is an autonomous mobile robot used on modern dairy farms to handle the endless, unhygienic chore of manure scraping."
        },
        {
            question: "Why do robots excel at handling Dirty jobs in sewage or farm environments?",
            options: [
                "Robots have no biological vulnerabilities or senses to offend.",
                "Robots are completely free to build and deploy.",
                "Robots can dissolve chemical wastes using laser modules.",
                "Robots require zero maintenance or waterproofing seals."
            ],
            correct: 0,
            explanation: "Robots are perfect for dirty jobs because they have no biological vulnerabilities and lack biological senses that can be offended by toxic or foul environments."
        }
    ],
    3: [ // Level 3: Dangerous Volcano (Dangerous Jobs)
        {
            question: "What is the primary benefit of deploying robots in 'Dangerous' jobs?",
            options: [
                "It eliminates the need for expensive structural materials.",
                "It keeps human lives out of harm's way in high-risk environments.",
                "It makes it easier to write simpler coding algorithms.",
                "It allows robots to clean up sewage waste autonomously."
            ],
            correct: 1,
            explanation: "Dangerous jobs are high-risk situations where human life or health is put in jeopardy. Deploying robots keeps humans out of harm's way."
        },
        {
            question: "Which quadruped robot is deployed to inspect decommissioned nuclear power plants?",
            options: [
                "Sparrow",
                "Lely Discovery",
                "Spot",
                "Saab Seaeye Sabertooth"
            ],
            correct: 2,
            explanation: "Spot, the quadruped robot developed by Boston Dynamics, is actively deployed to inspect high-risk sites like decommissioned nuclear power plants."
        },
        {
            question: "How does sending Boston Dynamics' Spot into decommissioned nuclear facilities protect engineers?",
            options: [
                "Spot can absorb and neutralize all atomic radiation instantly.",
                "Spot generates a local cooling field to prevent explosions.",
                "Engineers can monitor vitals remotely without exposure to radiation.",
                "Spot repairs radioactive fuel lines autonomously using a weld torch."
            ],
            correct: 2,
            explanation: "By sending Spot into high-risk areas, human engineers can safely monitor the facility's vitals from miles away without ever exposing themselves to toxic radiation."
        }
    ],
    4: [ // Level 4: Dear Deep Sea (Dear Jobs)
        {
            question: "What does the term 'Dear' mean when referring to robotics jobs?",
            options: [
                "Jobs that involve interacting affectionately with wildlife.",
                "Jobs that are costly in terms of time, resources, or specialized human capital.",
                "Jobs that are extremely low cost and simple to run.",
                "Jobs that are restricted to public school classrooms."
            ],
            correct: 1,
            explanation: "In robotics, 'dear' means costly in terms of time, resources, or specialized human capital. Automation helps democratize access and lower these operational costs."
        },
        {
            question: "Why does sending human crews to inspect the deep ocean or outer space turn into a multi-million-dollar logistical challenge?",
            options: [
                "Because they require specialized survival gear, transport vessels, liability insurance, and rare experts.",
                "Because deep sea creatures eat regular research equipment.",
                "Because wireless radio communications are completely free of charge.",
                "Because human workers demand heavy protective metal shielding against gravity."
            ],
            correct: 0,
            explanation: "Human operations in extreme areas require specialized survival gear, transport vessels, heavy liability insurance, and highly rare technical experts, driving up costs."
        },
        {
            question: "Which hybrid autonomous underwater vehicle (AUV) is a prime example of mitigating 'Dear' costs in deep-sea energy exploration?",
            options: [
                "Lely Discovery",
                "Saab Seaeye Sabertooth",
                "Spot Explorer",
                "da Vinci 5"
            ],
            correct: 1,
            explanation: "The Saab Seaeye Sabertooth is a hybrid autonomous underwater vehicle (AUV) used extensively in deep-sea energy and oil exploration to mitigate high subsea inspection costs."
        }
    ],
    5: [ // Level 5: Difficult Surgery (Difficult Jobs)
        {
            question: "What defines a 'Difficult' job in the context of robotics?",
            options: [
                "Jobs that are performed under heavy rain or wind.",
                "Tasks that require an extreme level of physical precision, endurance, or intricate maneuvers that push human biological limits.",
                "Monotonous and predictable tasks like sorting mail.",
                "Deep-sea oil exploration under immense water pressure."
            ],
            correct: 1,
            explanation: "Difficult jobs require an extreme level of physical precision, endurance, or intricate maneuvers that push the absolute limits of human capability."
        },
        {
            question: "What biological bottleneck do human surgeons have that laparoscopic robotic systems help eliminate?",
            options: [
                "The inability to remember the patient's medical history.",
                "A natural fear of sharp surgical tools.",
                "Microscopic, involuntary hand tremors and fatigue.",
                "Slow reflexes when responding to flashing monitors."
            ],
            correct: 2,
            explanation: "Even the most skilled surgeons suffer from microscopic involuntary hand tremors, physical fatigue, and limitations of eyesight and joint geometry."
        },
        {
            question: "Which advanced surgical system is actively used globally to perform complex laparoscopic operations?",
            options: [
                "da Vinci 5",
                "Seaeye Sabertooth",
                "Amazon Sparrow",
                "Spot Medic"
            ],
            correct: 0,
            explanation: "The da Vinci 5 surgical system is a leading real-world medical robot actively used in operating rooms worldwide to perform high-precision laparoscopic surgeries."
        }
    ]
};

class QuizEngine {
    constructor() {
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.level = 1;
        this.correctCount = 0;
        this.onCompleteCallback = null;
    }

    // Initialize a quiz for a specific level
    startQuiz(levelNum, onComplete) {
        this.level = levelNum;
        this.onCompleteCallback = onComplete;
        this.currentQuestionIndex = 0;
        this.correctCount = 0;
        
        // Get all questions for level
        const allQuestions = QUIZ_DATABASE[levelNum];
        
        // Pick 3 random questions
        this.currentQuestions = this.shuffleArray([...allQuestions]).slice(0, 3);
        
        // Render first question
        this.renderQuestion();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    renderQuestion() {
        const modal = document.getElementById("quiz-modal");
        const container = document.getElementById("quiz-container");
        if (!modal || !container) return;

        // Make sure modal is visible
        modal.classList.remove("hidden");

        const q = this.currentQuestions[this.currentQuestionIndex];
        const progressPercent = ((this.currentQuestionIndex) / 3) * 100;

        container.innerHTML = `
            <div class="quiz-header">
                <h3>Sector ${this.level} Quiz: Question ${this.currentQuestionIndex + 1} of 3</h3>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
                </div>
            </div>
            <div class="quiz-question">${this.escapeHTML(q.question)}</div>
            <div class="quiz-options">
                ${q.options.map((opt, idx) => `
                    <button class="quiz-opt-btn" onclick="quizEngine.selectAnswer(${idx})">
                        <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
                        <span class="opt-text">${this.escapeHTML(opt)}</span>
                    </button>
                `).join("")}
            </div>
            <div id="quiz-feedback" class="quiz-feedback hidden"></div>
        `;
    }

    selectAnswer(selectedIndex) {
        const q = this.currentQuestions[this.currentQuestionIndex];
        const feedbackDiv = document.getElementById("quiz-feedback");
        const optionBtns = document.querySelectorAll(".quiz-opt-btn");
        if (!feedbackDiv) return;

        // Disable options
        optionBtns.forEach(btn => btn.disabled = true);

        const isCorrect = selectedIndex === q.correct;
        if (isCorrect) {
            this.correctCount++;
            window.sounds.playCorrect();
            optionBtns[selectedIndex].classList.add("correct-choice");
            feedbackDiv.className = "quiz-feedback correct-feedback";
            feedbackDiv.innerHTML = `
                <div class="feedback-title">🏆 Correct! (+100 pts)</div>
                <p class="feedback-explanation">${this.escapeHTML(q.explanation)}</p>
                <button class="primary-btn quiz-next-btn" onclick="quizEngine.nextQuestion()">Next Question</button>
            `;
        } else {
            window.sounds.playWrong();
            optionBtns[selectedIndex].classList.add("wrong-choice");
            optionBtns[q.correct].classList.add("correct-choice"); // Show correct answer
            feedbackDiv.className = "quiz-feedback wrong-feedback";
            feedbackDiv.innerHTML = `
                <div class="feedback-title">❌ Incorrect</div>
                <p class="feedback-explanation">${this.escapeHTML(q.explanation)}</p>
                <button class="primary-btn quiz-next-btn" onclick="quizEngine.nextQuestion()">Next Question</button>
            `;
        }

        feedbackDiv.classList.remove("hidden");
    }

    nextQuestion() {
        window.sounds.playClick();
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < 3) {
            this.renderQuestion();
        } else {
            this.finishQuiz();
        }
    }

    finishQuiz() {
        const modal = document.getElementById("quiz-modal");
        const container = document.getElementById("quiz-container");
        if (!modal || !container) return;

        const pointsEarned = this.correctCount * 100;
        let bonusPoints = 0;
        let scoreText = `${this.correctCount} / 3 Correct! You earned +${pointsEarned} points.`;
        
        if (this.correctCount === 3) {
            bonusPoints = 150;
            scoreText = `🎉 Perfect Score! 3 / 3 Correct! You earned +${pointsEarned} points + a +${bonusPoints} Perfect Score Bonus!`;
            window.sounds.playVictoryFanfare();
        }

        container.innerHTML = `
            <div class="quiz-results">
                <h2>Quiz Completed!</h2>
                <div class="results-badge">${this.correctCount} / 3</div>
                <p class="results-text">${scoreText}</p>
                <button class="primary-btn" onclick="quizEngine.complete(${pointsEarned + bonusPoints}, ${this.correctCount})">Return to Mission Command</button>
            </div>
        `;
    }

    complete(totalPointsGained, correctAnswersCount) {
        const modal = document.getElementById("quiz-modal");
        if (modal) {
            modal.classList.add("hidden");
        }
        if (this.onCompleteCallback) {
            this.onCompleteCallback(totalPointsGained, correctAnswersCount);
        }
    }

    escapeHTML(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

const quizEngine = new QuizEngine();
window.quizEngine = quizEngine;
