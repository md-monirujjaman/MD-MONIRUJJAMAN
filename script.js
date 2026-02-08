// Typing Animation
const typed = new Typed('.text-animate', {
    strings: ['React Developer', 'Full-Stack Developer', 'MERN Specialist'],
    typeSpeed: 80,
    backSpeed: 50,
    backDelay: 1000,
    loop: true
});

// mobile navbar start

// ১. ক্লাসগুলো সিলেক্ট করা
const menu = document.querySelector('.navbar-menu');
const menuBtn = document.querySelector('.navbar-toggle');

// ২. হ্যামবার্গার আইকনে ক্লিক করলে মেনু ওপেন/ক্লোজ হবে
menuBtn.addEventListener('click', function() {
    menu.classList.toggle('active');      // মেনু স্লাইড করে আনবে
    menuBtn.classList.toggle('is-active'); // আইকনটিকে X এ পরিণত করবে
});

// ৩. (অপশনাল) মেনুর কোনো লিংকে ক্লিক করলে মেনু অটোমেটিক বন্ধ হয়ে যাবে
// এটি মোবাইল ইউজারদের জন্য খুব সুবিধাজনক
const navLinks = document.querySelectorAll('.navbar-links, .letstalkbtn');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove('active');
        menuBtn.classList.remove('is-active');
    });
});
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

const containers = document.querySelectorAll('.container');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.2 });

containers.forEach(container => observer.observe(container));

// education and certificate end


// curser animtation start

const trailContainer = document.getElementById('magic-trail-container');

window.addEventListener('mousemove', (e) => {
    // একবারে ৩টি করে পার্টিকেল তৈরি হবে যাতে ট্রেইলটি ঘন (Dense) মনে হয়
    for (let i = 0; i < 3; i++) {
        createParticle(e.clientX, e.clientY);
    }
});

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'magic-particle';
    
    // মাউসের পজিশনে সামান্য র‍্যান্ডম পরিবর্তন যাতে ট্রেইলটি ন্যাচারাল লাগে
    const offset = (Math.random() - 0.5) * 10;
    particle.style.left = (x + offset) + 'px';
    particle.style.top = (y + offset) + 'px';
    
    // র‍্যান্ডম সাইজ (কিছু বড়, কিছু ছোট)
    const size = Math.random() * 6 + 2 + 'px';
    particle.style.width = size;
    particle.style.height = size;

    trailContainer.appendChild(particle);

    // ১.৫ সেকেন্ড পর পার্টিকেলটি রিমুভ করা
    setTimeout(() => {
        particle.remove();
    }, 1500);
}


// curser animation end

// review section start

var swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    loop: false, // এটি আপাতত false করে দিন কারণ আপনার স্লাইড সংখ্যা কম
    slidesPerView: "auto",
    speed: 800,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    coverflowEffect: {
        rotate: 0,
        stretch: 0, // এটি -100 থেকে কমিয়ে 0 করুন, অনেক সময় নেগেটিভ ভ্যালু ক্রোম নিতে পারে না
        depth: 100,
        modifier: 2.5,
        slideShadows: false,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    }
});

// review section end

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