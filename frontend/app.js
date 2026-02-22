const Config = {
  BACKEND_URL: "http://localhost:8000",
  MAX_FILE_MB: 20,
};

const State = {
  hasDocument: false,
  isLoading: false,
  documents: [],
};

const API = {
  async upload(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${Config.BACKEND_URL}/ingest`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    return res.json();
  },

  async query(question) {
    const res = await fetch(`${Config.BACKEND_URL}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    if (!res.ok) throw new Error(`Query failed: ${res.status}`);
    return res.json();
  },
};

const UI = {
  elements: {
    chat:          () => document.getElementById("chat"),
    questionInput: () => document.getElementById("questionInput"),
    sendBtn:       () => document.getElementById("sendBtn"),
    docStatus:     () => document.getElementById("docStatus"),
    docList:       () => document.getElementById("docList"),
    sidebar:       () => document.getElementById("sidebar"),
    welcome:       () => document.getElementById("welcomeScreen"),
  },

  toggleSidebar() {
    this.elements.sidebar().classList.toggle("collapsed");
  },

  autoResize(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 160) + "px";
  },

  handleInputKeydown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      Chat.send();
    }
  },

  sendSuggestion(text) {
    const input = this.elements.questionInput();
    input.value = text;
    this.autoResize(input);
    Chat.send();
  },

  showToast(message, type = "info") {
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();

    const icons = { info: "⟳", success: "✓", error: "✕" };
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  },

  setLoading(loading) {
    State.isLoading = loading;
    this.elements.sendBtn().disabled = loading;
  },

  hideWelcome() {
    const welcome = this.elements.welcome();
    if (welcome) {
      welcome.style.display = "none";
    }
  },

  ensureChatInner() {
    const chat = this.elements.chat();
    let inner = chat.querySelector(".chat-inner");
    if (!inner) {
      inner = document.createElement("div");
      inner.className = "chat-inner";
      chat.appendChild(inner);
    }
    return inner;
  },

  addDocumentToSidebar(fileName) {
    const docStatus = this.elements.docStatus();
    const docList = this.elements.docList();

    docStatus.style.display = "none";

    const ext = fileName.split(".").pop().toUpperCase();
    const item = document.createElement("div");
    item.className = "doc-item";
    item.innerHTML = `
      <span class="doc-item-icon">◈</span>
      <span class="doc-item-name" title="${fileName}">${fileName}</span>
      <span class="doc-item-badge">${ext}</span>
    `;
    docList.appendChild(item);
  },

  createMessageEl(text, type) {
    const wrapper = document.createElement("div");
    wrapper.className = `message ${type}`;

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = type === "bot" ? "AI" : "You";

    const bubble = document.createElement("div");
    bubble.className = "bubble";

    if (type === "bot") {
      bubble.innerHTML = `
        <div class="bubble-content">${this.formatText(text)}</div>
        <button class="copy-btn" onclick="Chat.copyBubble(this)" title="Copy">⧉</button>
      `;
    } else {
      bubble.textContent = text;
    }

    if (type === "user") {
      wrapper.appendChild(bubble);
      wrapper.appendChild(avatar);
    } else {
      wrapper.appendChild(avatar);
      wrapper.appendChild(bubble);
    }

    return wrapper;
  },

  createLoadingEl() {
    const wrapper = document.createElement("div");
    wrapper.className = "message bot";

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = "AI";

    const bubble = document.createElement("div");
    bubble.className = "loading-bubble";
    bubble.innerHTML = "<span></span><span></span><span></span>";

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    return wrapper;
  },

  scrollToBottom() {
    const chat = this.elements.chat();
    chat.scrollTop = chat.scrollHeight;
  },

  formatText(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />");
  },
};

const Uploader = {
  init() {
    const fileInput = document.getElementById("fileInput");
    fileInput.addEventListener("change", () => this.handleFile(fileInput.files[0]));
  },

  validate(file) {
    const maxBytes = Config.MAX_FILE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new Error(`File too large. Max size is ${Config.MAX_FILE_MB}MB.`);
    }
  },

  async handleFile(file) {
    if (!file) return;

    try {
      this.validate(file);
      UI.showToast("Uploading document…", "info");

      await API.upload(file);

      State.hasDocument = true;
      State.documents.push(file.name);

      UI.addDocumentToSidebar(file.name);
      UI.showToast(`"${file.name}" uploaded successfully`, "success");
    } catch (err) {
      console.error("Upload error:", err);
      UI.showToast(err.message || "Upload failed. Please try again.", "error");
    }

    document.getElementById("fileInput").value = "";
  },
};

const Chat = {
  addMessage(text, type) {
    UI.hideWelcome();
    const inner = UI.ensureChatInner();
    const el = UI.createMessageEl(text, type);
    inner.appendChild(el);
    UI.scrollToBottom();
  },

  async send() {
    if (State.isLoading) return;

    const input = UI.elements.questionInput();
    const question = input.value.trim();
    if (!question) return;

    this.addMessage(question, "user");
    input.value = "";
    input.style.height = "auto";

    UI.setLoading(true);

    const inner = UI.ensureChatInner();
    const loadingEl = UI.createLoadingEl();
    inner.appendChild(loadingEl);
    UI.scrollToBottom();

    try {
      const data = await API.query(question);
      loadingEl.remove();
      this.addMessage(data.answer, "bot");
    } catch (err) {
      loadingEl.remove();
      console.error("Query error:", err);
      this.addMessage("Something went wrong. Please try again.", "bot");
      UI.showToast("Request failed.", "error");
    } finally {
      UI.setLoading(false);
    }
  },

  copyBubble(button) {
    const text = button.parentElement.querySelector(".bubble-content").innerText;
    navigator.clipboard.writeText(text).then(() => {
      button.textContent = "✓";
      setTimeout(() => { button.textContent = "⧉"; }, 1400);
    }).catch(() => {
      UI.showToast("Clipboard access denied.", "error");
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  Uploader.init();
});
