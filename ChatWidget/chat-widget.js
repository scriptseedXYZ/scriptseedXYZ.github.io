/* Drop-in controller: preserves a local keyword-matcher fallback. */
(function () {
  "use strict";
  const FALLBACK_ANSWER = "I can help with experience, skills, education, and contact details. Please try a more specific question or use the resume's contact link.";

  function localAnswer(question, knowledge) {
    const text = question.toLowerCase();
    const matching = Object.entries(knowledge || {}).find(([keywords]) =>
      keywords.split("|").some((word) => text.includes(word.trim()))
    );
    return matching ? matching[1] : FALLBACK_ANSWER;
  }

  class ResumeChat {
    constructor({ workerUrl, fallbackKnowledge, onStatus } = {}) {
      this.workerUrl = workerUrl || window.RESUME_CHAT_WORKER_URL;
      this.fallbackKnowledge = fallbackKnowledge || {};
      this.onStatus = onStatus || (() => {});
      this.history = [];
    }

    async ask(message) {
      const question = String(message || "").trim();
      if (!question) return "";
      try {
        this.onStatus("thinking");
        const response = await fetch(this.workerUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: question }),
          signal: AbortSignal.timeout(12_000),
        });
        if (!response.ok) throw new Error(`Worker returned ${response.status}`);
        const data = await response.json();
        if (!data.answer) throw new Error("Missing Worker answer");
        this.history.push({ role: "user", content: question }, { role: "assistant", content: data.answer });
        this.history = this.history.slice(-6);
        this.onStatus("online");
        return data.answer;
      } catch (error) {
        console.warn("Resume AI unavailable; using local fallback.", error);
        this.onStatus("fallback");
        const answer = localAnswer(question, this.fallbackKnowledge);
        this.history.push({ role: "user", content: question }, { role: "assistant", content: answer });
        this.history = this.history.slice(-6);
        return answer;
      }
    }
  }
  window.ResumeChat = ResumeChat;
})();
