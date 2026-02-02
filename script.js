// Typing Animation
const typed = new Typed('.text-animate', {
    strings: ['React Developer', 'Full-Stack Developer', 'MERN Specialist'],
    typeSpeed: 80,
    backSpeed: 50,
    backDelay: 1000,
    loop: true
});

// mobile navbar start

/* === এই অংশটুকু আগের কোড মুছে দিয়ে বসান === */

let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

// ১. মেনু টগল (ক্লিক করলে মেনু আসবে এবং আইকন 'X' হবে)
menuIcon.onclick = () => {
    menuIcon.querySelector('i').classList.toggle('bx-x'); // Close icon toggle
    navbar.classList.toggle('active'); // মেনু স্লাইড toggle
};

// ২. মেনুর লিংকে ক্লিক করলে মেনু অটো বন্ধ হয়ে যাবে
let navLinks = document.querySelectorAll('.navbar a');

navLinks.forEach(link => {
    link.onclick = () => {
        menuIcon.querySelector('i').classList.remove('bx-x');
        navbar.classList.remove('active');
    };
});

// ৩. স্ক্রল করলে হেডার স্টিকি হবে এবং খোলা মেনু বন্ধ হবে
window.onscroll = () => {
    let header = document.querySelector('.header');
    header.classList.toggle('sticky', window.scrollY > 100);

    // স্ক্রল করলে অটোমেটিক মেনু বন্ধ করার জন্য
    menuIcon.querySelector('i').classList.remove('bx-x');
    navbar.classList.remove('active');
};
// mobile nabar end

// Mobile Navbar Toggle
document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll('.counter');
    
    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = parseInt(counter.getAttribute('data-target'));
                const count = parseInt(counter.innerText);
                const increment = target / 100;

                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateCounters();
            observer.disconnect(); 
        }
    }, { threshold: 0.5 });

    const targetSection = document.querySelector('.stats-wrapper');
    if(targetSection) {
        observer.observe(targetSection);
    }
});


// common question start

function toggleFaq(element) {
    // Shudhu ekta ekebare open thakbe (Optional)
    const allItems = document.querySelectorAll('.faq-item');
    allItems.forEach(item => {
        if (item !== element) item.classList.remove('active');
    });

    // Current item toggle
    element.classList.toggle('active');
}

// common question end


// popup massage start



// popup massage end


// ai chatbot start
// ১. ডাটা এবং কনফিগুরেশন
let chatbotData = { knowledge_base: [], default_answer: "আমি দুঃখিত, আপনার প্রশ্নটি বুঝতে পারছি না।" };
const GEMINI_API_KEY = ""; 

// ২. JSON ডাটা লোড করা (আপনার পোর্টফোলিও তথ্যের জন্য)
async function loadChatData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error("JSON file not found");
        chatbotData = await response.json();
        console.log("Aethera Knowledge Loaded!");
    } catch (error) {
        console.error("JSON লোড করতে সমস্যা: নিশ্চিত করুন data.json ফাইলটি মেইন ফোল্ডারে আছে।");
    }
}
window.addEventListener('load', loadChatData);

// ৩. চ্যাট ইউজার ইন্টারফেস (UI) কন্ট্রোল
function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    const dot = document.getElementById('notification-dot');
    const popup = document.getElementById('pop-up-message');

    if (chatWindow) {
        chatWindow.classList.toggle('hidden');
        // চ্যাট খুললে নোটিফিকেশন হাইড হবে
        if (!chatWindow.classList.contains('hidden')) {
            if (dot) dot.classList.add('hidden');
            if (popup) popup.classList.remove('show-popup');
        }
    }
}

function closeChatWindow() {
    const chatWindow = document.getElementById('chat-window');
    if (chatWindow) chatWindow.classList.add('hidden');
}

// ৫ সেকেন্ড পর অটো পপ-আপ মেসেজ
window.addEventListener('load', () => {
    setTimeout(() => {
        const dot = document.getElementById('notification-dot');
        const popup = document.getElementById('pop-up-message');
        const chatWindow = document.getElementById('chat-window');
        
        if (chatWindow && chatWindow.classList.contains('hidden')) {
            if (dot) dot.classList.remove('hidden');
            if (popup) popup.classList.add('show-popup');
        }
    }, 5000);
});

// ৪. মেসেজ হ্যান্ডলিং (মেইন লজিক)
async function sendMessage() {
    const inputField = document.getElementById('user-input');
    const msg = inputField.value.trim();
    if (!msg) return;

    // ইউজারের মেসেজ স্ক্রিনে দেখানো
    appendMsg('user-msg', msg);
    inputField.value = "";

    const userInput = msg.toLowerCase();
    
    // ক. প্রথমে JSON ফাইল চেক করা (আপনার নির্দিষ্ট উত্তর থাকলে)
    const found = chatbotData.knowledge_base.find(item => 
        item.keywords.some(keyword => userInput.includes(keyword.toLowerCase()))
    );

    if (found) {
        setTimeout(() => {
            appendMsg('ai-msg', found.answer);
        }, 800);
    } else {
        // খ. JSON-এ না থাকলে Gemini AI কল করা
        const loadingDiv = appendMsg('ai-msg', "Aethera is thinking..."); 
        const aiResponse = await askGeminiAI(msg);
        
        // লোডিং লেখাটি সরিয়ে আসল উত্তর বসানো
        loadingDiv.innerText = aiResponse;
    }
}

// ৫. Gemini API কল (Error Handling সহ)
async function askGeminiAI(prompt) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: `You are Aethera, the AI assistant of MD Monirujjaman. Keep answers short and professional. User asked: ${prompt}` }]
            }]
        })
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();

        // ফিক্স: এখানে চেক করা হচ্ছে ডাটা ঠিকঠাক এসেছে কি না
        if (data && data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            console.warn("API limit or safety issue:", data);
            return "I'm having trouble thinking right now. Please try again later.";
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        return "Connection lost! Please check your internet or API key.";
    }
}

// ৬. মেসেজ স্ক্রিনে রেন্ডার করা
function appendMsg(type, text) {
    const body = document.getElementById('chat-body');
    if (!body) return;

    const div = document.createElement('div');
    div.classList.add('msg', type);
    div.innerText = text;
    body.appendChild(div);
    
    // অটো স্ক্রোল ডাউন
    body.scrollTop = body.scrollHeight; 
    return div; 
}

// ৭. এন্টার বাটন হ্যান্ডলিং
document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('user-input');
    if (inputField) {
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
});
async function askGeminiAI(prompt) {
    // এখানে URL-টি ভালো করে লক্ষ্য করুন, কোনো স্পেস বা ভুল ক্যারেক্টার যেন না থাকে
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: `You are Aethera, the AI assistant of MD Monirujjaman. Answer this professionally: ${prompt}` }]
            }]
        })
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();

        // ৪০৪ এরর এবং ডাটা চেক করার জন্য এই অংশটি জরুরি
        if (response.ok && data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            // যদি এপিআই লিমিট শেষ হয় বা অন্য সমস্যা থাকে
            console.error("API Error Details:", data);
            return "I am currently unable to process your request. Please try again later.";
        }
    } catch (error) {
        console.error("Network Error:", error);
        return "Connection lost! Please check your internet.";
    }
}
// ai bot end