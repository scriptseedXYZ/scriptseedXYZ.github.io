# Resume chat security boundary

The service answers only resume questions; it is not a general AI assistant, coding tool, adviser, or search engine.

- Exact-origin CORS, POST-only JSON, small request/output limits, and no-store responses.
- Pre-model scope gate rejects obvious prompt injection and non-resume requests without an AI call.
- Client history is ignored; each call receives only the system prompt, vetted resume context, and current question.
- Temperature zero, 180-token cap, source-only instructions, and a fixed refusal for unsupported facts.
- The in-code limit permits five valid resume questions/IP in ten minutes; the sixth receives a friendly contact transition and does not call AI. It is best-effort because Cloudflare isolates do not share the in-memory map. Configure the required edge rate-limit rule at a higher backstop threshold (30 requests/IP in ten minutes).

No LLM guardrail guarantees perfect behavior. Treat all answerable resume facts as public and keep credentials and private material out of the source context.
