# Renders the default share cards: public/og/default-{en,bn}.jpg (1200x630).
# Usage (repo root): pip install playwright && python -m playwright install chromium && python scripts/og-card.py
import base64, pathlib, tempfile
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[1]
F=str(ROOT/"app"/"fonts"); P=str(ROOT/"public")
TMP=pathlib.Path(tempfile.mkdtemp()); OUT=ROOT/"public"/"og"; OUT.mkdir(parents=True, exist_ok=True)
def b64(p): return base64.b64encode(pathlib.Path(p).read_bytes()).decode()
fonts=f"""
@font-face{{font-family:News;src:url(data:font/woff2;base64,{b64(F+'/newsreader-latin-wght-normal.woff2')}) format('woff2');font-weight:200 800}}
@font-face{{font-family:NewsI;src:url(data:font/woff2;base64,{b64(F+'/newsreader-latin-wght-italic.woff2')}) format('woff2');font-weight:200 800}}
@font-face{{font-family:Hanken;src:url(data:font/woff2;base64,{b64(F+'/hanken-grotesk-latin-wght-normal.woff2')}) format('woff2');font-weight:100 900}}
@font-face{{font-family:Tiro;src:url(data:font/woff2;base64,{b64(P+'/fonts/bn/tiro-bangla-400.v1.woff2')}) format('woff2')}}
@font-face{{font-family:Hind;src:url(data:font/woff2;base64,{b64(P+'/fonts/bn/hind-siliguri-500.v1.woff2')}) format('woff2');font-weight:500}}
"""
photo=b64(P+'/uploads/hero/hospital-building.webp'); logo=b64(P+'/logo.png')
copy={
 "en":dict(eyebrow="Multi-specialty hospital · Dhaka",h='Trusted care for Dhaka families for <i>over 33 years</i>',sub="Monowara Hospital (Pvt.) Ltd.",tag="54 Siddeshwari Road",line1="24/7 Emergency & admission",line2="Hotline 09611 622333",body="Hanken",head="News"),
 "bn":dict(eyebrow="সিদ্ধেশ্বরী, ঢাকা",h='৩৩ বছরেরও বেশি সময় ধরে ঢাকার পরিবারের <i>আস্থার চিকিৎসা</i>',sub="মনোয়ারা হসপিটাল (প্রা.) লি.",tag="৫৪ সিদ্ধেশ্বরী রোড",line1="২৪/৭ জরুরি বিভাগ ও ভর্তি",line2="হটলাইন ০৯৬১১ ৬২২৩৩৩",body="Hind",head="Tiro"),
}
for lang,c in copy.items():
    italic = "NewsI" if lang=="en" else "Tiro"
    html=f"""<!doctype html><html><head><meta charset=utf-8><style>{fonts}
*{{margin:0;box-sizing:border-box}}
body{{width:1200px;height:630px;background:#f6f3ec;font-family:{c['body']},Hind;color:#0c2a2d;position:relative;overflow:hidden}}
.grain{{position:absolute;inset:0;opacity:.35;background-image:radial-gradient(rgba(12,42,45,.06) 1px,transparent 1px);background-size:4px 4px}}
.left{{position:absolute;left:72px;top:64px;width:640px;bottom:64px;display:flex;flex-direction:column}}
.logo{{height:52px;width:auto;align-self:flex-start}}
.eyebrow{{margin-top:56px;font-size:20px;letter-spacing:{'.14em' if lang=='en' else '0'};text-transform:uppercase;color:#006a70;font-weight:600;display:flex;align-items:center;gap:14px}}
.eyebrow:before{{content:"";width:40px;height:1px;background:#006a70}}
h1{{margin-top:22px;font-family:{c['head']},Tiro;font-weight:400;font-size:{62 if lang=='en' else 54}px;line-height:{1.05 if lang=='en' else 1.32};letter-spacing:-.01em}}
h1 i{{font-family:{italic};font-style:{'italic' if lang=='en' else 'normal'};color:#00858c}}
.sub{{margin-top:18px;font-family:{c['head']},Tiro;font-size:26px;color:#3a5154}}
.foot{{margin-top:auto;border-top:1px solid #d9d2c3;padding-top:20px;display:flex;gap:28px;font-size:22px;font-weight:600}}
.foot .dot{{display:inline-block;width:10px;height:10px;border-radius:50%;background:#c2402c;margin-right:10px;vertical-align:middle}}
.foot span+span{{color:#006a70}}
.arch{{position:absolute;right:64px;top:56px;width:360px;height:518px;border-radius:180px 180px 18px 18px;overflow:hidden;background:#0b3c3f}}
.arch img{{width:100%;height:100%;object-fit:cover}}
.arch:after{{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,38,41,0) 55%,rgba(7,38,41,.55))}}
.ring{{position:absolute;right:48px;top:40px;width:392px;height:550px;border-radius:196px 196px 26px 26px;border:1px solid #62c2c7}}
.tag{{position:absolute;right:96px;bottom:92px;z-index:2;color:#f6f3ec;font-family:{c['body']},Hanken;font-size:18px;font-weight:600;letter-spacing:{'.08em' if lang=='en' else 0}}}
</style></head><body><div class=grain></div>
<div class=left><img class=logo src="data:image/png;base64,{logo}">
<div class=eyebrow>{c['eyebrow']}</div><h1>{c['h']}</h1><div class=sub>{c['sub']}</div>
<div class=foot><span><i class=dot></i>{c['line1']}</span><span>{c['line2']}</span></div></div>
<div class=ring></div><div class=arch><img src="data:image/webp;base64,{photo}"></div>
<div class=tag>{c['tag']}</div>
</body></html>"""
    (TMP/f"{lang}.html").write_text(html, encoding="utf-8")
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":1200,"height":630})
    for lang in copy:
        pg.goto((TMP/f"{lang}.html").as_uri()); pg.wait_for_timeout(400)
        pg.screenshot(path=str(OUT/f"default-{lang}.jpg"),type="jpeg",quality=86)
    b.close()
