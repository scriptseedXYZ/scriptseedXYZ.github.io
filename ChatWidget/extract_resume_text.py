import zipfile
import re
import xml.etree.ElementTree as ET
from pathlib import Path

source = Path(r'c:\Projects\Profile\ChatWidget\Subhashini_Rajamani_Resume (4).docx')
out = Path(r'c:\Projects\Profile\ChatWidget\resume-context.txt')

with zipfile.ZipFile(source) as z:
    xml_bytes = z.read('word/document.xml')

root = ET.fromstring(xml_bytes)
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
paragraphs = []

for p in root.findall('.//w:p', ns):
    texts = []
    for t in p.findall('.//w:t', ns):
        if t.text:
            texts.append(t.text)
    if texts:
        joined = ''.join(texts)
        joined = re.sub(r'\s+', ' ', joined).strip()
        if joined:
            paragraphs.append(joined)

text = '\n\n'.join(paragraphs)
out.write_text(text, encoding='utf-8')
print(text[:20000])
print('---WROTE---', out)
