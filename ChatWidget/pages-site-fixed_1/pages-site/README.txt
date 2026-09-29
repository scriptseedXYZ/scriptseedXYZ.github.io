Before uploading this folder to Cloudflare Pages:

1. Open config.js in Notepad.
2. Replace PASTE-YOUR-WORKER-URL-HERE with your full Worker URL, for example:
   https://resume-chat.example-subdomain.workers.dev
3. Save config.js.
4. Upload the contents of this pages-site folder to Cloudflare Pages.

Cloudflare will then give you a Pages URL. Copy the origin only, for example:
https://subhashini-resume-chat.pages.dev

That exact value is what you later put in the Worker's ALLOWED_ORIGIN variable.
