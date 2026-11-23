import sys, pathlib, subprocess
from playwright.sync_api import sync_playwright
html, lang, mode = sys.argv[1], sys.argv[2], sys.argv[3]
fps = int(sys.argv[4]) if len(sys.argv) > 4 else 30
url = pathlib.Path(html).resolve().as_uri() + '#' + lang
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1080, 'height': 1920}, device_scale_factor=1)
    pg.goto(url); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(400)
    try: pg.wait_for_function('window.READY===1', timeout=5000)
    except Exception: pass
    if mode.startswith('stills:'):
        _, d, ts = mode.split(':'); pathlib.Path(d).mkdir(parents=True, exist_ok=True)
        for t in ts.split(','):
            pg.evaluate(f'seek({t})'); pg.screenshot(path=f'{d}/{lang}_{t}.png')
    elif mode.endswith('.png'):
        pg.screenshot(path=mode)
    else:
        dur = pg.evaluate('window.DUR'); n = int(dur * fps)
        ff = subprocess.Popen(['ffmpeg','-loglevel','error','-y','-f','image2pipe','-framerate',str(fps),'-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','17','-preset','medium',mode], stdin=subprocess.PIPE)
        for i in range(n):
            pg.evaluate(f'seek({i/fps})'); ff.stdin.write(pg.screenshot(type='jpeg', quality=92))
        ff.stdin.close(); ff.wait()
    b.close()
