import json
import urllib.request

url = 'https://resume-chat.sreespark3000.workers.dev'
data = json.dumps({'message': 'Does Subhashini have zero to one product launch experience?'}).encode('utf-8')
req = urllib.request.Request(
    url,
    data=data,
    headers={
        'Content-Type': 'application/json',
        'Origin': 'https://resume-chat-64l.pages.dev',
    },
)

try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        print(resp.status)
        print(dict(resp.headers))
        print(resp.read().decode('utf-8'))
except Exception as e:
    print(type(e).__name__, e)
