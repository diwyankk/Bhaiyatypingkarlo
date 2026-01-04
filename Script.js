// Paragraph database
const englishParagraphs = [
    { id: 1, title: "Basic Introduction", text: "Welcome to the typing test. This paragraph helps you practice basic typing skills.", length: "short" },
    { id: 2, title: "Technology", text: "Technology transforms how we live and work. Innovations like AI and smartphones reshape our world daily.", length: "medium" },
    { id: 3, title: "Education", text: "Education is the foundation of personal and societal growth. It empowers individuals and builds better communities.", length: "medium" },
    { id: 4, title: "Health & Fitness", text: "Regular exercise, balanced diet, and proper sleep are essential for maintaining good health and wellbeing.", length: "medium" },
    { id: 5, title: "Long: Internet History", text: "The internet began as ARPANET in the 1960s. Today, it connects billions worldwide and powers modern life through websites, apps, and cloud services.", length: "long" }
];

const hindiParagraphs = [
    { id: 101, title: "बुनियादी परिचय", text: "टाइपिंग टेस्ट में आपका स्वागत है। यह पैराग्राफ आपको बुनियादी टाइपिंग कौशल का अभ्यास करने में मदद करता है।", length: "short" },
    { id: 102, title: "शिक्षा", text: "शिक्षा व्यक्तिगत और सामाजिक विकास की नींव है। यह व्यक्तियों को सशक्त बनाती है और बेहतर समुदायों का निर्माण करती है।", length: "medium" },
    { id: 103, title: "स्वास्थ्य", text: "नियमित व्यायाम, संतुलित आहार और उचित नींद अच्छे स्वास्थ्य और कल्याण को बनाए रखने के लिए आवश्यक हैं।", length: "medium" },
    { id: 104, title: "प्रौद्योगिकी", text: "प्रौद्योगिकी हमारे जीने और काम करने के तरीके को बदल देती है। नवाचार हर दिन हमारी दुनिया को नया आकार देते हैं।", length: "medium" },
    { id: 105, title: "भारत", text: "भारत विविधताओं वाला देश है जहाँ अलग-अलग संस्कृतियाँ, भाषाएँ और परंपराएँ सद्भाव से सह-अस्तित्व में हैं।", length: "long" }
];

// Typing Test Variables
let currentParagraphs = englishParagraphs;
let selectedParagraph = englishParagraphs[0];
let testActive = false;
let testPaused = false;
let timeElapsed = 0;
let timerInterval = null;
let clockMode = 'timer';
let backspaceCount = 0;

// Game Variables
let currentGame = null;
let gameInterval = null;
let gameWords = ['apple', 'banana', 'computer', 'keyboard', 'internet', 'programming', 'developer', 'website', 'software', 'hardware', 'network', 'system', 'database', 'security', 'mobile'];
let gameScore = 0;
let gameTime = 60;

// DOM Elements Cache
let elements = {};

// Initialize Application
function initApp() {
    cacheElements();
    renderParagraphs();
    setupEventListeners();
    updateParagraphDisplay();
    
    // Fast loading - hide loading screen quickly
    window.addEventListener('load', function() {
        setTimeout(function() {
            document.getElementById('loadingScreen').style.opacity = '0';
            setTimeout(function() {
                document.getElementById('loadingScreen').style.display = 'none';
            }, 500);
        }, 500);
    });
}

// Cache DOM elements
function cacheElements() {
    elements = {
        paragraphList: document.getElementById('paragraphList'),
        paragraphDisplay: document.getElementById('paragraphDisplay'),
        typingArea: document.getElementById('typingArea'),
        startBtn: document.getElementById('startBtn'),
        resetBtn: document.getElementById('resetBtn'),
        pauseBtn: document.getElementById('pauseBtn'),
        timer: document.getElementById('timer'),
        resultsSection: document.getElementById('resultsSection'),
        englishBtn: document.getElementById('englishBtn'),
        hindiBtn: document.getElementById('hindiBtn'),
        timerClockBtn: document.getElementById('timerClockBtn'),
        freeClockBtn: document.getElementById('freeClockBtn'),
        wpmResult: document.getElementById('wpmResult'),
        accuracyResult: document.getElementById('accuracyResult'),
        timeResult: document.getElementById('timeResult'),
        wordsResult: document.getElementById('wordsResult'),
        tabBtns: document.querySelectorAll('.tab-btn'),
        tabContents: document.querySelectorAll('.tab-content'),
        gamesSelection: document.getElementById('gamesSelection'),
        speedGame: document.getElementById('speedGame'),
        shootingGame: document.getElementById('shootingGame'),
        gameScore: document.getElementById('gameScore'),
        gameTime: document.getElementById('gameTime'),
        gameInput: document.getElementById('gameInput'),
        speedGameArea: document.getElementById('speedGameArea'),
        shootingGameArea: document.getElementById('shootingGameArea'),
        shootingScore: document.getElementById('shootingScore'),
        targetWord: document.getElementById('targetWord'),
        shootingAccuracy: document.getElementById('shootingAccuracy'),
        wordsTyped: document.getElementById('wordsTyped')
    };
}

