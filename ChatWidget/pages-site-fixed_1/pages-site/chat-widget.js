/* Resume-chat controller with a local fallback if the Worker is unavailable. */
(function () {
  "use strict";
  const FALLBACK_ANSWER = "I can help with Subhashini's experience, skills, projects, education, certifications, and contact details. Please try a more specific question.";

  function localAnswer(question, knowledge) {
    const text = question.toLowerCase();
    const match = Object.entries(knowledge || {}).find(([keywords]) => keywords.split("|").some((word) => text.includes(word.trim())));
    return match ? match[1] : FALLBACK_ANSWER;
  }

  class ResumeChat {
    constructor({ workerUrl, fallbackKnowledge, onStatus } = {}) {
      this.workerUrl = workerUrl || window.RESUME_CHAT_WORKER_URL;
      this.fallbackKnowledge = fallbackKnowledge || {};
      this.onStatus = onStatus || (() => {});
    }

    async ask(message) {
      const question = String(message || "").trim();
      if (!question) return "";
      if (!this.workerUrl || this.workerUrl.includes("PASTE-YOUR-WORKER-URL-HERE")) {
        this.onStatus("fallback");
        return localAnswer(question, this.fallbackKnowledge);
      }
      try {
        this.onStatus("thinking");
        const response = await fetch(this.workerUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: question }),
          signal: AbortSignal.timeout(12_000),
        });
        const data = await response.json();
        // The Worker intentionally returns a 429 with a friendly answer on
        // question six. Show that answer instead of treating it as a failure.
        if (data.answer) {
          this.onStatus(data.limited ? "limited" : "online");
          return data.answer;
        }
        throw new Error(`Worker returned ${response.status}`);
      } catch (error) {
        console.warn("Resume AI unavailable; using local fallback.", error);
        this.onStatus("fallback");
        return localAnswer(question, this.fallbackKnowledge);
      }
    }
  }
  window.ResumeChat = ResumeChat;
})();
