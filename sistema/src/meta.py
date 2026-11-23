import sys, json, pathlib
from playwright.sync_api import sync_playwright
html, lang, out = sys.argv[1], sys.argv[2], sys.argv[3]
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width':1080,'height':1920})
    pg.goto(pathlib.Path(html).resolve().as_uri()+'#'+lang); pg.wait_for_timeout(400)
    try: pg.wait_for_function('window.READY===1', timeout=5000)
    except Exception: pass
    json.dump({'dur':pg.evaluate('window.DUR'),'sfx':pg.evaluate('window.SFX||[]')},open(out,'w')); b.close()
