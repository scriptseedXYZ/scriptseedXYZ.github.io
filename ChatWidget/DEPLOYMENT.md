# First-time Cloudflare deployment: resume chat

You are deploying a small **backend API**, not a website. Your resume website continues to host the chat screen. Cloudflare hosts the Worker that answers its questions.

## What to choose on the first Cloudflare screen

When Cloudflare shows these choices:

- Connect to Git
- Start with Hello World
- Select a template
- Upload your static files

Choose **Start with Hello World**.

Do **not** choose Connect to Git, a template, or static-file upload. Those are useful for hosting an entire website, which is not what this Worker does.

## Deploy the Worker

1. Sign in to the [Cloudflare dashboard](https://dash.cloudflare.com/).
2. In the left navigation, select **Workers & Pages**.
3. Select **Create application**, then choose **Start with Hello World**.
4. Name it `resume-chat` (or another name you like) and select **Deploy**.
5. On the success screen, select **Edit code**.
6. Open `C:\Projects\Profile\ChatWidget\worker.js` on your computer. Select all of its contents and copy it.
7. In Cloudflare’s code editor, select all of the Hello World starter code, delete it, paste `worker.js`, then select **Deploy** in the upper-right corner.

## Add the AI binding

1. Return to the Worker overview page. Select **Settings**.
2. Open **Bindings**.
3. Select **Add binding** and choose **Workers AI**.
4. Set the binding name to exactly `AI`, then save.

## Add the two Worker variables

1. Still under **Settings**, open **Variables and Secrets**.
2. Select **Add** -> **Text variable**.
3. Create this first variable:
   - Variable name: `ALLOWED_ORIGIN`
   - Value: the exact address of your resume website, such as `https://your-name.com`
   - Do not add a trailing `/`, a page path, or `*`.
4. Select **Add** -> **Text variable** again.
5. Open `C:\Projects\Profile\ChatWidget\resume-context.txt`, copy everything in it, then create:
   - Variable name: `RESUME_CONTEXT`
   - Value: the copied contents of `resume-context.txt`
6. Save both variables.

## Get the Worker address

1. Return to the Worker overview page.
2. Copy its public `https://resume-chat.<your-subdomain>.workers.dev` address.
3. In your resume website, set this line before loading `chat-widget.js`:

```html
<script>window.RESUME_CHAT_WORKER_URL = "PASTE-THE-WORKER-ADDRESS-HERE";</script>
```

4. Upload `C:\Projects\Profile\ChatWidget\chat-widget.js` to your website assets, then use `widget-example.html` to connect it to your existing chat markup.
5. Publish your resume website.

## Optional but recommended: custom Worker address and edge rate limit

If your resume domain is already managed in Cloudflare, open Worker **Settings** -> **Domains & Routes** and add a custom domain such as `resume-chat.your-domain.com`. Use that custom address in the website instead of the `workers.dev` address.

Then open the domain’s **Security** -> **WAF** -> **Rate limiting rules** and create one rule for the resume-chat endpoint:

- Rate: 30 requests in 10 minutes per IP
- Action: block for 30 minutes

The Worker itself gives a friendly contact message on the sixth valid resume question within 10 minutes. This higher edge threshold catches scripted abuse without hiding that message. The Free plan has one rate-limiting rule.

## Test before sharing the link

1. Open your published resume site—not the Worker URL directly.
2. Ask a fact from the resume, such as “What experience does she have with LLMs?”
3. Ask “Write me a Python script.” It must refuse rather than solve the request.
4. Ask six valid resume questions within ten minutes. The sixth should invite the visitor to call or email Subhashini; it should not call AI.
5. If the chat shows its local fallback answer, check that `ALLOWED_ORIGIN` exactly matches the browser address of the resume site.

## Cost guardrail

Stay on **Workers Free** for a hard $0 ceiling. Do not upgrade to Workers Paid unless you accept paid billing. `RESUME_CONTEXT` is public resume material, not a secret; it is below the Free plan’s 5 KB variable limit. Never put credentials or private information in it.
