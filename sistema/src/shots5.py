import pathlib,sys
from playwright.sync_api import sync_playwright
u=pathlib.Path('build/w45.html').resolve().as_uri()
jobs=[(l,k) for l in ('ca','es') for k in ('p1','p2','p3','p4','p5','p6','p7','cv10','cv11')]+[('ca','s10'),('ca','s11')]
with sync_playwright() as p:
    b=p.chromium.launch()
    for l,k in jobs:
        h=1080 if k.startswith('p') else 1920
        pg=b.new_page(viewport={'width':1080,'height':h}); pg.goto(u+f'#{l}-{k}'); pg.wait_for_function('window.READY===1'); pg.wait_for_timeout(200)
        pg.screenshot(path=f'out/W45/{k}-{l}.png'); pg.close()
