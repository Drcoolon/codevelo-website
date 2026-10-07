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
const chatbotSound = document.querySelector("[data-chatbot-sound]");
chatbotSound.volume = 0.25;
chatbotSound.load();

const playChatbotSound = () => {
  chatbotSound.currentTime = 0;
  const playback = chatbotSound.play();
  if (playback) {
    playback.catch((error) => {
      console.warn("The chatbot click sound could not be played.", error);
    });
  }
};

const openChatbot = () => {
  chatbotPanel.hidden = false;
  chatbotTrigger.setAttribute("aria-expanded", "true");
};

const closeChatbot = () => {
  chatbotPanel.hidden = true;
  chatbotTrigger.setAttribute("aria-expanded", "false");
};

chatbotTrigger.addEventListener("pointerdown", playChatbotSound);
chatbotTrigger.addEventListener("click", openChatbot);
chatbotClose.addEventListener("click", closeChatbot);
chatbot.querySelector("[data-chatbot-contact]").addEventListener("click", closeChatbot);
