# 🦊 Niko — AI-Powered LeetCode Helper

**Niko** is a smart Chrome extension designed to help developers master Data Structures and Algorithms (DSA). Instead of giving away the answer, Niko acts as a personal tutor by providing progressive, AI-generated hints that guide you toward the solution while keeping your logical thinking sharp.

---

### ✨ Key Features
* 🧠 **3-Level Hint System:** Get "Starter," "Logic," and "Optimized" hints to solve problems progressively without spoilers.
* 🤖 **LLM Integration:** Securely connect your own API keys (OpenAI, Gemini, etc.) for personalized AI assistance.
* 🚀 **Seamless Experience:** Injected directly into the LeetCode UI for a distraction-free practice session.
* 🔒 **Secure Storage:** Uses Chrome’s local storage to keep your API keys and preferences safe and private.
* 💡 **Logic-First Approach:** Specifically designed to build problem-solving habits rather than just providing code.

---

### 🛠️ Tech Stack
* **Core:** JavaScript (ES6+), HTML5, CSS3
* **Extension APIs:** Chrome Manifest V3, Storage API, Scripting API
* **AI Integration:** LLM REST APIs

---

### 📂 Project Structure

```bash
# Niko Extension Directory
# ├── manifest.json       # Extension configuration (V3)
# ├── popup/              # Extension UI (Settings & API Key)
# │   ├── popup.html
# │   ├── popup.js
# │   └── popup.css
# ├── scripts/            # Logic & API Handling
# │   ├── content.js      # Injects UI into LeetCode
# │   └── background.js   # Service worker for API requests
# └── assets/             # Icons and Branding
🚀 Future Improvements
📊 Progress Tracker: Save which hints were used to identify weak topics.

🗣️ Multilingual Support: AI hints in multiple local languages.

🎨 Custom Themes: Dark mode and minimalist UI options for the hint box.

---

### 🔒 Security & Privacy
Niko is built with a "Privacy-First" architecture to ensure your sensitive data remains yours:
* **Local Storage Only:** Your API keys are stored using `chrome.storage.local`. They are never sent to our servers or stored in the cloud.
* **Direct Communication:** The extension communicates directly from your browser to the LLM provider (e.g., OpenAI/Gemini). No middle-man server is used.
* **Zero Data Logging:** We do not track the problems you solve or the hints you generate.

👤 Author
Manish Kurhe
🎓 B.Tech in AI & Data Science

💡 Focused on building tools that bridge the gap between AI and Education.
