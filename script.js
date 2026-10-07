const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");

const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 30);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

menuToggle.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.querySelector(".sr-only").textContent = isOpen ? "Close menu" : "Open menu";
  document.body.classList.toggle("menu-open", isOpen);
});

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.querySelector(".sr-only").textContent = "Open menu";
    document.body.classList.remove("menu-open");
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

document.querySelector(".newsletter form").addEventListener("submit", (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button");
  button.textContent = "✓";
  button.setAttribute("aria-label", "Subscribed");
});

const chatbot = document.querySelector("[data-chatbot]");
const chatbotTrigger = document.querySelector("[data-chatbot-trigger]");
const chatbotPanel = document.querySelector("[data-chatbot-panel]");
const chatbotClose = document.querySelector("[data-chatbot-close]");
let chatbotTonePending = false;

const playChatbotTone = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = new AudioContext();
  if (context.state === "suspended") {
    context.close();
    throw new Error("Audio playback requires a user gesture");
  }
  const now = context.currentTime;
  const notes = [
    { frequency: 880, start: 0, duration: 0.16 },
    { frequency: 1174.66, start: 0.1, duration: 0.2 }
  ];

  notes.forEach(({ frequency, start, duration }) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now + start);
    gain.gain.exponentialRampToValueAtTime(0.08, now + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now + start);
    oscillator.stop(now + start + duration);
  });

  window.setTimeout(() => context.close(), 700);
};

const openChatbot = () => {
  chatbotPanel.hidden = false;
  chatbotTrigger.setAttribute("aria-expanded", "true");
  chatbotTrigger.classList.remove("is-noticed");
};

const closeChatbot = () => {
  chatbotPanel.hidden = true;
  chatbotTrigger.setAttribute("aria-expanded", "false");
};

const showChatbotInvite = () => {
  chatbotTrigger.classList.add("is-noticed");
  try {
    playChatbotTone();
  } catch {
    chatbotTonePending = true;
  }
};

window.setTimeout(showChatbotInvite, 8000);
chatbotTrigger.addEventListener("click", openChatbot);
chatbotClose.addEventListener("click", closeChatbot);
chatbot.querySelector("[data-chatbot-contact]").addEventListener("click", closeChatbot);

document.addEventListener("pointerdown", () => {
  if (!chatbotTonePending) return;
  chatbotTonePending = false;
  try {
    playChatbotTone();
  } catch {
    chatbotTonePending = true;
  }
}, { once: true });
