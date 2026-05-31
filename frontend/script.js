/* --- State Management and Configuration Vector --- */
let activeProfile = null;
let chatHistory = [];

/* --- Initialization and Global Scroll Intersection Infrastructure --- */
document.addEventListener('DOMContentLoaded', () => {
    const revealNodes = document.querySelectorAll('.reveal');
    
    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealNodes.forEach(node => observer.observe(node));
});

/* --- Identity Generator Core Matrix Computation Engine --- */
async function generateIdentity(event) {
    event.preventDefault();

    // DOM Extraction Points
    const name = document.getElementById('userName').value.trim();
    const age = document.getElementById('userAge').value.trim();
    const goal = document.getElementById('userGoal').value.trim();
    const struggle = document.getElementById('userStruggle').value.trim();
    const timeline = document.getElementById('userTimeline').value.trim();
    const tone = document.getElementById('userTone').value;
    
    const errorBanner = document.getElementById('errorBanner');
    const loadingZone = document.getElementById('loadingZone');
    const loadingText = document.getElementById('loadingText');
    const resultZone = document.getElementById('resultZone');
    const futureForm = document.getElementById('futureForm');
    const submitBtn = document.getElementById('submitFormBtn');

    // Structural Validation Layer
    if(!name || !age || !goal || !struggle || !timeline) {
        showError("Validation metrics must be complete to successfully intercept future vector.");
        return;
    }
    errorBanner.style.display = 'none';

    // Transition UI State Matrix
    futureForm.style.display = 'none';
    loadingZone.style.display = 'block';
    resultZone.style.display = 'none';
    submitBtn.disabled = true;

    // Array of systemic progress narratives for micro-interaction fidelity
    const internalPhrases = [
        "Decrypting temporal vector parameters...",
        "Analyzing present resistance variables...",
        "Isolating 1-year target operational parameters...",
        "Assembling future identity matrix...",
        "Generating emotional response patterns...",
        "Synthesizing high-leverage directives..."
    ];
    
    let phraseCycle = 0;
    const phraseTimer = setInterval(() => {
        if(phraseCycle < internalPhrases.length - 1) {
            phraseCycle++;
            loadingText.innerText = internalPhrases[phraseCycle];
        }
    }, 600);

    const payload = {
        name,
        age,
        goal,
        struggle,
        oneYearVision: timeline,
        tone
    };

    try {
        // Execute Core Vector Synthesis via Express Backend API
        const response = await fetch('/api/generate-futureme', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        clearInterval(phraseTimer);

        if (!response.ok || !result.success) {
            throw new Error(result.error || "FutureMe could not respond right now. Try again.");
        }

        const data = result.data;
        activeProfile = payload; // Store profile context

        // Render Computed Output Payload to DOM
        document.getElementById('computedMessage').innerText = data.message;
        document.getElementById('computedIdentity').innerText = data.futureIdentity;
        
        const movesContainer = document.getElementById('computedMoves');
        movesContainer.innerHTML = ""; // Reset previous list
        data.nextMoves.forEach(move => {
            const li = document.createElement('li');
            li.innerText = move;
            movesContainer.appendChild(li);
        });

        document.getElementById('computedHabit').innerText = data.habit;
        document.getElementById('computedWarning').innerText = data.warning;
        document.getElementById('computedMantra').innerText = data.mantra;

        // Reset and prime Chat Section
        initializeChatSystem(name, tone);

        // Toggle Presentation States Smoothly
        loadingZone.style.display = 'none';
        resultZone.style.display = 'block';
        
        triggerToast("Future identity matrix successfully synchronized.");

    } catch (error) {
        clearInterval(phraseTimer);
        console.error("Identity Generation Error:", error);
        
        // Restore Form State
        loadingZone.style.display = 'none';
        futureForm.style.display = 'block';
        submitBtn.disabled = false;
        
        showError(error.message || "FutureMe could not respond right now. Try again.");
    }
}

/* --- Error Display Utility --- */
function showError(msg) {
    const errorBanner = document.getElementById('errorBanner');
    errorBanner.innerText = msg;
    errorBanner.style.display = 'block';
    errorBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    triggerToast(msg, true);
}

/* --- Toast Notification Controller --- */
function triggerToast(message, isError = false) {
    const toast = document.getElementById('shareToast');
    const toastMsg = document.getElementById('toastMsg');
    
    toastMsg.innerText = message;
    
    if (isError) {
        toast.classList.add('toast-error');
    } else {
        toast.classList.remove('toast-error');
    }

    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

/* --- Copy Results to Clipboard --- */
function copyResult() {
    if (!activeProfile) return;

    const name = activeProfile.name;
    const message = document.getElementById('computedMessage').innerText;
    const identity = document.getElementById('computedIdentity').innerText;
    const habit = document.getElementById('computedHabit').innerText;
    const warning = document.getElementById('computedWarning').innerText;
    const mantra = document.getElementById('computedMantra').innerText;
    
    const moves = Array.from(document.querySelectorAll('#computedMoves li'))
                       .map((li, index) => `${index + 1}. ${li.innerText}`)
                       .join('\n');

    const copyText = `🔮 FUTUREME REFLECTION MATRIX FOR ${name.toUpperCase()} 🔮\n\n` +
                     `💬 MESSAGE FROM FUTURE SELF:\n"${message}"\n\n` +
                     `👤 FUTURE IDENTITY:\n${identity}\n\n` +
                     `🚀 NEXT 3 HIGH-LEVERAGE MOVES:\n${moves}\n\n` +
                     `🔄 DAILY HABIT TO START:\n${habit}\n\n` +
                     `⚠️ FUTURE WARNING:\n${warning}\n\n` +
                     `✨ DAILY MANTRA:\n"${mantra}"\n\n` +
                     `Generated with FutureMe - Meet the version of you who already made it.`;

    navigator.clipboard.writeText(copyText)
        .then(() => triggerToast("Reflection matrix copied to clipboard."))
        .catch(err => {
            console.error("Clipboard copy failed:", err);
            triggerToast("Copy failed. Please copy text manually.", true);
        });
}

/* --- Reset and Form Regeneration --- */
function regenerateIdentity() {
    const futureForm = document.getElementById('futureForm');
    const resultZone = document.getElementById('resultZone');
    const submitBtn = document.getElementById('submitFormBtn');
    
    resultZone.style.display = 'none';
    futureForm.style.display = 'block';
    submitBtn.disabled = false;
    
    futureForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* --- Scroll and Focus Chat --- */
function activateChat() {
    const chatSection = document.getElementById('chat');
    chatSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    setTimeout(() => {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) chatInput.focus();
    }, 800);
}

/* --- Chat Interface Synchronization Engine --- */
function initializeChatSystem(name, tone) {
    const historyBox = document.getElementById('chatHistoryBox');
    const chatForm = document.getElementById('chatForm');
    
    // Clear list of mockup/locked elements
    historyBox.innerHTML = "";
    chatForm.style.display = 'flex';
    
    // Prime the conversational context
    chatHistory = [];
    
    // Adaptable premium contextual introductory prompts
    const welcomePrompts = {
        "Motivational": `I am here, ${name}. We successfully achieved our trajectory milestones. I am so proud of you for keeping the faith. Ask me anything about the path ahead — let's lock it in.`,
        "Brutally Honest": `Synchronized, ${name}. Let's cut the noise. You know exactly what you've been avoiding. Ask me a question, but don't ask it unless you are ready to implement the answer.`,
        "Calm Mentor": `I am here, ${name}. Take a deep breath. Looking back, I can tell you that the friction you feel is just refining you. Let's speak. What has been weighing on you?`,
        "CEO Mode": `Paradigm synchronized, ${name}. The operational blueprint is active and our metrics are verified. What execution roadblocks or resource limitations can I help you optimize today?`
    };

    const initialGreeting = welcomePrompts[tone] || welcomePrompts["Motivational"];
    
    // Render initial future bubble
    appendChatBubble('future', initialGreeting);
    chatHistory.push({ role: 'futureme', message: initialGreeting });
}

/* --- Append Bubble to Scroll History --- */
function appendChatBubble(role, message) {
    const historyBox = document.getElementById('chatHistoryBox');
    
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${role}`;
    bubble.innerText = message;
    
    historyBox.appendChild(bubble);
    historyBox.scrollTop = historyBox.scrollHeight;
}

/* --- Send Dialogue Message Event --- */
async function sendChatMessage(event) {
    event.preventDefault();

    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSendBtn');
    const question = input.value.trim();

    if (!question || !activeProfile) return;

    // Render User bubble
    appendChatBubble('user', question);
    
    // Reset state & disable inputs
    input.value = "";
    input.disabled = true;
    sendBtn.disabled = true;

    // Store history
    chatHistory.push({ role: 'user', message: question });

    // Inject temporary typing indicator
    const historyBox = document.getElementById('chatHistoryBox');
    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-bubble future typing-bubble';
    typingBubble.id = 'typingBubble';
    typingBubble.innerHTML = `
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    historyBox.appendChild(typingBubble);
    historyBox.scrollTop = historyBox.scrollHeight;

    try {
        const response = await fetch('/api/chat-futureme', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userProfile: activeProfile,
                chatHistory,
                question
            })
        });

        const result = await response.json();
        
        // Remove typing indicator
        const indicator = document.getElementById('typingBubble');
        if (indicator) indicator.remove();

        if (!response.ok || !result.success) {
            throw new Error(result.error || "FutureMe could not respond right now. Try again.");
        }

        // Render Future response
        appendChatBubble('future', result.reply);
        chatHistory.push({ role: 'futureme', message: result.reply });

    } catch (error) {
        console.error("Chat dialogue failed:", error);
        
        // Remove typing indicator if still exists
        const indicator = document.getElementById('typingBubble');
        if (indicator) indicator.remove();

        // Print failure alert
        appendChatBubble('future', "FutureMe could not respond right now. Check your network or server logs and try again.");
        triggerToast(error.message || "Failed to contact your future identity.", true);
    } finally {
        // Enable inputs
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
    }
}

// Bind custom trigger placeholder for footer dopamine trigger
function triggerShareToast() {
    if (activeProfile) {
        copyResult();
    } else {
        triggerToast("Create your FutureMe reflection card before sharing!");
    }
}