// Render paragraphs list
function renderParagraphs() {
    elements.paragraphList.innerHTML = '';
    currentParagraphs.forEach(para => {
        const card = document.createElement('div');
        card.className = 'paragraph-card';
        if (para.id === selectedParagraph.id) card.classList.add('active');
        card.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 5px;">${para.title}</div>
            <div style="font-size: 0.9rem; color: #64748b; margin-bottom: 8px;">${para.text.substring(0, 60)}...</div>
            <span style="background: #e2e8f0; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem;">${para.length}</span>
        `;
        card.onclick = () => selectParagraph(para);
        elements.paragraphList.appendChild(card);
    });
}

// Select paragraph
function selectParagraph(para) {
    selectedParagraph = para;
    renderParagraphs();
    updateParagraphDisplay();
    if (testActive) resetTest();
}

// Update paragraph display
function updateParagraphDisplay() {
    elements.paragraphDisplay.innerHTML = '';
    const text = selectedParagraph.text;
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i];
        elements.paragraphDisplay.appendChild(span);
    }
}

// Switch language
function switchLanguage(lang) {
    document.querySelectorAll('.selector-btn').forEach(btn => btn.classList.remove('active'));
    if (lang === 'english') {
        elements.englishBtn.classList.add('active');
        currentParagraphs = englishParagraphs;
    } else {
        elements.hindiBtn.classList.add('active');
        currentParagraphs = hindiParagraphs;
    }
    selectedParagraph = currentParagraphs[0];
    renderParagraphs();
    updateParagraphDisplay();
    resetTest();
}

// Switch clock mode
function switchClockMode(mode) {
    clockMode = mode;
    document.querySelectorAll('.selector-btn').forEach(btn => btn.classList.remove('active'));
    if (mode === 'timer') {
        elements.timerClockBtn.classList.add('active');
        elements.timer.classList.remove('free');
    } else {
        elements.freeClockBtn.classList.add('active');
        elements.timer.classList.add('free');
    }
    resetTest();
}

// Start typing test
function startTest() {
    if (testActive) return;
    
    testActive = true;
    testPaused = false;
    timeElapsed = 0;
    backspaceCount = 0;
    
    elements.startBtn.disabled = true;
    elements.resetBtn.disabled = false;
    elements.pauseBtn.disabled = false;
    elements.typingArea.disabled = false;
    elements.typingArea.value = '';
    elements.typingArea.focus();
    elements.resultsSection.style.display = 'none';
    
    updateTimerDisplay();
    timerInterval = setInterval(updateTimer, 1000);
    
    updateHighlighting();
}

// Update timer
function updateTimer() {
    if (!testActive || testPaused) return;
    
    timeElapsed++;
    updateTimerDisplay();
    
    // Check completion in timer mode
    if (clockMode === 'timer' && elements.typingArea.value.length >= selectedParagraph.text.length) {
        finishTest();
    }
}

// Update timer display
function updateTimerDisplay() {
    const mins = Math.floor(timeElapsed / 60).toString().padStart(2, '0');
    const secs = (timeElapsed % 60).toString().padStart(2, '0');
    elements.timer.textContent = `${mins}:${secs}`;
}

// Pause/resume test
function pauseTest() {
    if (!testActive) return;
    
    testPaused = !testPaused;
    elements.typingArea.disabled = testPaused;
    elements.pauseBtn.innerHTML = testPaused ? 
        '<i class="fas fa-play"></i> Resume' : 
        '<i class="fas fa-pause"></i> Pause';
    
    if (testPaused) {
        clearInterval(timerInterval);
    } else {
        elements.typingArea.focus();
        timerInterval = setInterval(updateTimer, 1000);
    }
}

// Reset test
function resetTest() {
    testActive = false;
    testPaused = false;
    clearInterval(timerInterval);
    
    elements.startBtn.disabled = false;
    elements.resetBtn.disabled = true;
    elements.pauseBtn.disabled = true;
    elements.pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    elements.typingArea.disabled = true;
    elements.typingArea.value = '';
    elements.timer.textContent = '00:00';
    elements.resultsSection.style.display = 'none';
    
    updateParagraphDisplay();
}

// Update highlighting
function updateHighlighting() {
    const typed = elements.typingArea.value;
    const original = selectedParagraph.text;
    const spans = elements.paragraphDisplay.querySelectorAll('span');
    
    for (let i = 0; i < spans.length; i++) {
        spans[i].className = '';
        if (i < typed.length) {
            spans[i].classList.add(typed[i] === original[i] ? 'correct-char' : 'incorrect-char');
        } else if (i === typed.length) {
            spans[i].classList.add('current-char');
        }
    }
    
    // Check completion
    if (typed.length >= original.length) {
        finishTest();
    }
}

// Finish test and show results
function finishTest() {
    testActive = false;
    clearInterval(timerInterval);
    
    const typed = elements.typingArea.value;
    const original = selectedParagraph.text;
    const timeInMinutes = timeElapsed / 60;
    const wordCount = typed.trim().split(/\s+/).length;
    const wpm = timeInMinutes > 0 ? Math.round(wordCount / timeInMinutes) : 0;
    
    // Calculate accuracy
    let correct = 0;
    for (let i = 0; i < Math.min(typed.length, original.length); i++) {
        if (typed[i] === original[i]) correct++;
    }
    const accuracy = original.length > 0 ? Math.round((correct / original.length) * 100) : 0;
    
    // Update results
    elements.wpmResult.textContent = wpm;
    elements.accuracyResult.textContent = `${accuracy}%`;
    elements.timeResult.textContent = `${timeElapsed}s`;
    elements.wordsResult.textContent = wordCount;
    
    // Show results
    elements.resultsSection.style.display = 'block';
    elements.typingArea.disabled = true;
    elements.pauseBtn.disabled = true;
}

// Load exercise
function loadExercise(text, title) {
    const exercise = { id: 0, title: title, text: text, length: 'exercise' };
    selectParagraph(exercise);
    switchTab('typing-test');
    startTest();
}

// Load exam practice
function loadExamPractice(type) {
    const exams = {
        'SSC': 'The Staff Selection Commission conducts various examinations for recruitment to different posts in government departments and ministries.',
        'Banking': 'Banking exams test candidates on quantitative aptitude, reasoning, English language, computer knowledge, and general awareness.',
        'Railway': 'Railway Recruitment Board conducts exams for various posts in Indian Railways, the largest employer in India.',
        'UPSSSC': 'Uttar Pradesh Subordinate Services Selection Commission conducts exams for various state government posts in Uttar Pradesh.'
    };
    
    const examText = exams[type] || 'Practice typing for government examinations to improve your speed and accuracy.';
    loadExercise(examText, `${type} Exam Practice`);
}

// Switch tabs
function switchTab(tabId) {
    // Hide all tab contents
    elements.tabContents.forEach(content => content.classList.remove('active'));
    // Remove active class from all tab buttons
    elements.tabBtns.forEach(btn => btn.classList.remove('active'));
    // Show selected tab content
    document.getElementById(tabId).classList.add('active');
    // Add active class to clicked tab button
    document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
    
    // Exit game if leaving games tab
    if (tabId !== 'typing-games') {
        exitGame();
    }
}

// Start game
function startGame(gameType) {
    currentGame = gameType;
    elements.gamesSelection.style.display = 'none';
    
    if (gameType === 'speed') {
        elements.speedGame.classList.add('active');
        startSpeedGame();
    } else if (gameType === 'shooting') {
        elements.shootingGame.classList.add('active');
        startShootingGame();
    }
}

// Exit game
function exitGame() {
    if (currentGame === 'speed') {
        stopSpeedGame();
        elements.speedGame.classList.remove('active');
    } else if (currentGame === 'shooting') {
        stopShootingGame();
        elements.shootingGame.classList.remove('active');
    }
    
    elements.gamesSelection.style.display = 'block';
    currentGame = null;
}

// Speed Typing Game
let fallingWords = [];
let wordSpeed = 3;

function startSpeedGame() {
    gameScore = 0;
    gameTime = 60;
    wordSpeed = 3;
    fallingWords = [];
    
    elements.gameScore.textContent = '0';
    elements.gameTime.textContent = '60';
    elements.wordsTyped.textContent = '0';
    elements.gameInput.value = '';
    elements.speedGameArea.innerHTML = '';
    
    // Start game loop
    gameInterval = setInterval(updateSpeedGame, 100);
    
    // Start timer
    const timer = setInterval(() => {
        gameTime--;
        elements.gameTime.textContent = gameTime;
        if (gameTime <= 0) {
            clearInterval(timer);
            endSpeedGame();
        }
    }, 1000);
    
    // Create words periodically
    const wordInterval = setInterval(() => {
        if (gameTime <= 0) {
            clearInterval(wordInterval);
            return;
        }
        createFallingWord();
    }, 1500);
    
    // Store intervals for cleanup
    window.speedGameIntervals = [gameInterval, timer, wordInterval];
    
    // Focus input
    setTimeout(() => elements.gameInput.focus(), 100);
}

function createFallingWord() {
    const word = gameWords[Math.floor(Math.random() * gameWords.length)];
    const wordEl = document.createElement('div');
    wordEl.className = 'falling-word';
    wordEl.textContent = word;
    wordEl.style.left = Math.random() * 80 + '%';
    wordEl.style.top = '0px';
    
    elements.speedGameArea.appendChild(wordEl);
    
    fallingWords.push({
        element: wordEl,
        word: word,
        y: 0,
        speed: wordSpeed + Math.random() * 2
    });
}

function updateSpeedGame() {
    fallingWords.forEach((wordObj, index) => {
        wordObj.y += wordObj.speed;
        wordObj.element.style.top = wordObj.y + 'px';
        
        // Remove if out of bounds
        if (wordObj.y > 400) {
            wordObj.element.remove();
            fallingWords.splice(index, 1);
        }
    });
    
    // Check input
    const input = elements.gameInput.value.trim();
    if (input) {
        fallingWords.forEach((wordObj, index) => {
            if (wordObj.word === input) {
                // Correct word
                gameScore += 10;
                elements.gameScore.textContent = gameScore;
                elements.wordsTyped.textContent = parseInt(elements.wordsTyped.textContent) + 1;
                
                wordObj.element.classList.add('correct');
                setTimeout(() => {
                    wordObj.element.remove();
                    fallingWords.splice(index, 1);
                }, 500);
                
                elements.gameInput.value = '';
                
                // Increase speed every 5 words
                if (gameScore % 50 === 0) {
                    wordSpeed += 0.5;
                }
            }
        });
    }
}

function endSpeedGame() {
    stopSpeedGame();
    alert(`Game Over! Your score: ${gameScore}\nWords typed: ${elements.wordsTyped.textContent}`);
}

function stopSpeedGame() {
    if (window.speedGameIntervals) {
        window.speedGameIntervals.forEach(interval => clearInterval(interval));
    }
    fallingWords = [];
    elements.speedGameArea.innerHTML = '';
}

// Word Shooting Game
let targetWords = [];
let currentTarget = '';
let correctShots = 0;
let totalShots = 0;

function startShootingGame() {
    gameScore = 0;
    correctShots = 0;
    totalShots = 0;
    targetWords = [];
    
    elements.shootingScore.textContent = '0';
    elements.shootingAccuracy.textContent = '100%';
    elements.shootingGameArea.innerHTML = '';
    
    // Set new target
    setNewTarget();
    
    // Create words
    createTargetWords();
    
    // Game loop
    gameInterval = setInterval(updateShootingGame, 100);
    
    // Listen for typing
    document.addEventListener('keydown', handleShootingInput);
}

function setNewTarget() {
    currentTarget = gameWords[Math.floor(Math.random() * gameWords.length)];
    elements.targetWord.textContent = currentTarget;
}

function createTargetWords() {
    // Clear existing words
    elements.shootingGameArea.innerHTML = '';
    targetWords = [];
    
    // Create 10 random words
    for (let i = 0; i < 10; i++) {
        const word = gameWords[Math.floor(Math.random() * gameWords.length)];
        const isTarget = word === currentTarget;
        
        const wordEl = document.createElement('div');
        wordEl.className = 'target-word';
        wordEl.textContent = word;
        wordEl.style.left = Math.random() * 80 + '%';
        wordEl.style.top = Math.random() * 80 + '%';
        wordEl.dataset.word = word;
        wordEl.dataset.correct = isTarget;
        
        if (isTarget) {
            wordEl.style.borderColor = 'var(--secondary)';
            wordEl.style.background = 'rgba(16, 185, 129, 0.1)';
        }
        
        elements.shootingGameArea.appendChild(wordEl);
        targetWords.push(wordEl);
    }
}

function handleShootingInput(e) {
    if (e.key.length === 1 || e.key === 'Enter') {
        // Find and "shoot" the target word
        targetWords.forEach(wordEl => {
            if (wordEl.textContent === currentTarget) {
                totalShots++;
                if (wordEl.dataset.correct === 'true') {
                    correctShots++;
                    gameScore += 20;
                    elements.shootingScore.textContent = gameScore;
                    
                    // Visual feedback
                    wordEl.style.animation = 'explode 0.5s forwards';
                    setTimeout(() => {
                        wordEl.remove();
                        setNewTarget();
                        createTargetWords();
                    }, 500);
                }
                
                // Update accuracy
                const accuracy = Math.round((correctShots / totalShots) * 100);
                elements.shootingAccuracy.textContent = `${accuracy}%`;
            }
        });
    }
}

function updateShootingGame() {
    // Move words slightly for animation
    targetWords.forEach(wordEl => {
        const x = parseFloat(wordEl.style.left) + (Math.random() - 0.5) * 2;
        const y = parseFloat(wordEl.style.top) + (Math.random() - 0.5) * 2;
        
        wordEl.style.left = Math.max(0, Math.min(80, x)) + '%';
        wordEl.style.top = Math.max(0, Math.min(80, y)) + '%';
    });
}

function stopShootingGame() {
    clearInterval(gameInterval);
    document.removeEventListener('keydown', handleShootingInput);
    targetWords = [];
}

// Share score
function shareScore() {
    const score = elements.wpmResult.textContent;
    const accuracy = elements.accuracyResult.textContent;
    const text = `I scored ${score} WPM with ${accuracy} accuracy on Typing Master! Try it:`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Typing Test Score',
            text: text,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(text).then(() => {
            alert('Score copied to clipboard!');
        });
    }
}

// Take screenshot
function takeScreenshot() {
    if (typeof html2canvas !== 'undefined') {
        html2canvas(elements.resultsSection).then(canvas => {
            const link = document.createElement('a');
            link.download = 'typing-score.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    } else {
        alert('Screenshot feature not available. Please check your internet connection.');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Typing area events
    elements.typingArea.addEventListener('input', updateHighlighting);
    elements.typingArea.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') backspaceCount++;
    });
    
    // Button events
    elements.startBtn.addEventListener('click', startTest);
    elements.resetBtn.addEventListener('click', resetTest);
    elements.pauseBtn.addEventListener('click', pauseTest);
    elements.englishBtn.addEventListener('click', () => switchLanguage('english'));
    elements.hindiBtn.addEventListener('click', () => switchLanguage('hindi'));
    elements.timerClockBtn.addEventListener('click', () => switchClockMode('timer'));
    elements.freeClockBtn.addEventListener('click', () => switchClockMode('free'));
    
    // Share buttons
    document.getElementById('shareBtn')?.addEventListener('click', shareScore);
    document.getElementById('screenshotBtn')?.addEventListener('click', takeScreenshot);
    
    // Tab switching
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            switchTab(tabId);
        });
    });
    
    // Game input
    elements.gameInput.addEventListener('input', () => {
        // Input handled in game loop
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+Enter to start test
        if (e.ctrlKey && e.key === 'Enter' && !testActive) {
            e.preventDefault();
            startTest();
        }
        // Ctrl+R to reset
        if (e.ctrlKey && e.key === 'r' && testActive) {
            e.preventDefault();
            resetTest();
        }
        // Ctrl+P to pause
        if (e.ctrlKey && e.key === 'p' && testActive) {
            e.preventDefault();
            pauseTest();
        }
        // Escape to exit game
        if (e.key === 'Escape' && currentGame) {
            exitGame();
        }
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initApp);
